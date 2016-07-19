'use strict';

/**
 *
 * @constructor
 * @param {Request} req - the express request
 * @returns {void}
 */
var FaqModel = function (req) {
	// if more than 1 loan then show history link
	this.loanActivityHistory = req.session.businessLoanAccounts.length > 1;
};

FaqModel.prototype = {};

module.exports = FaqModel;
