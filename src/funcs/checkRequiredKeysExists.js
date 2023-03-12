const checkRequiredKeys = (req = {}, keys = []) => {

    keys.forEach((key) =>{
        if (!req[key]) {
            console.log("Key", key, "Req", req)
            return false
        };
    })
    return true;
};
module.exports = checkRequiredKeys