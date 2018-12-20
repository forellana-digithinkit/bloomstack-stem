const theme = require('../theme');
const path = require('path');
const fs = require('fs');
const babelModule = require('./babel');
const webpackModule = require('./webpack');

const defaults = (cwd, options) => {
    return {
        cwd,
        babelrc: babelModule.defaults(cwd, options),
        webpack: webpackModule.defaults(cwd, options)
    };
};

const buildPipeline = [
    babelModule,
    webpackModule
];

function build(config, options) {

    let promises = Promise.resolve(config);
    buildPipeline.forEach(step => {
        promises = promises
            .then(() => Promise.resolve(step.build(config, options)))
            .catch((error) => step.error(error, config, options));
    })

    // run clean up in reverse order
    buildPipeline.slice(0).reverse().forEach(step => {
        promises = promises
            .then(() => Promise.resolve(step.cleanup(config, options)))
            .catch((error) => step.error(error, config, options));
    })

    return promises;
}

module.exports = {
    setup(yargs) {
        let cwd = process.cwd();
        return yargs
            .example(`stem build`, 'Builds the app and outputs into dist')
            .command('build [src]', 'Builds the app and outputs to ./dist (default)', (yargs) => {
                return yargs.positional('src', {
                    describe: 'The source entry point to compile.',
                    default: path.join(cwd, 'src')
                })
                .option('debug', {
                    alias: 'd',
                    default: false
                })
                .option('watch', {
                    alias: 'w',
                    describe: "Will watch source files for changes and recompile on demand",
                    default: false
                })
                .option('dev', {
                    describe: "Builds in development mode",
                    default: false
                })
                .option('output', {
                    alias: 'o',
                    describe: "The output directory to build to",
                    default: path.join(cwd, '/dist')
                })
                .option('config', {
                    alias: 'c',
                    describe: "If provided you can override all builder options with your own module"
                })
            })
    },
    build,
    cli(argv) {
        console.log("Building...");

        let cwd = process.cwd();
        let options = {};
        options.mode = argv.dev?'development':'production';
        ['debug', 'watch', 'output', 'src', 'config', 'dev'].forEach((key) => {
            options[key] = argv[key];
        });

        let buildOptions = [];

        // pickup user config
        if ( options.config ) {
            let userOptions = require(path.resolve(path.join(cwd, options.config)));
            if ( userOptions.constructor !== Array ) {
                userOptions = [userOptions];
            }
            buildOptions = buildOptions.concat(userOptions);
        } else {
            // defaults to no user options 
            buildOptions.push({});
        }

        return Promise.all(buildOptions.map((userOptions) => {
            userOptions = Object.assign({}, options, userOptions);
            let config = defaults(cwd, userOptions);
            config.state = {};

            return build(config, userOptions)
                .catch(err => {
                    if ( err ) {
                        console.log(err.stack);
                        console.error(theme.error(err));
                    }
                });
        }));
    }
}