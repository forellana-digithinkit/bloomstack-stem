module.exports = function(cwd, options) {
    return {
        rule: {
            test: /\.js$/,
            use: {
                loader: "babel-loader"
            }
        }
    }
}