const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes.js");
const { promisify } = require("util");
const crypto = require("crypto");
const scrypt = promisify(crypto.scrypt);
const router = express.Router();
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const errorCodes = require("../errorCodes");

config();

const { SECRET } = process.env;

const registerRequest = router.get(routes.REGISTER, async (req, res) => {
    try {
        const request = req.body;
        const missingArgs = errorCodes["A-02"]
        if (!("login" in request)) {
            res.status(400).send(missingArgs("login"));
            return
        } else if (!("password" in request)) {
            res.status(400).send(missingArgs("password"));
            return
        }
        const select = await surrealDB.query({
            query: `SELECT * FROM users WHERE login = '${request?.login}'`,
            table: "users",
        });

        const user = await select[0]?.result?.length;
        if (user > 0) {
            throw Error(errorCodes["U-03"]);
        }
        const { login, password } = request;

        // SALT
        const salt = crypto.randomBytes(8).toString("hex");
        const hashedBuff = await scrypt(password, salt, 82);
        const hashedSaltPassword = `${hashedBuff.toString("hex")}.${salt}`;

        if (typeof hashedSaltPassword !== "string") {
            throw Error(errorCodes["A-01"]);
        }
        await surrealDB.createTable({
            table: "users",
            props: {
                login: login,
                pass: hashedSaltPassword,
            },
        });
        const token = jwt.sign(
            {
                login,
            },
            SECRET,
            {
                expiresIn: 864e5,
            }
        );
        res.cookie("token", token);

        res.status(200).send("ok");
    } catch (error) {
        res.status(400).send(error);
    }
});
module.exports = registerRequest;
