#!groovy

pipeline {
    agent any
    tools {
      maven 'Maven'
      nodejs 'NodeJS'
    }
    stages {
        stage('Clean') {
            steps {
              sh "mvn clean"
            }
        }
        stage('Static Code Analysis, Unit Test and Coverage') {
            steps {
              sh "mvn test -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create -Dapigee.config.exportDir=./target/test/integration"
            }
        }
        stage('Pre-Deployment Configurations of the Cache') {
            steps {
              sh "mvn apigee-config:caches -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
            }
        }
        stage('Pre-Deployment Configurations of Target Servers') {
            steps {
              sh "mvn apigee-config:targetservers -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
            }
        }
        stage('Pre-Deployment Configurations of Key Value Maps') {
            steps {
              sh "mvn apigee-config:keyvaluemaps -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
            }
        }
        stage('Build proxy bundle') {
            steps {
              sh "mvn apigee-enterprise:configure -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\""
            }
        }
        stage('Deploy proxy bundle') {
            steps {
              sh "mvn apigee-enterprise:deploy -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\""
            }
        }
        stage('Post-Deployment Configurations for API Products Configurations') {
          steps {
            sh "mvn apigee-config:apiproducts -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
          }
        }
        stage('Post-Deployment Configurations for App Developer') {
          steps {
            sh "mvn apigee-config:developers -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
          }
        }
        stage('Post-Deployment Configurations for Apps Configuration') {
          steps {
            sh "mvn apigee-config:apps -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
          }
        }
        stage('Export Dev App Keys') {
          steps {
            sh "mvn apigee-config:exportAppKeys -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=\"${params.password}\" -Dapigee.config.dir=target/resources/edge -Dapigee.config.exportDir=./target/test/integration"
          }
        }
        stage('Functional Test') {
          steps {
            sh "node ./node_modules/cucumber/bin/cucumber.js target/test/integration/features --format json:target/reports.json"
          }
        }
        stage('Coverage Test Report') {
          steps {
            publishHTML(target: [
                                  allowMissing: false,
                                  alwaysLinkToLastBuild: false,
                                  keepAll: false,
                                  reportDir: "target/coverage/lcov-report",
                                  reportFiles: 'index.html',
                                  reportName: 'HTML Report'
                                ]
                        )
          }
        }
        stage('Functional Test Report') {
            steps {
                step([
                    $class: 'CucumberReportPublisher',
                    fileExcludePattern: '',
                    fileIncludePattern: "**/reports.json",
                    ignoreFailedTests: false,
                    jenkinsBasePath: '',
                    jsonReportDirectory: "target",
                    missingFails: false,
                    parallelTesting: false,
                    pendingFails: false,
                    skippedFails: false,
                    undefinedFails: false
                    ])
            }
        }
    }
}

