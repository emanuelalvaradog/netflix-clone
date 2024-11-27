// index.js
const express = require("express");
const app = express();
const PORT = 4000;
const URL = "https://api.themoviedb.org/3";

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.get("/", (req, res) => {
  res.send("Netflix API 🥳");
});

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

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Export the Express API
module.exports = allowCors(app);
