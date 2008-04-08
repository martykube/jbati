//
// User data access API - server callbacks
//

// Create a jBati client on the server
(function () {

	if(typeof Examples == 'undefined') { Examples = {}; }
	Examples.sqlMapClient = new JBati.Server.SqlMapClient('ExamplesJSS'); 

})();

//
// Proxied functions
//
function createPerson(parameterObject) {
	Examples.sqlMapClient.insert('insertPerson', parameterObject);
};

function readPerson(parameterObject) {
	return Examples.sqlMapClient.queryForObject('getPerson', parameterObject);
};

function updatePerson(parameterObject) {
	return Examples.sqlMapClient.update('updatePerson', parameterObject);
};

function deletePerson(parameterObject) {
	Jaxer.Log.info('deletePerson: parameterObject: ' + parameterObject);
	return Examples.sqlMapClient.delete('deletePerson', parameterObject);
};

createPerson.proxy = readPerson.proxy = updatePerson.proxy = deletePerson.proxy = true;
