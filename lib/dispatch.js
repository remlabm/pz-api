module.exports = function dispatch (res, next) {
    return function (err, data) {
        if (err) return next(err)
        res.send(data)
    }
}
