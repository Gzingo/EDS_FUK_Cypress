const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  allowCypressEnv: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: false,
  trashAssetsBeforeRuns: false,
  screenshotOnRunFailure: true,
  env: {
    first_user: process.env.CYPRESS_USER,
    first_password: process.env.CYPRESS_PASSWORD,
    first_users_name: process.env.CYPRESS_FIRST_USERNAME,
    invalid_user: process.env.CYPRESS_INVALID_USERNAME,
    invalid_password: process.env.CYPRESS_INVALID_PASSWORD,
    sql_inject_username: process.env.CYPRESS_ADMIN_SQL_USERNAME,
    sql_inject_password: process.env.CYPRESS_SQL_PASSWORD_INJECT,
    admin_username: process.env.CYPRESS_ADMIN_USERNAME,
    admin_name: process.env.CYPRESS_ADMIN_NAME,
    pl_user1_username: process.env.CYPRESS_USER_1_USERNAME,
    pl_user1_name: process.env.CYPRESS_USER_1_NAME,
    pl_user2_username: process.env.CYPRESS_USER_2_USERNAME,
    pl_user2_name: process.env.CYPRESS_USER_2_NAME,
    pl_director_username: process.env.CYPRESS_DIRECTOR_USERNAME,
    pl_director_name: process.env.CYPRESS_DIRECTOR_NAME,
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'EDS_FUK QA Izveštaj',
    embeddedScreenshots: false,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    // pageLoadTimeout: 70000,
    // defaultCommandTimeout: 10000,
    testIsolation: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});
