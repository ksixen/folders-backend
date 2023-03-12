const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes");
const checkRequiredKeys = require("../funcs/checkRequiredKeysExists");
const router = express.Router();

const usersRequest = router.get(routes.ADD_FOLDER, (req, res) => {
    try {
        const { name, id, order } = req.body;
        const hasRequired = checkRequiredKeys(req.body, [
            "name",
            "id",
            "order",
        ]);
        // console.log(req.body, hasRequired)
        if (!hasRequired) {
            res.status(400).send({
                response: "error",
            });
            return false;
        }
        surrealDB.createTable({
            props: {
                name: name,
                id: id,
                type: "folder",
                order: order,
            },
            table: "folders",
        });
        res.status(200).send({
            response: "ok",
        });
    } catch (error) {
        res.status(400).send({
            response: "error",
        });
    }
});


module.exports = usersRequest;
