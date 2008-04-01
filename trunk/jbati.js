/*  jBati JavaScript ORM Framework, version 0.0.2
 *  (c) 2008 Marty Kube <martykube@yahoo.com>
 *
 *  jBati is freely distributable under the terms of the GPL V2 license.
 *  For details, see the jBati web site: http://code.google.com/p/jbati
 *
/*--------------------------------------------------------------------------*/

Jaxer.Log.info('Loading jbati.js'); 

//****************************
// jBati - namespace for jBati
//****************************

if(jBati == undefined) {
	Jaxer.Log.info('Setting jBati'); 
	var jBati = {};
}

jBati.log = new Jaxer.Log.ModuleLogger('jBati', Jaxer.Log.TRACE);
jBati.toJSON = function(object) { return Jaxer.Serialization.toJSONString(object); }

//*********************************************
// jBati.SqlMapConfig - User configuration data
//*********************************************

jBati.SqlMapConfig = {};
jBati.SqlMapConfig.sqlMaps = [];


// Add an sqlMap
jBati.SqlMapConfig.addSqlMap = function(sqlMap) {
	jBati.SqlMapConfig.sqlMaps.push(sqlMap);
}

// Fish out a statement by ID
jBati.SqlMapConfig.getStatementById = function(statementId) {
	jBati.log.trace('jBati.SqlMapConfig.getStatementById');
	for each (var sqlMap in jBati.SqlMapConfig.sqlMaps) {
		for each (var statement in sqlMap.statements) {
			if(statement.id == statementId) {
				jBati.log.trace('returning statement: ' + jBati.toJSON(statement));
				return statement;
			}
		}
	}
	throw new Error('jBati.SqlMapConfig.getStatementById: ' + 
		'Could not find statament for id: ' + statementId);
};

//*****************************************
// jBati.SqlMapClient - User query exection 
//*****************************************

jBati.SqlMapClient = {}

// read 
jBati.SqlMapClient.queryForObject = function(id, parameterObject) {
	jBati.log.debug('jBati.SqlMapClient.queryForObject');
	
	var statement = jBati.SqlMapConfig.getStatementById(id);
	jBati.log.trace('statement: ' + jBati.toJSON(statement.sql));

	var resultSet = jBati.SqlMapClient.bindExectute(statement, parameterObject);

	// Unmarshal
	jBati.log.trace('creating new object: ' + statement.resultClass);
	var newObject = eval('new ' + statement.resultClass + '()');
	for(i = 0; i <  resultSet.columns.length; i++) {
		newObject[resultSet.columns[i]] = resultSet.rowsAsArrays[0][i];
	}
	jBati.log.trace('newObject: ' + jBati.toJSON(newObject));
	
	return newObject;
};

// insert
jBati.SqlMapClient.insert = function(id, parameterObject) {
	jBati.log.debug('jBati.SqlMapClient.insert');
	jBati.SqlMapClient.fetchBindExecute(id, parameterObject);	
}

// update
jBati.SqlMapClient.update = function(id, parameterObject) {
	jBati.log.debug('jBati.SqlMapClient.update');
	jBati.SqlMapClient.fetchBindExecute(id, parameterObject);	
}

// update
jBati.SqlMapClient.delete = function(id, parameterObject) {
	jBati.log.debug('jBati.SqlMapClient.delete');
	jBati.SqlMapClient.fetchBindExecute(id, parameterObject);	
}

// fetch statement, bind parameters, and execute
jBati.SqlMapClient.fetchBindExecute = function(id, parameterObject) {
	jBati.log.debug('jBati.SqlMapClient.fetchBindExecute');

	var statement = jBati.SqlMapConfig.getStatementById(id);
	jBati.log.trace('statement: ' + jBati.toJSON(statement.sql));
	
	return jBati.SqlMapClient.bindExectute(statement, parameterObject);
}

// bind parameters and execute
jBati.SqlMapClient.bindExectute = function (statement, parameterObject) {
	jBati.log.debug('jBati.SqlMapClient.bindExectute');

	// bind
	var boundStatement = jBati.ParameterMapper.bind(statement.sql, parameterObject);
	jBati.log.trace('boundStatement: ' + jBati.toJSON(boundStatement));
	
	// execute
	var resultSet = Jaxer.DB.execute(boundStatement.sql, boundStatement.parameters);
	jBati.log.trace('resultSet: ' + jBati.toJSON(resultSet));
	
	return resultSet;
}

//************************************************************************
// ParameterMapper - translates from iBatis sql/params to jaxer sql/params
//************************************************************************

jBati.ParameterMapper = function () {};

jBati.ParameterMapper.prototype = {
	sql: '',
	parameters: []
};

// returns a ParameterMapper containing jaxer sql/params
jBati.ParameterMapper.bind = function(sql, parameterObject) {
	jBati.log.debug('jBati.ParameterMapper.bind');
	var pm = new jBati.ParameterMapper();
	var replacementTokenRegex = /#([^#]+)#/g;
	var matches;
	var copyFrom = 0;
	while(matches = replacementTokenRegex.exec(sql)) {
		pm.sql += 
			sql.substring(copyFrom, replacementTokenRegex.lastIndex - matches[0].length) + '?';
		copyFrom = replacementTokenRegex.lastIndex;
		jBati.ParameterMapper.addParameter(pm, matches[1], parameterObject);
	}
	pm.sql += sql.substring(copyFrom, sql.length);
	return pm;
};

jBati.ParameterMapper.addParameter = function(parameterMapper, parameterName, parameterObject) {
	if(jBati.ParameterMapper.isScalar(parameterObject)) {
		parameterMapper.parameters.push(parameterObject);
	} else {
		if(!jBati.ParameterMapper.hasProperty(parameterName, parameterObject)) {
			throw new Error('Missing property named: ' + parameterName 
				+ ' for object ' + parameterObject);
		}
		parameterMapper.parameters.push(parameterObject[parameterName]);
	}
};	

jBati.ParameterMapper.isScalar = function(maybeScalar) {
	if (	
			(maybeScalar instanceof Number)  || 
			(maybeScalar instanceof String)  ||
			(maybeScalar instanceof Date)    ||
			(typeof maybeScalar == 'number') ||
			(typeof maybeScalar == 'string') ) {
		return true;
	}
	return false;
};

jBati.ParameterMapper.hasProperty = function(parameterName, parameterObject) {
	for(var i in parameterObject) {
		if(i == parameterName) {
			return true;
		}
	}
	return false;
};

Jaxer.Log.info('Loading jbati.js complete'); 
