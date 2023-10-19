import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3000;
const URL = "https://api.themoviedb.org/3";

app.use(cors());

// Get the genre list
app.get("/genres", async (req, res, next) => {
  try {
    const data = await fetch(
      `${URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`
    );
    const dataJSON = await data.json();
    res.send(dataJSON);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get movies by genre
app.get("/movies/:genreNumber", async (req, res, next) => {
  try {
    const { genreNumber } = req.params;
    const data = await fetch(
      `${URL}/discover/movie/?api_key=${process.env.API_KEY}&language=en-US&with_genres=${genreNumber}&sort_by=popularity.desc`
    );
    const dataJSON = await data.json();
    res.send(dataJSON);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
