const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(cwd, options) {
    if ( options.htmlTemplate ) {
        return {
            plugins: [
                new HtmlWebpackPlugin({
                    hash: true,
                    template: options.htmlTemplate
                })
            ]
        }
    }

    return {}
}