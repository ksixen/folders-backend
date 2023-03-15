const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

const { SECRET } = process.env;
const useMe = function (req, res) {
    if (req.cookies?.token) {
        const authorization = req.cookies?.token;
        let decoded;
        try {
            decoded = jwt.verify(authorization, SECRET);
        } catch (e) {
            return res.status(401).send("unauthorized");
        }
        return decoded?.login
    }
    return undefined
};

module.exports = useMe;
