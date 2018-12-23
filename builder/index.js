const stemTasks = require('./tasks');

module.exports = function(grunt, options, config) {
    if ( config === undefined ) {
        config = {}
    }

    grunt.loadNpmTasks("grunt-contrib-clean");

    let allTasks = options.tasks || {};
    let buildAllTasks = [];

    config.babel = Object.assign(config.babel || {}, {});
    config.clean = Object.assign(config.clean || {}, {});

    let stemTaskModules = Object.keys(allTasks).reduce((cur, task) => {
        let taskOptions = allTasks[task];
        // convert boolean to empty object so we can merge it into default options
        if ( taskOptions && typeof taskOptions === 'boolean' ) {
            taskOptions = {};
        }
        let combineOptions = Object.assign({}, options, taskOptions);
        delete combineOptions.tasks;

        if ( stemTasks.hasOwnProperty(task) ) {
            cur.push({ options: combineOptions, module: stemTasks[task]});
        }

        return cur;
    }, []);

    stemTaskModules.forEach((task) => {
        task.module.config(grunt, config, task.options);
    });

    grunt.initConfig(config);

    grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));

    stemTaskModules.forEach((task) => {
        task.module.register(grunt, config, task.options, buildAllTasks);
    });

    if ( buildAllTasks.length > 0 ) {
        grunt.registerTask('build', buildAllTasks);
    }
}