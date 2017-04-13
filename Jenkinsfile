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
                mvnCmd = ["mvn"]
                mvnCmd << "-f ${project_dir}/pom.xml"
                mvnCmd << "install"
                mvnCmd << "-P${params.profile}"
                mvnCmd << "-Dorg=${params.org}"
                mvnCmd << "-Dusername=${params.username}"
                mvnCmd << "-Dpassword=${params.password}"
                mvnCmd << "-Ddeployment.suffix=${params.deployment_suffix}"
                mvnCmd << "-Dapigee.config.dir=${project_dir}/target/resources/edge"
                mvnCmd << "-Dapigee.config.options=create"
                mvnCmd << "-Dapigee.config.exportDir=${project_dir}/target/test/integration"
                sh mvnCmd.join(' ')
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