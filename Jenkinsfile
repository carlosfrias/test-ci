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
            sh "mvn -f ${project_dir}/pom.xml install -P${params.profile} -Dorg=${params.org} -Dusername=${params.username} -Dpassword=${params.password} -Ddeployment.suffix=${params.deployment_suffix} -Dapigee.config.dir=./${project_dir}/target/resources/edge -Dapigee.config.options=create -Dapigee.config.exportDir=./${project_dir}/target/test/integration"
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