#!groovy
def project_dir = 'currency-v1'

pipeline {
    agent any

    stages {
        stage("Show tool versions") {
          steps {
                sh 'mvn --version'
                sh 'npm --version'
                 }
        }
        stage('Clean') {
            steps {
                sh "mvn -f ${project_dir}/pom.xml clean"
           }
        }
        stage('Static Code Analysis, Unit Test and Coverage') {
            steps {
              sh "mvn -f ${project_dir}/pom.xml test -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=${project_dir}/target/resources/edge -Dapigee.config.options=create -Dapigee.config.exportDir=${project_dir}/target/test/integration"
            }
        }
        stage('Pre-Deployment Configurations') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-config:caches apigee-config:keyvaluemaps apigee-config:targetservers -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=${project_dir}/target/resources/edge -Dapigee.config.options=create"
          }
        }
        stage('Build proxy bundle') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-enterprise:configure -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password}"
          }
        }
        stage('Deploy proxy bundle') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-enterprise:deploy -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password}"
          }
        }
        stage('Post-Deployment Configurations') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-config:apiproducts apigee-config:developers apigee-config:apps -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=${project_dir}/target/resources/edge -Dapigee.config.options=create"
          }
        }

        /**
        stage('Static Code Analysis, Unit Test, Coverage and Install') {
            steps {
              sh "mvn -f ${project_dir}/pom.xml install -P${params.profile} -Ddeployment.suffix=${params.deployment_suffix} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=${project_dir}/target/resources/edge -Dapigee.config.options=create -Dapigee.config.exportDir=${project_dir}/target/test/integration"
            }
        }
        */

        stage('Coverage Test Report') {
          steps {
            publishHTML(target: [
                                  allowMissing: false,
                                  alwaysLinkToLastBuild: false,
                                  keepAll: false,
                                  reportDir: "${project_dir}/target/coverage/lcov-report",
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
                    jsonReportDirectory: "${project_dir}/target",
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





        /**
        stage('Export Dev App Keys') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-config:exportAppKeys -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Dapigee.config.dir=${project_dir}/target/resources/edge -Dapigee.config.exportDir=./${project_dir}/target/test/integration"
          }
        }
        stage('Functional Test') {
          steps {
            sh "node ${project_dir}/node_modules/cucumber/bin/cucumber.js ${project_dir}/target/test/integration/features --format json:${project_dir}/target/reports.json"
          }
        }
        */
