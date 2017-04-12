/* jslint node: true */
'use strict';

var config = require('../../test-config.json');
var apps = require('../../devAppKeys.json');

var creds = {};

function getCreds(appName, productName){
	for(var app in apps){
  	if(apps[app].name === appName){
    	var credentials = apps[app].credentials;
      for(var credential in credentials){
      	var products = credentials[credential].apiProducts;
        for(var product in products){
          if(products[product].apiproduct === productName){
            creds.consumerKey = credentials[credential].consumerKey;
            creds.consumerSecret = credentials[credential].consumerSecret;
          }
        }
      }
    }
  }
}

module.exports = function() {

	this.registerHandler("BeforeFeatures", function(event, next) {
    	getCreds(config.currencyApi.app, config.currencyApi.product);
      	return next();
  	});
	
	this.When(/^I request a non-existing API resource$/, {timeout: 60 * 1000}, function(callback) {
		this.apickli.get('/blah?apikey='+creds.consumerKey, callback);
	});
};
