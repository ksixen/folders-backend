const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes.js");
const errorCodes = require("../errorCodes");
const authMiddleware = require("../funcs/authMiddleware");
const useMe = require("../funcs/useMe");
const router = express.Router();

const getFoldersRequest = router.get(routes.GET_FOLDERS, authMiddleware, async (req, res) => {
    try {
        const {created_by} = req.body
        const me = useMe(req, res)
        if (!me) {
            throw Error(errorCodes["A-02"]('created_by'))
            return
        }
        const select = await surrealDB.query({
            query: `SELECT * from folders WHERE created_by = '${me}'`,
            table: "folders",
        });
        console.log(`SELECT * from folders WHERE created_by = '${me}'`)
        res.status(200).send(await select[0].result);
    } catch (error) {
        console.log(error)
        res.status(400).send("error");
    }
});
module.exports = getFoldersRequest;
