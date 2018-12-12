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
                    default: false
                })
                .option('dev', {
                    default: false
                })
                .option('output', {
                    alias: 'o',
                    default: path.join(cwd, '/dist')
                })
            })
    },
    build,
    cli(argv) {
        console.log("Building...");

        let cwd = process.cwd();
        let options = {};
        options.mode = argv.dev?'development':'production';
        ['debug', 'watch', 'output', 'src'].forEach((key) => {
            options[key] = argv[key];
        })

        let config = defaults(cwd, options);

        config.state = {};

        build(config, options)
            .catch(err => {
                console.log(err.stack);
                console.error(theme.error(err));
            });
    }
}