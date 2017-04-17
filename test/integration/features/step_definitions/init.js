/* jshint node:true */
'use strict';

var apickli = require('apickli');
var config = require('../../test-config.json');

console.log('currency api: [' + config.currencyApi.domain + ', ' + config.currencyApi.basepath + ']');

module.exports = function() {

	/*this.BeforeFeatures(function (event, callback) {
        console.log('before!', event.getName());
        callback();
    });*/

    this.registerHandler("BeforeFeatures", function(event, next) {
    	console.log('before!');
      	return next();
  	});

	// cleanup before every scenario
	this.Before(function(scenario, callback) {
		this.apickli = new apickli.Apickli('https',
										   config.currencyApi.domain + config.currencyApi.basepath,
										   './test/integration/features/fixtures/');
		callback();
	});

	/*this.AfterFeatures(function (event, callback) {
        console.log('after!', event.getName());
        callback();
    });*/

    this.registerHandler("AfterFeatures", function(event, next) {
    	console.log('after!');
      	return next();
  	});
};
