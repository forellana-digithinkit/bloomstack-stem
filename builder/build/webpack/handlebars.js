module.exports = function(cwd, options) {
    return {
        rule: { test: /\.handlebars$/, loader: "handlebars-loader" }
    }
}