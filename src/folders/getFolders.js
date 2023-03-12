const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes.js");
const router = express.Router();

const getFoldersRequest = router.get(routes.GET_FOLDERS, async (req, res) => {
    try {
        const select = surrealDB.query({
            query: `SELECT * from folders`,
            table: "folders",
        });
        res.status(200).send(await select[0].result);
    } catch (error) {
        res.status(400).send("error");
    }
});
module.exports = getFoldersRequest;
