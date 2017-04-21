# Jenkins Pipeline

This describes the Jenkinsfile used to define
a Jenkins 2 Pipeline. The Jenkins Pipeline is required to be named 
[Jenkinsfile](Jenkinsfile). The [Jenkinsfile](Jenkinsfile) is required to be located at the root of
the repository. This [Jenkinsfile](Jenkinsfile) follows the declarative
pipeline style. 

### Jenkins Plugins List
* Jenkins Pipeline 
* Jenkins Workflow
* Maven 
* NodeJS 
* HTML Publisher
* Cucumber Reports
 
## Tool Requirements

This pipeline expects to Maven 3.3.9 and NodeJS 6.10.2 to be 
configured in the Global Tool Configuration sections of the 
Jenkins Administration Console. 

### Maven Tool Name
Please note that the name of Maven configuration is expected to 
be 'Maven 3.3.9'. If that is not the case then please adapt to the name 
as provided by your installation.

### NodeJS Tool Name
Please note that the name of the NodeJS configuration is expected to
be 'NodeJS 6.10.2'. If that is not the case then please adapt to the name 
as provided by your installation.

## Pipeline Stages
The following pipeline stages are declared:

* Clean
* Static Code Analysis, Unit Test and Coverage
* Pre-Deployment Configurations of the Cache
* Pre-Deployment Configurations of Target Servers
* Pre-Deployment Configurations of Key Value Maps
* Build proxy bundle
* Deploy proxy bundle
* Post-Deployment Configurations for App Developer
* Post-Deployment Configurations for Apps Configuration
* Post-Deployment Configurations for API Products Configurations
* Export Dev App Keys
* Functional Test
* Coverage Test Report
* Functional Test Report

### Clean
Clean the target folder so that the build can begin from a
known state.

### Static Code Analysis, Unit Test and Coverage
Performs Javascript linting, executes unit tests and code 
coverage checks

### Pre-Deployment Configurations of the Cache
Uses the Apigee Maven Config plugin to configure the cache.

### Pre-Deployment Configurations of the Target Servers
Uses the Apigee Maven Config plugin to configure target servers.
Requires [Organization Administrator](http://docs.apigee.com/api-services/content/organization-administrator-permissions)
permissions.

### Pre-Deployment Configurations of the Key Value Maps
Uses the Apigee Maven Config plugin to configure target servers.
Requires [Organization Administrator](http://docs.apigee.com/api-services/content/organization-administrator-permissions)
permissions.

### Build proxy bundle
Uses the Apigee Maven Deployment plugin to build the proxy 
bundle.

### Deploy proxy bundle
Uses the Apigee Maven Deployment plugin to deploy the proxy 
bundle.

### Post-Deployment Configurations for App Developer
Uses the Apigee Maven Config plugin to configure the app
developer for the creation of an api product.

### Post-Deployment Configurations for Apps Configuration
Uses the Apigee Maven Config plugin to configure the application
for the creation of an api product.

### Post-Deployment Configurations for API Products Configurations
Uses the Apigee Maven Config plugin to configure the api product
so that applications keys can be created.

### Export Dev App Keys
Uses the Apigee Maven Config plugin to download the api product
application keys.

### Functional Test
Uses NodeJS to execute Cucumber functional tests.

### Coverage Test Report
Uses the Jenkins plugin Publish HTML to render the results of the code-coverage check
report.

### Functional Test Report
Uses the Jenkins plugin Cucumber Reports to render the results
of the Cucumber functional tests.



