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

const registerRequest = router.post(routes.REGISTER, async (req, res) => {
    try {
        const request = req.body;
        const missingArgs = errorCodes["A-02"]
        const invalidArgs = errorCodes["A-03"]
        if (!("login" in request)) {
            res.status(400).send(missingArgs("login"));
            return
        } else if (!("password" in request)) {
            res.status(400).send(missingArgs("password"));
            return
        } else if (request?.password?.length < 3 || request?.password?.length > 38) {
            res.status(400).send(invalidArgs("password"));
            return
        } else if (request?.login?.length < 3 || request?.login?.length > 38) {
            res.status(400).send(invalidArgs("login"));
            return
        }
        const select = await surrealDB.query({
            query: `SELECT * FROM users WHERE login = '${request?.login}'`,
            table: "users",
        });

        const user = await select[0]?.result?.length;
        if (user > 0) {
            res.status(400).send(errorCodes["U-03"]);
            return
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
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        const token = jwt.sign(
            {
                login,
            },
            SECRET,
            {
                expiresIn: +expiryDate,
            }
        );
        res.cookie("token", token, {
            expires: expiryDate
        });

        res.status(200).send({
            response: true
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
});
module.exports = registerRequest;
