module.exports = {
    lib: require('./lib'),
    esModule: require('./esModule'),
    bundle: require('./bundle'),
    cjsBundle: require('./cjsBundle'),
    default: function(task, grunt, options) {
        console.log("No task found: ", task);
        //require(task)(grunt, options);
    }
}