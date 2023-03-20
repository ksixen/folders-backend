const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes.js");
const authMiddleware = require("../funcs/authMiddleware");
const useMe = require("../funcs/useMe");
const router = express.Router();

const deleteFolderRequest = router.delete(
    routes.DELETE_FOLDERS,
    authMiddleware,
    async (req, res) => {
        try {
            const id = String(req.query.id);
            const me = useMe(req, res);
            const legalId = id.includes("folders") ? id : `folders:${id}`;
            const select = await surrealDB.query({
                query: `SELECT * FROM folders WHERE created_by = ${me} AND id = ${legalId}`,
                table: "folders",
            });
            console.log(select, "mr", me)
            if (select[0]?.result[0]?.length > 0) {
                // await surrealDB
                //     .delete({
                //         id: id.includes("folders") ? id : `folders:${id}`,
                //     })
                //     .then(() => res.status(200).send(true))
                //     .catch(() => res.status(400).send("error"));
            } else {
                res.status(403).send(true);
            }
        } catch (error) {
            console.log(error);
            res.status(400).send("error");
        }
    }
);
module.exports = deleteFolderRequest;
