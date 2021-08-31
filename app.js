const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.mesage}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getplayersQuery = `
SELECT *

FROM cricket_team
 
`;
  const playerslist = await db.all(getplayersQuery);
  response.send(playerslist);
});

//add player API

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;

  const { player_id, player_name, jersey_number, role } = playerDetails;

  const addplayerQuery = `
 INSERT INTO cricket_team(  player_id,
          player_name,
          jersey_number,
          role)

    VALUES
    (
       ${player_id},
       ${player_name},
       ${jersey_number} ,
       ${role}
    )`;

  const dbResponse = await db.run(addplayerQuery);

  response.send("Player Added to Team");
});

//Get player

app.get("/players/:player_id", async (request, response) => {
  const { player_id } = request.params;

  const getPlayerQuery = `
   SELECT *

   FROM  cricket_team
   WHERE player_id=${player_id}
   
   `;

  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//update player

app.post("/players/:player_id", async (request, response) => {
  const { player_id } = request.params;
  const playerDetails = request.body;

  const upDatePlayer = `
    UPDATE 
    cricket_team

    SET 
    playerName=${player_name},
    jerseyNumber=${jersyNumber},
    role=${role},
    WHERE 
    player_id=${player_id}`;

  await db.run(upDatePlayer);
  response.send("Book updated Sucessfully");
});

//delete player

app.delete("/players/:player_id", async (request, response) => {
  const { player_id } = request.params;
  const playerDeleteQuery = `
   DELETE FROM cricket_team
   WHERE player_id=${player_id}`;

  await db.run(playerDeleteQuery);

  response.send("Book Deleted Sucessfully");
});

module.exports = app;
