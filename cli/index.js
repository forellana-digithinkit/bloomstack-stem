#!/usr/bin/env node
const yargs = require('yargs');
const theme = require('./theme');

const commands = {
    build: require('./build'),
    clean: require('./clean'),
};

yargs
    .usage(`Usage: stem <command> [options]`)
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2018');

// let commands setup their own options
Object.keys(commands).forEach(key => {
    commands[key].setup(yargs, theme);
});

let argv = yargs.argv;

if ( argv._[0] in commands ) {
    let cmd = commands[argv._[0]];
    if ( 'cli' in cmd )  {
        cmd.cli(argv);
    } else {
        cmd.subcommand(argv.subcommand, argv);
    }
} else {
    console.error(theme.error('Command not found'));
    yargs.showHelp();
}


