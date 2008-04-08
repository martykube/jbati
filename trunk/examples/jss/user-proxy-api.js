//
// User data access API - server callbacks
//

function createPerson(parameterObject) {
	Examples.jbatiClient.insert('insertPerson', parameterObject);
};

function readPerson(parameterObject) {
	return Examples.jbatiClient.queryForObject('getPerson', parameterObject);
};

function updatePerson(parameterObject) {
	return Examples.jbatiClient.update('updatePerson', parameterObject);
};

function deletePerson(parameterObject) {
	Jaxer.Log.info('deletePerson: parameterObject: ' + parameterObject);
	return Examples.jbatiClient.delete('deletePerson', parameterObject);
};

createPerson.proxy = readPerson.proxy = updatePerson.proxy = deletePerson.proxy = true;
