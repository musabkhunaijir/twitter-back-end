const reject = ({ status, message }) => {
    return Promise.reject({
        status,
        message
    })
}

module.exports = { reject };