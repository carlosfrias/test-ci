# CI/CD Best Practices Test Proxy
This is the test proxy that has been created to 
showcase the usage of the Apigee Maven plugins, 
in particular the [Apigee Maven Config Plugin](https://github.com/apigee/apigee-config-maven-plugin) 
and the [Apigee Maven Deploy Plugin](https://github.com/apigee/apigee-deploy-maven-plugin). The usage
of these Maven plugins have been integrated with a [Jenkins Pipeline](README-JENKINSFILE.md). This integration provides a
concrete example of the use of best practices to achieve Continous Integration and Continous 
Deployment.
    
## Jenkins Pipeline
A [Jenkins Pipeline](README-JENKINSFILE.md) has been provided that demonstrates
the usage of this proxy.

## Test Proxy Apigee Account Requirements
This test proxy assumes that you have an Apigee Edge instance
available for your use. This can be either a free Apigee 
public saas account or a private Apigee OPDK instance.

## Test Proxy Account Privilege Requirements
This proxy will attempt to create Key Value Maps and Target
Servers. The creation of Key Value Maps and Target Servers
requires that your account have the [Organization Administrator](http://docs.apigee.com/api-services/content/organization-administrator-permissions)
privilege. 

### Missing the Organization Administrator Privilege?
If you do not have this privilege, then note that 
all other actions will work except creating Key Value Maps
and Target Servers. Please see the provided [Jenkins Pipeline](README-JENKINSFILE.md)
for more information regarding how to invoke goals individually. 

Invoking goals that required [Organization Administrator](http://docs.apigee.com/api-services/content/organization-administrator-permissions) 
privilege can be avoided by removing kvms.json and targetServers.json from 
the resources. If using an edge.json file then you can also remove kvm and 
targetServer references from there as well.

### Basic Usage
The plugin will need to be provided with the Apigee Edge 
Organization into which a proxy should be deployed. Access
to the organization is require so you must also provide 
your Apigee Edge credentials. Accomplish this with the 
following invocation (line continuation is used to format the command): 

    mvn clean install \
    -P{profile} \
    -Dorg={org} \
    -Dusername={username} \
    -Dpassword={password} \
    -Dapigee-config.dir=target/resources/edge \
    -Dapigee.config.options=create \
    -Dapigee.config.exportDir=./target/test/integration

## Advanced Uses
Invoking individual Maven goals to carry out specific actions is supported.
The Jenkins pipeline has been constructed by calling each Maven goal. These
are the same goals that are executed when invoking `mvn install` as indicated
in the Basic Usage section. A full description of goals can be found with
[Apigee Maven Config Plugin](https://github.com/apigee/apigee-config-maven-plugin) 
and the [Apigee Maven Deploy Plugin](https://github.com/apigee/apigee-deploy-maven-plugin)

### Export Dev App Keys Example
Suppose you only need to obtain the application keys for a product. You can 
use the [Apigee Maven Config Plugin](https://github.com/apigee/apigee-config-maven-plugin) 
as follows: 

    mvn apigee-config:exportAppKeys \
    -P{profile} \
    -Dorg={org} \
    -Dusername={username} \
    -Dpassword={password} \
    -Dapigee-config.dir=target/resources/edge \
    -Dapigee.config.exportDir=./target/test/integration

