const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(cwd, options) {
    return {
        rule: {
            test: /\.scss$/,
            use: [{
                    // fallback to style-loader in development
                    loader: options.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        implementation: require("node-sass"),
                        sourceMap: true
                    }
                }
            ]
        },

        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "[name].css",
                chunkFilename: "[id].css"
            })
        ]
    };
};