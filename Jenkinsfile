#!groovy

def mvnHome = tool name: 'Maven 3.3.9', type: 'maven'
pipeline {
    agent any
        node {
            stage("Show tool versions") {
              steps {
                    sh "${mvnHome}/bin/mvn --version"
                    sh 'npm --version'
                    sh 'node --version'
              }
            }
            stage('Clean') {
                steps {
                    sh "${mvnHome}/bin/mvn clean"
               }
            }
            stage('Static Code Analysis, Unit Test and Coverage') {
                steps {
                  sh "${mvnHome}/bin/mvn test -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create -Dapigee.config.exportDir=./target/test/integration"
                }
            }
            stage('Pre-Deployment Configurations') {
              steps {
                sh "${mvnHome}/bin/mvn apigee-config:caches apigee-config:keyvaluemaps apigee-config:targetservers -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
              }
            }
            stage('Build proxy bundle') {
              steps {
                sh "${mvnHome}/bin/mvn apigee-enterprise:configure -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password}"
              }
            }
            stage('Deploy proxy bundle') {
              steps {
                sh "${mvnHome}/bin/mvn apigee-enterprise:deploy -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password}"
              }
            }
            stage('Post-Deployment Configurations') {
              steps {
                sh "${mvnHome}/bin/mvn apigee-config:apiproducts apigee-config:developers apigee-config:apps -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=target/resources/edge -Dapigee.config.options=create"
              }
            }
            stage('Export Dev App Keys') {
              steps {
                sh "${mvnHome}/bin/mvn apigee-config:exportAppKeys -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=target/resources/edge -Dapigee.config.exportDir=./target/test/integration"
              }
            }
            stage('Functional Test') {
              steps {
                sh "node ./node_modules/cucumber/bin/cucumber.js target/test/integration/features --format json:target/reports.json"
                //sh "${mvnHome}/bin/mvn exec:exec@integration"
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

