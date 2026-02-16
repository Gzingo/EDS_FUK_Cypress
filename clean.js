const { rimrafSync } = require('rimraf');
rimrafSync('cypress/screenshots');
rimrafSync('cypress/videos');
rimrafSync('runner-results');
rimrafSync('cypress/reports/html/screenshots');
