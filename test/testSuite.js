
(function () {

	JBati.Server.log.info('testSuite.js');
	if(typeof JBati == 'undefined') {JBati = {};}
	JBati.Test = {};
	Jaxer.load('testParameterMapper.js');

})();

function getTestCases() {
	return JBati.Test;
}
getTestCases.proxy = true;
