const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes");
const checkRequiredKeys = require("../funcs/checkRequiredKeysExists");
const authMiddleware = require("../funcs/authMiddleware");
const useMe = require("../funcs/useMe");
const errorCodes = require("../errorCodes");
const router = express.Router();

const usersRequest = router.post(
    routes.ADD_FOLDER,
    authMiddleware,
    async (req, res) => {
        try {
            const { name, ts, order } = req.body;
            if (!name?.length || typeof ts !== 'number' || typeof order !== 'number') {
                res.status(400).send(errorCodes["A-02"]("name, id, or order"));
                return false;
            }
            const me = useMe(req, res);
            surrealDB.createTable({
                props: {
                    name: name,
                    ts: ts,
                    type: "folder",
                    order: order,
                    created_by: me,
                },
                table: "folders",
            }).then((response) => {
                res.status(200).send(response);

            });
        } catch (error) {
            res.status(400).send(error);
        }
    }
);

module.exports = usersRequest;
