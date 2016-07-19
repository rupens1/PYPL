'use strict';

var _ = require('lodash'),
	moment = require('moment');

/**
 * View Model for a specific Loan Entry
 *
 * @param {Request} req - the express request object
 * @param {Loan} loan - loan source object
 * @constructor
 * @return {void}
 */
var LoanEntry = function(req, loan) {
	var griffin = req.locality.griffin;
	// The loanStartDate and loanEndDate fields are Date objects - format them per the user locale
	this.loanStartDate = griffin.formatDate(loan.loanStartDate, 'yMMMd');
	this.loanEndDate = griffin.formatDate(loan.loanEndDate, 'yMMMd');

	var shortCurrencyFormat = {currencyDisplay: 'symbol', minimumFractionDigits: '0', maximumFractionDigits: '0'};

	this.loanAmount = griffin.formatNumber(loan.amount, shortCurrencyFormat);
	this.loanFee = griffin.formatNumber(loan.fee, shortCurrencyFormat);

	// Use the currency of the loan amount - assume it matches the fee currency.
	var currency = loan.amount.currency;
	// Add the loan amount and the fee amount for the total. Note that the values will only be whole dollar amounts.
	var totalLoanAmount = (+loan.amount.value) + (+loan.fee.value);
	this.total = griffin.formatNumber({'currency': currency, 'value': totalLoanAmount}, shortCurrencyFormat);

	this.repaymentPercentage = Math.floor(Number(loan.repaymentPercentage));

	this.timeInRepayment = moment(loan.loanEndDate).diff(loan.loanStartDate, 'days') - 3;
	if (this.timeInRepayment < 1) {
		this.timeInRepayment = 1;
	}

	// Average daily = total amount of payments divided by time in repayment
	var averageDailyPayment = totalLoanAmount / this.timeInRepayment;

	this.averageDailyRepayments = griffin.formatNumber({ 'currency': currency, 'value': averageDailyPayment }, shortCurrencyFormat);

	// This is needed for the download contract link
	this.fpAccountId = loan.fpAccountId;
};

/**
 * View model for dashboard history page
 *
 * @param {Request} req - the express request object
 * @param {Array} oldLoans - array of old loans to construct Loan Entry's with
 * @constructor
 * @return {void}
 */
var DashboardHistoryModel = function (req, oldLoans) {
	this.previousLoans = _.map(oldLoans, function(value) {
		return new LoanEntry(req, value);
	});
};

DashboardHistoryModel.prototype = {

};

module.exports = DashboardHistoryModel;

