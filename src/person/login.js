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
const loginRequest = router.post(routes.LOGIN, async (req, res) => {
    try {
        const { password, login } = req.body;
        const select = await surrealDB.query({
            query: `SELECT * from users WHERE login = "${login}"`,
            table: "users",
        });
        const user = await select[0]?.result[0];
        if (user && password) {
            const [hashed, salt] = user.pass.split(".");
            const hashedBuff = await scrypt(password, salt, 82);

            const isValid = hashed === hashedBuff.toString("hex");
            if (isValid) {
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

                res.status(200).send(true);
            } else {
                res.status(400).send(errorCodes['U-01']);
            }
        } else {
            res.status(400).send(errorCodes['U-02']);
        }
    } catch (error) {
        res.status(500).send(errorCodes['A-01']);
    }
});
module.exports = loginRequest;
