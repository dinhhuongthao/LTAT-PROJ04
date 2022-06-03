const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusiceBtn = musicList.querySelector("#close");


let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex); // goi ham loadMusic khi window load
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
  console.log(mainAudio);

}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPause = wrapper.classList.contains("paused");
  isMusicPause ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

// Update song current time
mainAudio.addEventListener("timeupdate", (e) => {
  // console.log(e);
  // console.log(e.target);
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime/duration)*100;
  progressBar.style.width = `${progressWidth}%`;
  
  let musicCurrentTime = wrapper.querySelector(".current-time");
  let currMin = Math.floor(currentTime / 60);
  let currSec = Math.floor(currentTime % 60);
  if (currSec < 10) {
    currSec = `0${currSec}`;
  }
  musicCurrentTime.innerText = `${currMin}:${currSec}`;



});

// Update song total duration
mainAudio.addEventListener("loadeddata", () => {
  
  let musicDuration = wrapper.querySelector(".max-duration");
  
  let audioDuration = mainAudio.duration;
  let totalMin = Math.floor(audioDuration / 60);
  let totalSec = Math.floor(audioDuration % 60);
  if (totalSec < 10) {
    totalSec = `0${totalSec}`;
  }
  musicDuration.innerText = `${totalMin}:${totalSec}`;
});

// Update current time by progress bar
progressArea.addEventListener("click", (e) => {
  let progressWidthVal = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  
  mainAudio.currentTime = (clickedOffsetX/progressWidthVal) * songDuration;
  console.log("clicked");
});

// repeat, shuffle
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;

  switch(getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;

  switch(getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      playMusic();
      break;
    case "shuffle":
      let randIndex;
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      } while (randIndex === musicIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusiceBtn.addEventListener("click", () => {
  showMoreBtn.click();
})

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li>
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].name}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].name}" class="audio-duration">3:40</span>
                </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].name}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].name}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
  });
}
