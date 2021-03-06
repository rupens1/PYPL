'use strict';

/**
 *
 * @constructor
 * @param {Request} req - the express request
 * @returns {void}
 */
var DashboardActivityModel = function (req) {
	// if more than 1 loan then show history link
	this.loanActivityHistory = req.session.businessLoanAccounts.length > 1;

	this.activities = [];
};


DashboardActivityModel.prototype = {};

module.exports = DashboardActivityModel;
