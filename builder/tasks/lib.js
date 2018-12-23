const babel = require('../babel');

module.exports = {
    config(grunt, config, options) {

        grunt.loadNpmTasks('grunt-babel');

        let babelConfig = babel(options);
        let dest = options.dest || './lib';

        if ( !options.targets ) {
            options.targets = {};
        }

        Object.assign(config.babel, {
            lib: {
                options: babelConfig,
                files: [{
                    expand: true,
                    cwd: options.src,
                    src: ['*.js'],
                    dest: dest
                }]
            }
        });

        Object.assign(config.clean, {
            lib: [dest]
        });
    },

    register(grunt, config, options, buildAllTasks) {
        grunt.registerTask('lib:build', ['clean:lib', 'babel:lib']);
        buildAllTasks.push('lib:build');
    }
}