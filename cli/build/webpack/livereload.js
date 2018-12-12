const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = function(cwd, options) {
    if ( options.watch ) {
        return {
            plugins: [
                new LiveReloadPlugin({
                    appendScriptTag: true,
                    delay: 600
                })
            ]
        }
    }

    return {}
}