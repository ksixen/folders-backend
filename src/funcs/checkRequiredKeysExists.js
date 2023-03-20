const checkRequiredKeys = async (req, keys = []) => {
    keys.map((key) => {
        if (req[key] === undefined) {
            console.log(req, typeof req, key);
            return false;
        }
    });
    return true;
};

module.exports = checkRequiredKeys;
