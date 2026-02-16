const { execSync } = require('child_process');

for (let i = 1; i <= 3; i++) {
  console.log(`🔁 Running test #${i} in headless mode...`);
  try {
    execSync(
      // 'npx cypress run --browser chrome --headless --spec cypress/e2e/odobravanje_liste_procesa.js,cypress/e2e/odobravanje_mape_procesa.js',
      'npx cypress run --browser chrome --headless --spec cypress/e2e/godisnji_izvestaj.js',
      // 'npx cypress run --browser chrome --headless --spec cypress/e2e/odobravanje_liste_procesa.js',
      // 'npx cypress run --browser chrome --headless --spec cypress/e2e/odobravanje_mape_procesa.js',
      // 'npx cypress run --browser chrome --headless --spec cypress/e2e/login_test.js',
      // 'npx cypress run --browser chrome --headless',
      {
        stdio: 'inherit',
      }
    );
  } catch (error) {
    console.error(`❌ Test #${i} failed. Stopping further execution.`);
    process.exit(1);
  }
}

console.log('✅ All tests successfully passed 3 times in a row!');
