module.exports = function({ stage, presets, targets, plugins, sourceMap }, modules) {
    if ( modules === undefined ) {
        modules = 'auto';
    }

    let options = {
        sourceMap: sourceMap?true:false,
        presets: presets || [
            ["@babel/env", { 
                modules,
                targets,
                useBuiltIns: "usage"
            }]
        ],
        plugins: []
    };

    if ( stage >= 0 ) {
        options.plugins.push("@babel/plugin-proposal-function-bind");
    }

    if ( stage >= 1 ) {
        options.plugins = options.plugins.concat([
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-logical-assignment-operators",
            ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
            ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
            ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
            "@babel/plugin-proposal-do-expressions"
        ]);
    }

    if ( stage >= 2 ) {
        options.plugins = options.plugins.concat([
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            "@babel/plugin-proposal-function-sent",
            "@babel/plugin-proposal-export-namespace-from",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-throw-expressions",
        ])
    }

    if ( stage >= 3 ) {
        options.plugins = options.plugins.concat([
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-syntax-import-meta",
            ["@babel/plugin-proposal-class-properties", { "loose": false }],
            "@babel/plugin-proposal-json-strings"            
        ]);
    }

    return options;
}