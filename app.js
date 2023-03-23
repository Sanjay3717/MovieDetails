const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (a) {
    console.log(`DB error: ${e.message}`);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

//Get All movie details

app.get("/movies/", async (request, response) => {
  const getMoviesDetails = `select movie_name from movie order by movie_id;`;
  const movieArray = await db.all(getMoviesDetails);
  module.exports = response.send(
    movieArray.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

//Create new movie

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { director_id, movie_name, lead_actor } = movieDetails;
  const addMovieDetails = `insert into movie (director_id,movie_name,lead_actor) values (6,"Jurassic Park","Jeff Goldblum");`;
  const dbResponse = await db.run(addMovieDetails);
  const movieId = dbResponse.lastID;
  response.send("Movie added successfully");
});

//Return movie based on movie id

app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMovieDetails = `select * from movie where movie_id = ${movieId};`;
  const movie = await db.get(getMovieDetails);
  response.send(movie);
});
//Update movie details

app.put("movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  console.log({ movieId });
  const movieDetails = request.body;
  const {
    directorId = 24,
    movieName = "Thor",
    leadActor = "Christopher Hemsworth",
  } = movieDetails;
  const updateMovieQuery = `update movie set director_id = ${directorId}, movie_name = '${movieName}', lead_actor = '{leadActor}' where movie_id = ${movieId} ;`;
  await db.run(updateMovieQuery);
  response.send("Movie added successfully");
});

//Delete a movie

app.delete("movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log({ movieId });
  const movieDetails = request.body;
  const deleteQuery = `delete from movie where movie_id = ${movieId};`;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});

const directorconvertDbObjectToResponseObject = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

//Get Director details

app.get("/directors/", async (request, response) => {
  const getDirectorDetails = `select * from director order by director_id;`;
  const directorDetails = await db.all(getDirectorDetails);
  response.send(
    directorDetails.map((eachPlayer) =>
      directorconvertDbObjectToResponseObject(eachPlayer)
    )
  );
});

//Get movies of a director
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMovies = `select * from director where director_id = ${directorId};`;
  const director = await db.all(getDirectorMovies);
  response.send(director);
});

app.listen(3000, () => {
  console.log("Server is running");
});
