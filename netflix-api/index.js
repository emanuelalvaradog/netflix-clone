require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;
const URL = "https://api.themoviedb.org/3";

app.use(cors());

app.get("/", (req, res) => {
  res.send("Netflix API 🥳");
});

app.get("/genres", async (req, res) => {
  try {
    const data = await fetch(
      `${URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`
    );
    const dataJSON = await data.json();
    res.send(dataJSON);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/movies/:genreNumber", async (req, res) => {
  try {
    const { genreNumber } = req.params;
    const data = await fetch(
      `${URL}/discover/movie?api_key=${process.env.API_KEY}&language=en-US&with_genres=${genreNumber}&sort_by=popularity.desc`
    );
    const dataJSON = await data.json();
    res.send(dataJSON);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT}`);
});

module.exports = app;