const app = document.querySelector(".app");

function queryMatch(mobileQuery) {
  if (mobileQuery.matches) {
    class PlayerControl {
      constructor(
        video,
        img,
        videoContainer,
        muted,
        unmuted,
        repeat,
        controlsContainer,
        dataContainer,
        videoObserver
      ) {
        this.video = video;
        this.img = img;
        this.videoContainer = videoContainer;
        this.muted = muted;
        this.unmuted = unmuted;
        this.repeat = repeat;
        this.controlsContainer = controlsContainer;
        this.dataContainer = dataContainer;
        this.videoObserver = videoObserver;
      }

      loadStatic() {
        videoContainer.removeChild(videoContainer.children[0]);
        videoContainer.appendChild(img);
        controlsContainer.removeChild(controlsContainer.children[0]);
        controlsContainer.appendChild(repeat);
        dataContainer.children[1].style.opacity = "1";
        dataContainer.style.top = "18vw";
        dataContainer.children[0].style.width = "35rem";
        dataContainer.children[1].style.visibility = "visible";
      }

      loadVideo() {
        videoContainer.removeChild(videoContainer.children[0]);
        videoContainer.appendChild(video);
        controlsContainer.removeChild(controlsContainer.children[0]);
        controlsContainer.appendChild(muted);
        video.muted = true;
        video.play();
        setTimeout(() => {
          dataContainer.style.top = "55vh";
          dataContainer.children[0].style.width = "32rem";
          dataContainer.children[1].style.top = "22vh";
          dataContainer.children[1].style.opacity = "0";
          dataContainer.children[1].style.visibility = "hidden";
        }, 3500);
      }

      listenVideo(isObserving) {
        if (!isObserving) {
          videoObserver.unobserve(videoContainer);
          videoObserver.disconnect();
          this.loadStatic();
        } else {
          this.loadVideo();
          videoObserver.observe(videoContainer);
        }
      }

      played() {
        return !video.played.length == 0;
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

    const videoObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          player.loadVideo();
        } else {
          player.loadStatic();
        }
      },
      { threshold: 0.6 }
    );

    // Main DOM
    // const mainMovie = document.querySelector(".mainMovie");
    const mainMovie = document.createElement("div");
    mainMovie.className = "mainMovie";
    app.insertAdjacentElement("afterbegin", mainMovie);

    // First Container
    const mainMovieData = document.createElement("div");
    mainMovieData.className = "mainMovie-data";
    const movieDataStatic = document.createElement("img");
    movieDataStatic.src = "./netflix-front/img/klausNetflix.png";
    const movieDataText = document.createElement("p");
    movieDataText.innerText =
      "A selfish postman and a reclusive toymaker form an unlikely friendship, delivering joy to a cold, dark town that desperately needs it.";
    mainMovieData.append(movieDataStatic, movieDataText);

    // Second Container
    const movieControls = document.createElement("div");
    movieControls.className = "mainMovie-controls";
    const movieControlsImg = document.createElement("img");
    movieControlsImg.src = "./netflix-front/img/repeat.png";
    movieControls.appendChild(movieControlsImg);

    // Third Container
    const movieVideo = document.createElement("div");
    movieVideo.className = "mainMovie-video";
    const movieVideoContent = document.createElement("img");
    movieVideoContent.src = "./netflix-front/img/klausStatic.jpg";
    movieVideo.appendChild(movieVideoContent);

    mainMovie.append(mainMovieData, movieControls, movieVideo);
    app.insertAdjacentElement("afterbegin", mainMovie);

    const videoContainer = document.querySelector(".mainMovie-video");
    const controlsContainer = document.querySelector(".mainMovie-controls");
    const dataContainer = document.querySelector(".mainMovie-data");

    const img = document.createElement("img");
    img.src = "./netflix-front/img/klausStatic.jpg";

    const video = document.createElement("video");
    video.src = "./netflix-front/img/KlausTrailer.mp4";

    const muted = document.createElement("img");
    muted.src = "./netflix-front/img/muted.png";

    const unmuted = document.createElement("img");
    unmuted.src = "./netflix-front/img/unmuted.png";

    const repeat = document.createElement("img");
    repeat.src = "./netflix-front/img/repeat.png";

    const player = new PlayerControl(
      video,
      img,
      videoContainer,
      muted,
      unmuted,
      repeat,
      controlsContainer,
      dataContainer,
      videoObserver
    );

    const button = document.querySelector(".mainMovie-controls");
    button.addEventListener("click", () => {
      if (button.firstElementChild.src.includes("repeat")) {
        player.listenVideo(true);
      } else {
        player.muteVideo();
      }
    });

    window.onload = () => {
      setTimeout(() => {
        if (!player.played()) {
          player.listenVideo(true);
        }
      }, 5000);
    };

    video.addEventListener("ended", () => {
      player.listenVideo(false);
    });
  } else {
    // const header = document.querySelector(".header-container");
    if (app.firstElementChild) {
      // console.log(app.firstElementChild);
      app.removeChild(app.firstElementChild);
    }
    // header.removeChild(header.children[1]);
    // header.children[0].removeChild(header.children[0].children[1]);
  }
}

const mobileQuery = window.matchMedia("(min-width: 760px)");
queryMatch(mobileQuery);
mobileQuery.addEventListener("change", () => {
  queryMatch(mobileQuery);
});
