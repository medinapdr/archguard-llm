const express = require("express");

const UserRoute = require("./src/Routes/UserRoute")

const app = express();

app.use(express.json())

app.use(UserRoute)

app.listen(3002, () => console.log("Server listening on port 3002..."))
