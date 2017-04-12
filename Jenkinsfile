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
        stage('Static Code Analysis, Unit Test and Coverage') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml test -P${params.PROFILE} -Ddeployment.suffix=${params.DEPLOYMENT_SUFFIX} -Dorg=${params.APIGEE_ORG} -Dusername=${params.APIGEE_USERNAME} -Dpassword=${params.APIGEE_PASSWORD} -Dapigee.config.dir=./target/resources/edge -Dapigee.config.options=create -Dapigee.config.exportDir=./target/test/integration"
          }
        }
        stage('Pre-Deployment Configurations') {
          steps {
            sh "mvn -X -f ${project_dir}/pom.xml apigee-config:caches apigee-config:keyvaluemaps apigee-config:targetservers -P${params.PROFILE} -Dorg=${params.APIGEE_ORG} -Dusername=${params.APIGEE_USERNAME} -Dpassword=${params.APIGEE_PASSWORD} -Dapigee.config.dir=./target/resources/edge -Dapigee.config.options=create"
          }
        }
        stage('Build proxy bundle') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-enterprise:configure -P${params.PROFILE} -Dorg=${params.APIGEE_ORG} -Dusername=${params.APIGEE_USERNAME} -Dpassword=${params.APIGEE_PASSWORD}"
          }
        }
        stage('Deploy proxy bundle') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-enterprise:deploy -P${params.PROFILE} -Dorg=${params.APIGEE_ORG} -Dusername=${params.APIGEE_USERNAME} -Dpassword=${params.APIGEE_PASSWORD}"
          }
        }
        stage('Post-Deployment Configurations') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-config:apiproducts apigee-config:developers apigee-config:apps -P${params.PROFILE} -Dorg=${params.APIGEE_ORG} -Dusername=${params.APIGEE_USERNAME} -Dpassword=${params.APIGEE_PASSWORD} -Dapigee.config.dir=./target/resources/edge -Dapigee.config.options=create"
          }
        }
        stage('Export Dev App Keys') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml apigee-config:exportAppKeys -P${params.PROFILE} -Dorg=${params.APIGEE_ORG} -Dusername=${params.APIGEE_USERNAME} -Dpassword=${params.APIGEE_PASSWORD} -Dapigee.config.dir=./target/resources/edge -Dapigee.config.exportDir=./target/test/integration"
          }
        }
        stage('Functional Test') {
          steps {
            sh "node node_modules/cucumber/bin/cucumber.js target/test/integration/features --tags ${api.testtag} --format json:target/reports.json"
          }
        }
        stage('Coverage Test Reports') {
          steps {
            publishHTML(target: [allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'currency-v1/target/coverage/lcov-report', reportFiles: 'index.html', reportName: 'HTML Report'])
          }
        }
        stage('Functional Test Reports') {
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
