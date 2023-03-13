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
const loginRequest = router.post(routes.LOGIN, async (req, res) => {
    try {
        const { password, login } = req.query;
        const select = surrealDB.query({
            query: `SELECT * from person WHERE login = '${login}'`,
            table: "person",
        });
        const user = await select[0]?.result[0];
        if (user && password) {
            const [hashed, salt] = user.pass.split(".");
            const hashedBuff = await scrypt(password, salt, 82);

            const isValid = hashed === hashedBuff.toString();

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

                res.status(200).send(`Good morning, ${user.login}`);
            } else {
                res.status(400).send("Invalid password");
            }
        } else {
            res.status(400).send("password or login doesn't correct");
        }
    } catch (error) {
        res.status(500).send("Something got wrong! Please, try again!");
    }
});
module.exports = loginRequest;
