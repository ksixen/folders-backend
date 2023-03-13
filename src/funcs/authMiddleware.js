const { verify } = require("jsonwebtoken");
const { config } = require("dotenv");

config();

const { SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
    const authorization = req.cookies?.token;

    if (!authorization) {
        res.status(401).send('Not authorized');
        return;
    }

    try {
        verify(authorization, SECRET);

        return next();
    } catch (e) {
        console.log(e)
        return next(new Error('Not authorized'));
    }
};
module.exports = authMiddleware;
