'use strict';

var servicecore = require('servicecore'),
	PPWCError = require('../../lib/ppwcError'),
	errorCodes = require('./activityError.json'),
	LoanActivity = require('./../commons/loanActivity'),
	logger = require('../../lib/cal-helper/ppwcCalLogger'),
	_ = require('lodash');

var fpActivityService = servicecore.create('fpactivity-paypal'),
	path = 'models/dashboard/activityHelper';

/**
 * load business loan activities from fpactivityserv
 * @param {string} params - params
 * @param {object} req - request object
 * @param {function} callback - callback function
 * @return {void}
 */

var	loadLoanActivities = function (params, req, callback) {
	var logDetails = {path: path, function: 'loadLoanActivities'};

	if (!req) {
		return callback(new PPWCError('Request is undefined', errorCodes.INPUT_VALIDATION_ERROR_400));
	}

	var activityList = [],
		securityContext = req.securityContext;

	if (!securityContext || !securityContext.actor) {
		return callback(new PPWCError('Missing security context', errorCodes.INPUT_VALIDATION_ERROR_400));
	}

	var account = {
		accountNumber: securityContext.actor.account_number,
		id: securityContext.actor.id,
		partyId: securityContext.actor.party_id,
		fpAccountId: params.fpAccountId
	};

	logger.info(req, {location: logDetails,
		getBusinessLoanActivitiesRequest: {
			account: account,
			params: params
		}
	});

	if (params.fpAccountId) {

		fpActivityService.getBusinessLoanActivities(account, params, function (err, response) {

			if (err || response.statusCode !== 200) {
				return callback(new PPWCError('FPActivityServ call returned error', errorCodes.SERVICE_COMM_ERROR_500), response);
			}

			if (response && response.body && response.body.items.length) {
				logger.info(req, {location: logDetails, getBusinessLoanActivitiesResponse: response.body});
				activityList = response.body.items.map(function (activity) {
					var loanActivity = new LoanActivity(activity, req);
					loanActivity.mapActivity();
					return loanActivity.toObject();
				});
			}

			for (var i = 0; i < activityList.length; i++) {
				var obj = activityList[i];
				obj.isIndexEven = (i % 2 === 0);
			}
			callback(null, activityList);
		});
	} else {
		return callback(new PPWCError('FPAccount is undefined or invalid', errorCodes.INVALID_FPACCOUNT_ID_400));
	}
};


exports.loadLoanActivities = loadLoanActivities;


/**
 * load business loan activities from fpactivityserv for a specified range
 * @param {string} params - params
 * @param {object} req - request object
 * @param {date} earliestDate - start date for activity
 * @param {date} latestDate - end date for activity
 * @param {function} callback - callback function
 * @return {void}
 */
exports.loadLoanActivitiesRange = function (params, req, earliestDate, latestDate, callback) {
	var logDetails = {path: path, function: 'loadLoanActivitiesRange'};
	logger.info(req, {location: logDetails,
		loadLoanActivitiesParams: {
			params: params,
			earliest_date: earliestDate,
			latest_date: latestDate
		}
	});

	loadLoanActivities(params, req, function(err, activity) {
		if (err) {
			return callback(err, activity);
		}
		if (activity) {
			var filteredActivity = _.filter(activity, function(txn) {
				var txnDate = new Date(txn.txnDate);
				return (txnDate.getTime() >= earliestDate.getTime() && txnDate.getTime() <= latestDate.getTime());
			});

			logger.info(req, {location: logDetails,	filteredActivity: filteredActivity});
			return callback(err, filteredActivity);
		}
		callback(err, activity);
	});
};
