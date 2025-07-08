console.log("Let's write some Javascript");

// Important buttons
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const songinfoimg = document.getElementById("songinfoimg");

// Global variables
let songs = [];
let currentsong = new Audio();
let currentfolder = "fav";
let firstsong = 1;

// Load songs from folder
async function LoadandAttachsongs(folder) {
    let a = await fetch(`Songs/${folder}/`);
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
    Attachsongs(songsarray);
}

// Play a song
const playmusic = (track) => {
    currentsong.src = `Songs/${currentfolder}/${track}.mp3`;
    if (firstsong == 1) {
        document.querySelector(".songinfo").innerHTML = `<img class="invert" id="songinfoimg" src="Assests/SVGS/music.svg" alt=""></img> ${track.replaceAll("%20", " ")}`;
        currentsong.addEventListener("loadedmetadata", () => {
            document.querySelector(".songduration").innerHTML = `0:00  / ${formatTime(currentsong.duration)}`;
        });
        play.src = "Assests/SVGS/play.svg";
        document.querySelector(".circle").style.left = "0%";
        firstsong++;
    } else {
        document.querySelector(".songinfo").innerHTML = `<img class="invert" id="songinfoimg" src="Assests/SVGS/music.svg" alt=""></img> ${track.replaceAll("%20", " ")}`;
        document.querySelector(".songduration").innerHTML = "00 : 00  / 00 : 00";
        currentsong.play();
        play.src = "Assests/SVGS/pause.svg";
        songinfoimg.src = "Assests/SVGS/music.svg";
    }
};

// Attach song list to UI
function Attachsongs(songs) {
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <div class="content flex align-items">
                    <div class="content-part1 flex">
                        <img class="invert music" src="Assests/SVGS/music.svg" alt="music">
                        <div>
                            <div class="song-name">${song.replace(`${currentfolder}`, "").replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("/", "")}</div>
                            <div class="Artist-name">Vijay</div>
                        </div>
                    </div>
                </div>
            </li>`;
    }

    Array.from(document.querySelectorAll(".songlist li")).forEach((li) => {
        li.querySelector(".content-part1").addEventListener("click", () => {
            const track = li.querySelector(".song-name").innerText.trim();
            playmusic(track);
        });
    });

    let song = songs[0];
    playmusic(`${song.replace(`${currentfolder}`, "").replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("/", "").trim()}`);
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins)}:${String(secs).padStart(2, '0')}`;
}

// Main execution
async function main() {
    await LoadandAttachsongs(currentfolder);

    // Seekbar & Time update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML =
            `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        if (currentsong.src && !isNaN(currentsong.duration)) {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = (currentsong.duration * percent) / 100;
        }
    });

    // Hamburger toggle
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left-box").classList.toggle("active");
    });

    // Volume control
    document.querySelector(".range input").addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
        document.querySelector(".volbutton-part-image").src =
            e.target.value == 0 ? "Assests/SVGS/mute.svg" : "Assests/SVGS/volumn.svg";
    });

    document.querySelector(".volbutton-part-image").addEventListener("click", (e) => {
        const img = e.target;
        if (img.src.includes("mute.svg")) {
            img.src = "Assests/SVGS/volumn.svg";
            currentsong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        } else {
            img.src = "Assests/SVGS/mute.svg";
            currentsong.volume = 0;
            document.querySelector(".range input").value = 0;
        }
    });

    // Play/pause
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "Assests/SVGS/pause.svg";
        } else {
            currentsong.pause();
            play.src = "Assests/SVGS/play.svg";
        }
    });

    // Previous/Next buttons
    previous.addEventListener("click", () => {
        let currentsongsrc = `/${currentfolder}/${currentsong.src.split("/").pop()}`;
        let index = songs.indexOf(currentsongsrc);
        if (index > 0) {
            let previoussong = songs[index - 1].replace(`${currentfolder}`, "").replace(".mp3", "").replaceAll("/", "");
            playmusic(previoussong);
        }
    });

    next.addEventListener("click", () => {
        let currentsongsrc = `/${currentfolder}/${currentsong.src.split("/").pop()}`;
        let index = songs.indexOf(currentsongsrc);
        if (index < songs.length - 1) {
            let nextsong = songs[index + 1].replace(`${currentfolder}`, "").replace(".mp3", "").replaceAll("/", "");
            playmusic(nextsong);
        }
    });
}

// Add album cards
async function addalbums() {
    let a = await fetch(`Songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let allas = div.getElementsByTagName("a");

    let albums = [];
    Array.from(allas).forEach(element => {
        if (element.href.includes("/Songs")) {
            albums.push(element.href.split("/").slice(-1));
        }
    });

    for (let index = 1; index < albums.length; index++) {
        let folder = albums[index];
        let infoofalbum = await fetch(`Songs/${folder}/info.json`);
        let responseofalbum = await infoofalbum.json();
        let songContainer = document.querySelector(".song-container");
        songContainer.innerHTML += `
            <div data-folder="${folder}" class="song-card pointer">
                <span><img class="play-button" src="Assests/SVGS/play-button.svg" alt="play-button"></span>
                <img src="Songs/${folder}/coverpage.jpg" alt="">
                <h5>${responseofalbum.tittle}</h5>
                <p>${responseofalbum.description}</p>
            </div>`;
    }

    Array.from(document.getElementsByClassName("song-card")).forEach(e => {
        e.addEventListener("click", async item => {
            currentfolder = item.currentTarget.dataset.folder;
            firstsong = 1;
            await LoadandAttachsongs(currentfolder);
        });
    });
}

main();
addalbums();
