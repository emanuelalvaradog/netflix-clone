const fetch = (api_url) => {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url, true);
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        xhttp.status === 200
          ? resolve(JSON.parse(xhttp.responseText))
          : reject(new Error("Test Error", api_url));
      }
    };
    xhttp.send();
  });
};

const API = "https://secure-escarpment-59792.herokuapp.com";

function cardHoverOn(n) {
  const node = n.currentTarget;
  node.classList.add("card");
}

function cardHoverOff(n) {
  const node = n.currentTarget;
  node.classList.remove("card");
}

const genres = await fetch(`${API}/genres`);
const moviesList = genres.genres;
const app = document.querySelector(".app");

const parent = document.createElement("div");
parent.className = "carouselContainer";

app.insertAdjacentElement("beforeend", parent);

moviesList.forEach(async (genre) => {
  let observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => {
          return entry.isIntersecting;
        })
        .forEach((entry) => {
          const elementContainer = entry.target;
          const imageContainer = elementContainer.firstChild;
          const image = imageContainer.firstChild;
          const url = image.dataset.src;
          image.src = url;
          delete image.dataset.src;
          observer.unobserve(elementContainer);
        });
    },
    { rootMargin: "30px" }
  );

  // Api Data
  const moviesByGenre = await fetch(`${API}/movies/${genre.id}`);

  // const parent = document.querySelector(".carouselContainer");
  const carouselContainer = document.createElement("div");
  carouselContainer.classList.add("carouselContainer-carousel");
  const carouselElements = document.createElement("div");
  carouselElements.classList.add("carousel-movies");

  // Carousel title by genre
  const carouselTitle = document.createElement("div");
  carouselTitle.classList.add("carousel-title");
  const carouselTitleTxt = document.createElement("p");
  carouselTitleTxt.innerText = genre.name;
  carouselTitle.appendChild(carouselTitleTxt);

  for (let i = 0; i < moviesByGenre.results.length; i++) {
    const element = document.createElement("div");
    element.classList.add("movie");

    // Poster from movies array
    const elementPosterContainer = document.createElement("div");
    elementPosterContainer.classList.add("movie-poster");
    const elementPoster = document.createElement("img");
    elementPoster.dataset.src = `https://image.tmdb.org/t/p/original${moviesByGenre.results[i].poster_path}`;
    elementPosterContainer.appendChild(elementPoster);

    const elementInfo = document.createElement("div");
    elementInfo.classList.add("movie-info");

    // Movie Title
    const movieTitle = document.createElement("div");
    movieTitle.classList.add("movie-title");
    const movieTitleTxt = document.createElement("p");
    movieTitleTxt.innerText = moviesByGenre.results[i].title;
    movieTitle.appendChild(movieTitleTxt);

    const movieNumbers = document.createElement("div");
    movieNumbers.classList.add("movie-numbers");

    // Random likelihood number
    const likelihoodInfo = document.createElement("div");
    likelihoodInfo.classList.add("likelihood");
    const likelihoodInfoTxt = document.createElement("p");
    const likenum = Math.floor(Math.random() * (100 - 84 + 1) + 84);
    likelihoodInfoTxt.innerText = `${likenum}%`;
    likelihoodInfo.appendChild(likelihoodInfoTxt);

    // Random movie length
    const lengthInfo = document.createElement("div");
    lengthInfo.classList.add("length");
    const lengthInfoTxt = document.createElement("p");
    const lengthnum = Math.floor(Math.random() * (137 - 68 + 1) + 68);
    lengthInfoTxt.innerText = `${lengthnum} min`;
    lengthInfo.appendChild(lengthInfoTxt);

    // Set genre names from object
    const genresInfo = document.createElement("div");
    genresInfo.classList.add("genres");
    for (let j = 0; j < moviesByGenre.results[i].genre_ids.length; j++) {
      const genreInfoTxt = document.createElement("p");
      moviesList.map((genre) => {
        if (genre.id == moviesByGenre.results[i].genre_ids[j]) {
          genreInfoTxt.innerText = genre.name;
          genresInfo.appendChild(genreInfoTxt);
        }
      });
    }

    movieNumbers.append(likelihoodInfo, lengthInfo);

    const overviewInfo = document.createElement("div");
    overviewInfo.classList.add("overview");
    const overviewInfoTxt = document.createElement("p");
    overviewInfoTxt.innerText = moviesByGenre.results[i].overview;
    overviewInfo.appendChild(overviewInfoTxt);

    elementInfo.append(movieTitle, movieNumbers, genresInfo, overviewInfo);

    element.append(elementPosterContainer, elementInfo);
    observer.observe(element);
    carouselElements.append(element);
    carouselContainer.append(carouselTitle, carouselElements);
  }

  const nodes = [...carouselElements.children].slice(0);

  nodes.forEach((el) => {
    el.addEventListener("mouseenter", cardHoverOn);

    el.addEventListener("mouseleave", cardHoverOff);
  });

  // Carousel controls
  const carouselControls = document.createElement("div");
  carouselControls.className = "carouselControls";
  const leftContainer = document.createElement("span");
  const leftControl = document.createElement("i");
  leftControl.className = "fas fa-chevron-left prev";

  leftContainer.addEventListener("click", () => {
    const offset = carouselElements.offsetWidth;
    carouselElements.scrollLeft -= offset;
  });

  leftContainer.appendChild(leftControl);
  const rightContainer = document.createElement("span");
  const rightControl = document.createElement("i");
  rightControl.className = "fas fa-chevron-right next";
  rightContainer.appendChild(rightControl);

  rightContainer.addEventListener("click", () => {
    const offset = carouselElements.offsetWidth;
    carouselElements.scrollLeft += offset;
  });
  carouselControls.append(leftContainer, rightContainer);

  carouselElements.insertAdjacentElement("afterbegin", carouselControls);
  parent.appendChild(carouselContainer);
});
