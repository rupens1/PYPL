'use strict';

var moment = require('moment');

/**
 * Set No Activity message for the model
 * @param {object} req - request object
 * @param {object} model - dashbord or activity model
 * @param {object} loan - loan information returned by fpaccount service
 * @returns {void}
 */
module.exports.setNoActivityMessage = function(req, model, loan) {
	var creationDate = req.locality.griffin.normalizeDateWithOptions(loan.creation_date, {pattern: 'yyyy-MM-dd'});
	var currentDate = moment().startOf('day');

	if (currentDate.diff(creationDate, 'days') >= 90) {
		model.noActivityMessage = 'inactiveLoan';
	} else {
		model.noActivityMessage = 'newLoan';
	}
};
