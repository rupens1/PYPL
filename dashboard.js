'use strict';
/**
 * View model for dashboard page
 *
 * @param {Request} req - the web request
 * @constructor
 * @return {void}
 */
var DashboardModel = function (req) {
	// if more than 1 loan then show history link
	this.loanActivityHistory = req.session.businessLoanAccounts.length > 1;
};


DashboardModel.prototype = {
};

module.exports = DashboardModel;

