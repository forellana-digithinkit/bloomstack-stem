export function setupBabel(stages,  presets, targets, plugins) {
    let options = {
        presets: presets || [
            ["@babel/env", { 
                modules: false,
                targets: targets || {
                    browsers: [
                        ">0.25%",
                        "not ie 11",
                        "not op_mini all"
                    ]
                },
                useBuiltIns: "usage"
            }]
        ],
        plugins: []
    };

    if ( stages >= 0 ) {
        options.plugins.push("@babel/plugin-proposal-function-bind");
    }

    if ( stages >= 1 ) {
        options.plugins.concat([
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-logical-assignment-operators",
            ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
            ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
            ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
            "@babel/plugin-proposal-do-expressions"
        ]);
    }

    if ( stages >= 2 ) {
        options.plugins.concat([
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            "@babel/plugin-proposal-function-sent",
            "@babel/plugin-proposal-export-namespace-from",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-throw-expressions",
        ])
    }

    if ( stages >= 3 ) {
        options.plugins.concat([
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-syntax-import-meta",
            ["@babel/plugin-proposal-class-properties", { "loose": false }],
            "@babel/plugin-proposal-json-strings"            
        ]);
    }

}

export 