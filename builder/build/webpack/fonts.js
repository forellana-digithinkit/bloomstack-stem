module.exports = function(cwd, options) {
    return {
        rule: {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }
    }
}