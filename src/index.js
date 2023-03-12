const express = require("express");
const cors = require("cors");
const _http = require("http");
const app = express();
const http = _http.createServer(app);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const staticServe = require("serve-static");
const { config } = require("dotenv");

const constants = require("./constants.js");

const loginRequest = require("./person/login.js");
const registerRequest = require("./person/register.js");
const usersRequest = require("./person/users.js");

const deleteFolderRequest = require("./folders/deleteFolder.js");
const getFoldersRequest = require("./folders/getFolders.js");
const addFolderRequest = require("./folders/addFolder.js");
const surrealDB = require("./surreal.js");

// configuration express.js - start region
config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(staticServe("_domain", { index: ["index.html", "index.html"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.set("trust proxy", "loopback");
// configuration express.js - end region

// ROUTES start region
app.use(addFolderRequest);
app.use(getFoldersRequest);
app.use(deleteFolderRequest);
app.use(loginRequest);
app.use(registerRequest);
app.use(usersRequest);
// ROUTES end region

http.listen(constants.serverPort, () => {
    surrealDB.initDB();
    console.log(`__________________________________________________`);
    console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
    console.log("");
    console.log(`Server started: https://localhost:${constants.serverPort}`);
    console.log(`__________________________________________________`);
    console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
});
