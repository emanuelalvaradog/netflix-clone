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

const genres = await fetch(`${API}/genres`);
const genresList = genres.genres;

let movieList = [];
genresList.map(async (genre) => {
  const genreMovies = await fetch(`${API}/movies/${genre.id}`);
  for (let i = 0; i < genreMovies.results.length; i++) {
    movieList.push({
      genreId: genre.id,
      genre: genre.name,
      title: genreMovies.results[i].title,
      overview: genreMovies.results[i].overview,
      voteAverage: genreMovies.results[i].vote_average,
      posterPath: genreMovies.results[i].poster_path,
    });
  }
});

console.log(movieList);

// Separate movies by genre
// Make array with movies by genre
