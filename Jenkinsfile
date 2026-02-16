// Jenkinsfile for Cypress UI E2E Tests
// This pipeline runs Cypress tests only on the 'test' branch,
// installs dependencies, and archives test results and reports.
// It also includes Windows firewall configuration for Cypress.
// Make sure to have NodeJS 20 configured in Jenkins global tools.
// Adjust paths and settings as necessary for your environment.

pipeline {
    agent any

    tools {
        nodejs 'NodeJS_20'
    }

    environment {
        CYPRESS_CACHE_FOLDER = "${WORKSPACE}/.cache/Cypress"
        CI = 'true'
        NODE_ENV = 'test'
    }

    stages {
        stage('Detect branch') {
            steps {
                script {
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'unknown'
                    echo "Aktivni branch: ${branch}"
                    env.ACTIVE_BRANCH = branch.replaceAll(/^origin\//, '')
                }
            }
        }

        stage('Run only on test branch') {
            when {
                expression {
                    return env.ACTIVE_BRANCH == 'test'
                }
            }
            stages {
                stage('Allow Cypress through firewall') {
                    when {
                        not { expression { isUnix() } }
                    }
                    steps {
                        echo 'Dodavanje Windows firewall pravila za Cypress...'
                        powershell '''
                        Try {
                            $exePath = Get-ChildItem -Path "$env:USERPROFILE\\AppData\\Local\\Cypress\\Cache" -Recurse -Filter Cypress.exe | Select-Object -First 1
                            if ($exePath) {
                                New-NetFirewallRule -DisplayName 'Allow Cypress' -Direction Inbound -Program $exePath.FullName -Action Allow -Profile Any -ErrorAction Stop
                                Write-Host '✅ Firewall pravilo dodato za Cypress.'
                            } else {
                                Write-Host '⚠️ Cypress.exe nije pronađen — preskačem firewall pravilo.'
                            }
                        } Catch {
                            Write-Host '❌ Greška pri dodavanju firewall pravila: ' + $_.Exception.Message
                        }
                        '''
                    }
                }

                stage('Validate Cypress run script') {
                    steps {
                        echo 'Provera da li postoji cy:run:chrome skripta u package.json...'
                        dir('Cypress-Tests-UI-e2e') {
                            script {
                                def scriptExists = fileExists('package.json') && readFile('package.json').contains('"cy:run:chrome"')
                                if (!scriptExists) {
                                    error('❌ Skripta "cy:run:chrome" nije definisana u package.json. Build se prekida.')
                                } else {
                                    echo '✅ Skripta "cy:run:chrome" pronađena.'
                                }
                            }
                        }
                    }
                }

                stage('Install dependencies') {
                    steps {
                        echo 'Instalacija npm paketa...'
                        dir('Cypress-Tests-UI-e2e') {
                            script {
                                def lockExists = fileExists('package-lock.json')
                                if (lockExists) {
                                    echo 'package-lock.json pronađen — koristi npm ci'
                                    if (isUnix()) {
                                        sh "npm ci --cache ${env.CYPRESS_CACHE_FOLDER}"
                                    } else {
                                        bat "npm ci --cache ${env.CYPRESS_CACHE_FOLDER}"
                                    }
                                } else {
                                    echo '⚠️ package-lock.json nije pronađen — koristi npm install'
                                    if (isUnix()) {
                                        sh "npm install --cache ${env.CYPRESS_CACHE_FOLDER}"
                                    } else {
                                        bat "npm install --cache ${env.CYPRESS_CACHE_FOLDER}"
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Run Cypress tests') {
                    steps {
                        echo 'Pokretanje Cypress testova u Chrome-u...'
                        dir('Cypress-Tests-UI-e2e') {
                            catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                                script {
                                    if (isUnix()) {
                                        sh 'npm run cy:run:chrome'
                                    } else {
                                        bat 'npm run cy:run:chrome'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Arhiviranje JUnit rezultata...'
            junit testResults: 'cypress/reports/*.xml', allowEmptyResults: true

            echo 'Arhiviranje HTML izveštaja...'
            archiveArtifacts artifacts: 'cypress/reports/*.html', allowEmptyArchive: true

            echo 'Arhiviranje screenshota...'
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.*', allowEmptyArchive: true

            script {
                try {
                    publishHTML([
                        reportDir: 'cypress/reports',
                        reportFiles: 'index.html',
                        reportName: 'Cypress HTML Report',
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        allowMissing: true
                    ])
                } catch (Exception e) {
                    echo "HTML Publisher plugin not available — skipping publishHTML. (${e.message})"
                }
            }
        }

        failure {
            echo '❌ Tests failed. Please check the logs and results.'
        }
    }
}
