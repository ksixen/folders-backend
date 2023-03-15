const express = require("express");
const surrealDB = require("../surreal");
const routes = require("../routes");
const checkRequiredKeys = require("../funcs/checkRequiredKeysExists");
const authMiddleware = require("../funcs/authMiddleware");
const useMe = require("../funcs/useMe");
const errorCodes = require("../errorCodes");
const router = express.Router();

const usersRequest = router.get(
    routes.ADD_FOLDER,
    authMiddleware,
    async (req, res) => {
        try {
            const { name, id, order } = req.body;
            if (!name?.length || !id?.length || !order?.length) {
                res.status(400).send(errorCodes["A-02"]("name, id, or order"));
                return false;
            }
            const me = useMe(req, res);
            surrealDB.createTable({
                props: {
                    name: name,
                    id: id,
                    type: "folder",
                    order: order,
                    created_by: me,
                },
                table: "folders",
            });
            res.status(200).send({
                response: "ok",
            });
        } catch (error) {
            res.status(400).send({
                response: error,
            });
        }
    }
);

module.exports = usersRequest;
