const fs = require('fs-extra');

module.exports = {
    setup(yargs) {
        return yargs
            .example(`stem clean ./dist`, 'Removes directory recursively. Behaves like rm -Rf ./dist')
            .command('clean [path]', 'Removes directory recursively. Defaults to remove ./dist', (yargs) => {
                return yargs.positional('path', {
                    alias: 'p',
                    describe: 'The path to remove',
                    default: './dist'
                });
            });
    },

    cli(argv) {
        let cleanPath = argv.path;
        fs.removeSync(cleanPath);
    }
}