module.exports = function(cwd, options) {
    return {
        rule: {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                "file-loader"
            ]
        }
    }
};