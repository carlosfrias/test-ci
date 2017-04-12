/* jslint node: true */
'use strict';

var Promise = require('bluebird');


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

var assertSuccessfulApiResponse = function(apickli) {
	return new Promise(function(resolve, reject) {
		if (!apickli.scenarioVariables.isResponseSuccessful) {
			var assertion = apickli.assertResponseCode("200");
			if (!assertion.success) {
				return reject(assertion);
			}

			apickli.validateResponseWithSchema('rates.schema', function(assertion) {
				if (!assertion.success) {
					apickli.scenarioVariables.isResponseSuccessful = true;
					return reject(assertion);
				} else {
					return resolve();
				}
			});
		} else {
			return resolve();
		}
	});
};

module.exports = function() {

	this.registerHandler("BeforeFeatures", function(event, next) {
    	getCreds(config.currencyApi.app, config.currencyApi.product);
      	return next();
  	});

	this.When(/^I request all exchange rates with default values$/, {timeout: 60 * 1000}, function(callback) {
		this.apickli.get('/rates?apikey='+creds.consumerKey, callback);
	});

	this.When(/^I request all exchange rates with (.{3}) as the base currency$/, {timeout: 60 * 1000}, function(base, callback) {
		this.apickli.queryParameters.base = base;
		this.apickli.get('/rates?apikey='+creds.consumerKey, callback);
	});

	this.When(/^I request all exchange rates for (.*)$/, {timeout: 60 * 1000}, function(date, callback) {
		this.apickli.queryParameters.date = date;
		this.apickli.get('/rates?apikey='+creds.consumerKey, callback);
	});

	this.When(/^I request all exchange rates with (.{3}) as the base currency for (.*)$/, function(base, date, callback) {
		this.apickli.queryParameters.base = base;
		this.apickli.queryParameters.date = date;
		this.apickli.get('/rates?apikey='+creds.consumerKey, callback);
	});

	this.Then(/^I should see (.*) as the base currency$/, function(base, callback) {
		var self = this;
		assertSuccessfulApiResponse(this.apickli)
		.then(function() {
			var assertion = self.apickli.assertPathInResponseBodyMatchesExpression('$.base', base);
			if (assertion.success) {
				callback();
			} else {
				callback(JSON.stringify(assertion));
			}
		})
		.catch(function(assertion) {
			callback(JSON.stringify(assertion));
		});
	});

	this.Then(/^I should see the rates for the latest exchange day$/, function(callback) {
		var self = this;
		assertSuccessfulApiResponse(this.apickli)
		.then(function() {
			var response = JSON.parse(self.apickli.getResponseObject().body);
			var dateInResponse = new Date(response.date);

			var today = new Date();
			var toDate = new Date();
			var fromDate = new Date(today.setTime( today.getTime() - 3 * 86400000 ));

			if ((dateInResponse >= fromDate) && (dateInResponse <= toDate)) {
				callback();
			} else {
				callback('response date ' + dateInResponse + ' is not in acceptance range');
			}
		})
		.catch(function(assertion) {
			callback(JSON.stringify(assertion));
		});
	});

	this.Then(/^I should see the rates for (\d{4}-\d{2}-\d{2})$/, function(date, callback) {
		var self = this;
		assertSuccessfulApiResponse(this.apickli)
		.then(function() {
			var assertion = self.apickli.assertPathInResponseBodyMatchesExpression('$.date', date);
			if (assertion.success) {
				callback();
			} else {
				callback(JSON.stringify(assertion));
			}
		})
		.catch(function(assertion) {
			callback(JSON.stringify(assertion));
		});
	});

};
