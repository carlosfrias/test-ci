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
        stage('clean') {
            steps {
                sh "mvn -f ${project_dir}/pom.xml clean"
           }
        }
        stage('install') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml install -P${params.PROFILE} -Dorg=${params.APIGEE_ORG} -Dusername=${params.APIGEE_USERNAME} -Dpassword=${params.APIGEE_PASSWORD} -Ddeployment.suffix=${params.DEPLOYMENT_SUFFIX}"
          }
        }
        stage('coverage report') {
          steps {
            publishHTML(target: [allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'currency-v1/target/coverage/lcov-report', reportFiles: 'index.html', reportName: 'HTML Report'])
          }
        }

        stage('cucumber report') {
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