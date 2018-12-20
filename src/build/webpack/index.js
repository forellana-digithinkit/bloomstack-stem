const theme = require('../../theme');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const WebServer = require('./webServer');

const modules = [
    require('./html'),
    require('./css'),
    require('./images'),
    require('./fonts'),
    require('./handlebars'),
    require('./js'),
    require('./livereload'),
];

function defaults(cwd, options) {

    config = {
        stats: {
            colors: true
        },

        mode: options.mode,

        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    terserOptions: {
                        //mangle: false,
                        keep_fnames: true // required to use constructor.name
                    }
                })
            ]
        },

        module: {
            rules: []
        },

        plugins: []
    }

    // load rules and plugins from modules array
    modules.forEach((mod => {
        let modOptions = mod(cwd, options);
        if ( modOptions.rule ) {
            config.module.rules.push(modOptions.rule);
        }

        if ( modOptions.plugins ) {
            config.plugins = config.plugins.concat(modOptions.plugins);
        }
    }));

    if ( options.mode === 'development' || options.watch ) {
        config.devtool = 'source-map';
    }

    if ( options.src ) {
        config.entry = options.src;
    }

    if ( options.output ) {
        config.output = Object.assign({}, config.output || {}, {
            path: path.resolve(options.output),
        });
    }

    if ( options.filename ) {
        config.output = Object.assign({}, config.output || {}, {
            filename: options.filename,
        });
    }

    if ( options.library ) {
        config.output = Object.assign({}, config.output || {}, {
            library: options.library
        });
    }

    if ( options.libraryTarget ) {
        config.output = Object.assign({}, config.output || {}, {
            libraryTarget: options.type
        });
    }

    if ( options.debug ) {
        console.log(config);
    }

    return config;
};

function setupCompiler(config, options) {
    return webpack(config.webpack);
}


function build(config, options) {
    return new Promise((resolve, reject) => {
        let compiler = module.exports.setupCompiler(config, options);

        if ( options.watch ) {
            let watchOptions = Object.assign({}, {
                devServer: {
                    contentBase: options.output,
                },
                aggregateTimeout: 300,
                ignored: /node_modules/,
                'info-verbosity': options.verbose?'verbose':'info'
            }, options.watchOptions || {});

            if ( process.platform === 'win32' ) {
                watchOptions.pool = true;
            }
            
            compiler.watch(watchOptions, (err, stats) => {
                console.log(theme.success("Building..."));

                if ( err ) {
                    console.error(theme.error(err));
                } 
            
                const info = stats.toJson();
                if ( stats.hasErrors() ) {
                    console.error(theme.error(info.errors));
                }
            
                if ( stats.hasWarnings() ) {
                    console.warn(theme.warn(info.warnings));
                }
            });

            if ( options.dev ) {
                WebServer(config, options, compiler);
            }

        } else {
            compiler.run((err, stats) => {
                if ( err ) {
                    console.error(theme.error(err));
                    return reject(err);
                } 
        
                const info = stats.toJson();
                if ( stats.hasErrors() ) {
                    console.error(theme.error(info.errors));
                    return reject(stats.errors);
                }
        
                if ( stats.hasWarnings() ) {
                    console.warn(theme.warn(info.warnings));
                }

                resolve(stats);
            });
        }
    });
}

module.exports = {
    defaults,
    setupCompiler,
    build,

    cleanup(config) {
        // nothing to clean up
        return true
    },

    error(error) {
        // nothing to do when handling an error, just forward it.
        throw error;
    }
}