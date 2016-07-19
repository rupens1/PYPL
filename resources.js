'use strict';

/**
 *
 * @constructor
 * @param {Request} req - the express request
 * @returns {void}
 */
var ResourcesModel = function (req) {
	this.type = 'dashboard';
	this.locale = req.locality.locale;
	this.loanActivityHistory = req.session.businessLoanAccounts.length > 1;
};

ResourcesModel.prototype = {};

module.exports = ResourcesModel;
