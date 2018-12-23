const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = function(cwd, options) {
    return {
        plugins: [
            new CleanWebpackPlugin([options.output])
        ]
    }
}