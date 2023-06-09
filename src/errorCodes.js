
const errorCodes = {
    'A-01': {
        err: "Something got wrong! Please, try again!",
        code: 'A-01'
    },
    'A-02': (args = '') => {
        return {
            err: `Missing parameter: ${args}`,
            code: 'A-02'
        }
    },
    'A-03': (args = '') => {
        return {
            err: `Invalid parameter: ${args}`,
            code: 'A-02'
        }
    },

    
    'U-01': {
        err: "Invalid Password",
        code: 'U-01'
    },
    'U-02': {
        err: "Password or Login doesn't correct",
        code: 'U-02'
    },
    'U-03': {
        err: "Login is busy",
        code: 'U-03'
    },
}
module.exports = errorCodes