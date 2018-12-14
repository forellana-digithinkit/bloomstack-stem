const express = require('express');
const webpack = require('webpack');
const path = require('path');

module.exports = function(config, options, compiler) {
    const app = express();

    console.log(`Serving: ${options.output}`);
    app.use('/', express.static(options.output));

    app.listen(options.port || 8000, function () {
      console.log(`Dev server listening on ${options.port || 8000}\n`);
    });

    return app;
}

