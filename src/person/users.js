const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes.js");
const router = express.Router();
const authMiddleware = require("../funcs/authMiddleware");
const usersRequest = router.get(
    routes.USERS,
    authMiddleware,
    async (req, res) => {
        try {
            const select = await surrealDB.query({
                query: `SELECT *, NONE AS pass FROM users`,
                table: "users",
            });
            res.status(200).send(select[0]?.result);
        } catch (error) {
            res.status(400).send("error");
        }
    }
);
module.exports = usersRequest;
