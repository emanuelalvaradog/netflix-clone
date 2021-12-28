class PlayerControl {
  constructor(
    video,
    img,
    videoContainer,
    muted,
    unmuted,
    repeat,
    controlsContainer
  ) {
    this.video = video;
    this.img = img;
    this.videoContainer = videoContainer;
    this.muted = muted;
    this.unmuted = unmuted;
    this.repeat = repeat;
    this.controlsContainer = controlsContainer;
  }
  playVideo() {
    videoContainer.removeChild(videoContainer.children[0]);
    videoContainer.appendChild(video);
    controlsContainer.removeChild(controlsContainer.children[0]);
    controlsContainer.appendChild(muted);
    video.muted = true;
    video.play();
  }
  muteVideo() {
    if (video.muted) {
      controlsContainer.removeChild(muted);
      controlsContainer.appendChild(unmuted);
      video.muted = false;
    } else {
      controlsContainer.removeChild(unmuted);
      controlsContainer.append(muted);
      video.muted = true;
    }
  }
}

const videoContainer = document.querySelector(".mainMovie-video");
const controlsContainer = document.querySelector(".mainMovie-controls");

const img = document.createElement("img");
img.src = "./img/klausStatic.jpg";

const video = document.createElement("video");
video.src = "./img/KlausTrailer.mp4";

const muted = document.createElement("img");
muted.src = "./img/muted.png";

const unmuted = document.createElement("img");
unmuted.src = "./img/unmuted.png";

const repeat = document.createElement("img");
repeat.src = "./img/repeat.png";

const player = new PlayerControl(
  video,
  img,
  videoContainer,
  muted,
  unmuted,
  repeat,
  controlsContainer
);

const button = document.querySelector(".mainMovie-controls");
button.addEventListener("click", () => {
  if (button.firstElementChild.src.includes("repeat")) {
    player.playVideo();
  } else {
    player.muteVideo();
  }
});

let videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        video.pause();
      } else {
        video.play();
      }
    });
  },
  { treshold: 0.3 }
);

videoObserver.observe(video);
