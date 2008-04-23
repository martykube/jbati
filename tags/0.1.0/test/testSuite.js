//
// jBati test harness
//

//
// Testing utility functions
//

function assertTrue(val, msg) {
	if(!val) throw new Error(msg);
}

function assertEquals(actual, expected, msg) {
	var equal = true;
	//JBati.Server.log.trace('assertEquals: actual: ' + actual);
	//JBati.Server.log.trace('assertEquals: expected: ' + expected);
	if(expected instanceof Date) {
		//JBati.Server.log.trace('assertEquals: looks like a Date');
		if(!(
			actual.getUTCFullYear() == expected.getUTCFullYear() &&
			actual.getUTCMonth() == expected.getUTCMonth() &&
			actual.getUTCDate() == expected.getUTCDate() &&
			actual.getUTCHours() == expected.getUTCHours() &&
			actual.getUTCMinutes() == expected.getUTCMinutes() &&
			actual.getUTCSeconds() == expected.getUTCSeconds() &&
			actual.getUTCMilliseconds() == expected.getUTCMilliseconds()
			)) {
				//JBati.Server.log.trace('assertEquals: not equal');
				equal = false;
		}
	}
	else if(typeof expected == 'object') {
		//JBati.Server.log.trace('assertEquals: looks like an Object');
		for(var i in actual) {
			//JBati.Server.log.trace('assertEquals: comparing: ' + actual[i].valueOf() + ' and ' + expected[i].valueOf());
			if(actual[i].valueOf() != expected[i].valueOf()) {
				//JBati.Server.log.trace('assertEquals: not equal');
				equal = false;
				break;
			}
		}
	} else {
		//JBati.Server.log.trace('assertEquals: looks like a scalar');
		if(actual != expected) {
			//JBati.Server.log.trace('assertEquals: not equal');
			equal = false;
		}
	}
	if(!equal) {
		throw new Error(msg  + '; found: ' + actual + ', expected: ' + expected);
	}
}

function fail(msg) {
	throw new Error(msg);
}

function removeIfExists(fileOrDir) {
	JBati.Server.log.debug('removeIfExists: ' + fileOrDir.getPath());
	if(fileOrDir.exists()) fileOrDir.remove();
}

function createIfNotExists(fileOrDir) {
	JBati.Server.log.debug('createIfNotExists: ' + fileOrDir.getPath());
	if(!fileOrDir.exists()) fileOrDir.create();
}


//
// Load all of the test cases
//

(function () {

	JBati.Server.log.info('testSuite.js');
	if(typeof JBati == 'undefined') {JBati = {};}
	JBati.Test = {};
		
	Jaxer.load('testParameterMapper.js');
	Jaxer.load('testSqlMapClient.js');
	Jaxer.load('testSqlMapClientBuilder.js');
	Jaxer.load('testSqlMapConfig.js');

})();

function getTestCases() {
  return JBati.Test;
}
getTestCases.proxy = true;
