const alert = require('cli-alerts');

module.exports.logSuccess = info => {
	alert({
		type: `success`,
		name: `Success`,
		msg: info
	});
	console.log();
};
module.exports.logError = info => {
	alert({
		type: `error`,
		name: `Error`,
		msg: info
	});
	console.log();
};
module.exports.logInfo = info => {
	alert({
		type: `info`,
		name: `Info`,
		msg: info
	});
	console.log();
};
