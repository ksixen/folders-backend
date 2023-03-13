const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes.js");
const { promisify } = require("util");
const crypto = require("crypto");
const scrypt = promisify(crypto.scrypt);
const router = express.Router();
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

const { SECRET } = process.env;

const registerRequest = router.get(routes.REGISTER, async (req, res) => {
    try {
        const request = req.body;
        if (!("login" in request)) {
            throw Error("'login' is undefined");
        } else if (!("pass" in request)) {
            throw Error("'pass' is undefined");
        }
        const select = await surrealDB.query({
            query: `SELECT * FROM person WHERE login = '${request?.login}'`,
            table: "person",
        });

        const user = await select[0]?.result?.length;
        if (user > 0) {
            throw Error("This login is already in use");
        }
        const { login, pass } = request;

        // SALT
        const salt = crypto.randomBytes(8).toString("hex");
        const hashedBuff = await scrypt(pass, salt, 82);
        const hashedSaltPassword = `${hashedBuff.toString("hex")}.${salt}`;

        if (typeof hashedSaltPassword !== "string") {
            throw Error("Something got wrong. Please, try again!");
        }
        await surrealDB.createTable({
            table: "person",
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
        res.cookie('token', token)

        res.status(200).send("ok");
    } catch (error) {
        res.status(400).send(`${error}`);
    }
});
module.exports = registerRequest;
