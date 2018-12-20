const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(cwd, options) {
    return {
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                template: path.join(options.src, 'index.html')
            })
        ]
    }
}