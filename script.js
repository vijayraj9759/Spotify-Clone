console.log("Let's write some Javascript");

// Important buttons
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const songinfoimg = document.getElementById("songinfoimg");

//Declare some global variables 
let songs = [];
let currentsong = new Audio();   // Make a variable which store the current song
let currentfolder = "fav";
let firstsong = 1;

// fetch song from server 
async function LoadandAttachsongs(folder) {
    let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songsarray = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songsarray.push(element.href.split(/Songs/)[1]);
        }
    }
    songs = songsarray;
    Attachsongs(songsarray)
}

// Play music 
const playmusic = (track) => {
    currentsong.src = `/Songs/` + `${currentfolder}/` + track + `.mp3`;
    if (firstsong == 1) {
        document.querySelector(".songinfo").innerHTML = `<img class="invert" id="songinfoimg" src="Assests/SVGS/music.svg" alt=""></img> ` + track.replaceAll("%20", " ");
        currentsong.addEventListener("loadedmetadata", () => {
            document.querySelector(".songduration").innerHTML = `0:00  / ${formatTime(currentsong.duration)}`;
        })
        play.src = "Assests/SVGS/play.svg";
        document.querySelector(".circle").style.left = "0%";
        firstsong++;
    }
    else {
        document.querySelector(".songinfo").innerHTML = `<img class="invert" id="songinfoimg" src="Assests/SVGS/music.svg" alt=""></img> ` + track.replaceAll("%20", " ");
        document.querySelector(".songduration").innerHTML = "00 : 00  / 00 : 00";
        currentsong.play();
        play.src = "Assests/SVGS/pause.svg";
        songinfoimg.src = "Assests/SVGS/music.svg"
    }
}

// Attach the songs from playlist to library
function Attachsongs(songs) {
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                                <div class="content flex align-items">
                                    <div class="content-part1 flex">
                                        <img  class="invert music" src="Assests/SVGS/music.svg " alt="music">
                                        <div>
                                            <div class="song-name">${song.replace(`${currentfolder}`, "").replaceAll("%20", " ").replaceAll(".mp3", " ").replaceAll("/", "")} </div>
                                            <div class="Artist-name">Vijay</div>
                                        </div>
                                    </div>
                                </div>
                            </li>`;
    }

    // ✅ Attach click events to play songs
    Array.from(document.querySelectorAll(".songlist li")).forEach((li) => {
        li.querySelector(".content-part1").addEventListener("click", () => {
            const track = li.querySelector(".song-name").innerText.trim();
            playmusic(track);
        });
    });

    let song = songs[0];
    playmusic(`${song.replace(`${currentfolder}`, "").replaceAll("%20", " ").replaceAll(".mp3", " ").replaceAll("/", "").trim()}`)

}


// change seconds time in format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMins = String(mins).padStart(1, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}

// main function
async function main() {
    await LoadandAttachsongs(currentfolder)

    //Play songs from library
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.querySelector(".content-part1").addEventListener("click", () => {
            playmusic(e.querySelector(".song-name").innerHTML.trim())
        })

    })

    // Timing update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // update the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        if (currentsong.src && !isNaN(currentsong.duration)) {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = (currentsong.duration * percent) / 100;
        }
    })

    //Add a hamburger bar feature
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left-box").classList.toggle("active");
    });



    //Add Event listener on volumn button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
        if (e.target.value == 0) {
            document.querySelector(".volbutton-part-image").src = "Assests/SVGS/mute.svg"
        }
        else {
            document.querySelector(".volbutton-part-image").src = "Assests/SVGS/volumn.svg"
        }
    })

    // Add Event Listener on volumn button to mute
    document.querySelector(".volbutton-part-image").addEventListener("click", (e) => {
        if (e.target.src == "http://127.0.0.1:5500/Assests/SVGS/Volumn.svg") {
            e.target.src = "http://127.0.0.1:5500/Assests/SVGS/mute.svg";
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = "http://127.0.0.1:5500/Assests/SVGS/Volumn.svg";
            currentsong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


    //Event listener on play button
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "Assests/SVGS/pause.svg";
        }
        else {
            currentsong.pause()
            play.src = "Assests/SVGS/play.svg";
        }
    })

    // Add Event listener on previous Button
    previous.addEventListener("click", () => {
        let currentsongsrc = `/${currentfolder}` + "/" + currentsong.src.split("/").slice(-1);
        let index = songs.indexOf(currentsongsrc);
        let previoussong = songs[index - 1].replace(`${currentfolder}`, "").replace(".mp3", "").replaceAll("/", "");
        playmusic(previoussong)
    })

    // Add Event listener on Next Button
    next.addEventListener("click", () => {
        let currentsongsrc = `/${currentfolder}` + "/" + currentsong.src.split("/").slice(-1)
        let index = songs.indexOf(currentsongsrc);
        let nextsong = songs[index + 1].replace(`${currentfolder}`, "").replace(".mp3", "").replaceAll("/", "");
        playmusic(nextsong);
    });



}


async function addalbums() {
    let a = await fetch(`http://127.0.0.1:5500/Songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let allas = div.getElementsByTagName("a")

    let albums = [];
    Array.from(allas).forEach(element => {
        if (element.href.includes("/Songs")) {
            albums.push(element.href.split("/").slice(-1))
        }
    });

    for (let index = 1; index < albums.length; index++) {
        let folder = albums[index];
        let infoofalbum = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`);
        let responseofalbum = await infoofalbum.json()
        let songContainer = document.querySelector(".song-container")
        songContainer.innerHTML = songContainer.innerHTML + `<div data-folder="${folder}" class="song-card pointer">
                            <span><img class="play-button" src="Assests/SVGS/play-button.svg" alt="play-button"></span>
                            <img src="Songs/${folder}/coverpage.jpg" alt="">
                            <h5>${responseofalbum.tittle}</h5>
                            <p>${responseofalbum.description}</p>
                        </div>`
    }

    // Add folder in the page
    Array.from(document.getElementsByClassName("song-card")).forEach(e => {
        e.addEventListener("click", async item => {
            currentfolder = item.currentTarget.dataset.folder
            firstsong = 1;
            await LoadandAttachsongs(currentfolder)
        })
    });
}

main()
addalbums()
