const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes.js");
const authMiddleware = require("../funcs/authMiddleware");
const router = express.Router();

const deleteFolderRequest = router.delete(routes.DELETE_FOLDERS, authMiddleware, async (req, res) => {
    try {
        const id = String(req.query.id);
        await surrealDB
            .delete({
                id: id.includes("folders") ? id : `folders:${id}`,
            })
            .then(() => res.status(200).send(true))
            .catch(() => res.status(400).send("error"));
    } catch (error) {
        console.log(error);
        res.status(400).send("error");
    }
});
module.exports = deleteFolderRequest;
