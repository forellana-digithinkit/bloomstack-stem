const babel = require('../babel');

module.exports = {
    config(grunt, config, options) {

        grunt.loadNpmTasks('grunt-babel');

        let babelConfig = babel(options);
        let dest = options.dest || './es';

        if ( !options.targets ) {
            options.targets = {
                node: '6.5'
            };
        }

        Object.assign(config.babel, {
            es: {
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
            es: [dest]
        });
    },

    register(grunt, config, options, buildAllTasks) {
        grunt.registerTask('es:build', ['clean:es', 'babel:es']);

        buildAllTasks.push('es:build');
    }
}