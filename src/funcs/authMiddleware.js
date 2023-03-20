const { verify, sign } = require("jsonwebtoken");
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
        const decoded = verify(authorization, SECRET);
        const expiryDate = new Date();
        
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        sign(
            {
                login: decoded?.login,
            },
            SECRET,
            {
                expiresIn: +expiryDate,
            }
        );
        return next();
    } catch (e) {
        console.log(e)
        return next(new Error('Not authorized'));
    }
};
module.exports = authMiddleware;
