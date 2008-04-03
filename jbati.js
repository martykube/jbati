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

if(typeof jBati == 'undefined') {
	var jBati = {};
}

jBati.log = new Jaxer.Log.ModuleLogger('jBati', Jaxer.Log.DEBUG);

jBati.toJSON = function(object) { return Jaxer.Serialization.toJSONString(object); }

//*****************************************
// jBati.SqlMapClient - User query exection 
//*****************************************

jBati.SqlMapClient = function (sqlMapConfig) {
	this.config = sqlMapConfig;
}

jBati.SqlMapClient.prototype = {
	config: undefined,
	
	queryForObject: function(id, parameterObject) {
		jBati.log.debug('SqlMapClient.queryForObject');
		
		var statement = this.getStatementById(id);
		var resultSet = this.bindExectute(statement, parameterObject);
	
		// Unmarshal
		jBati.log.trace('creating new object: ' + statement.resultClass);
		var newObject = eval('new ' + statement.@resultClass + '()');
		for(i = 0; i <  resultSet.columns.length; i++) {
			newObject[resultSet.columns[i]] = resultSet.rowsAsArrays[0][i];
		}
		jBati.log.trace('newObject: ' + jBati.toJSON(newObject));
		
		return newObject;
	},

	// insert
	insert: function(id, parameterObject) {
		jBati.log.debug('SqlMapClient.insert');
		this.fetchBindExecute(id, parameterObject);	
	},

	// update
	update: function(id, parameterObject) {
		jBati.log.debug('SqlMapClient.update');
		this.fetchBindExecute(id, parameterObject);	
	},

	// update
	delete: function(id, parameterObject) {
		jBati.log.debug('SqlMapClient.delete');
		this.fetchBindExecute(id, parameterObject);	
	},

	// fetch statement, bind parameters, and execute
	fetchBindExecute: function(id, parameterObject) {
		jBati.log.debug('SqlMapClient.fetchBindExecute');
	
		// fetch
		var statement = this.getStatementById(id);
		jBati.log.trace('statement: ' + jBati.toJSON(statement.sql));
		
		return this.bindExectute(statement, parameterObject);
	},

	// bind parameters and execute
	bindExectute: function (statement, parameterObject) {
		jBati.log.debug('SqlMapClient.bindExectute');
	
		// bind
		var boundStatement = jBati.ParameterMapper.bind(statement.toString(), parameterObject);
		jBati.log.trace('boundStatement: ' + jBati.toJSON(boundStatement));
		
		// execute
		var resultSet = Jaxer.DB.execute(boundStatement.sql, boundStatement.parameters);
		jBati.log.trace('resultSet: ' + jBati.toJSON(resultSet));
		
		return resultSet;
	},

	// Fish out a statement by ID
	getStatementById: function(statementId) {
		jBati.log.debug('SqlMapClient.getStatementById');

		var statement = this.config.sqlMap.*.(@id == statementId);
		jBati.log.trace('statement: ' + statement.toXMLString());

		if(statement.length() != 1) {		
			throw new Error('jBati.SqlMapConfig.getStatementById: ' + 
				'Could not find statament for id: ' + statementId);
		}
		return statement;
	}
};

// factory method to generate a client (jBati.SqlMapClient)
jBati.buildSqlMapClient = function (sqlMapConfig) {
	return new jBati.SqlMapClient(sqlMapConfig);
}

//************************************************************************
// ParameterMapper - translates from iBatis sql/params to jaxer sql/params
//************************************************************************

jBati.ParameterMapper = function () {
	this.sql = '';
	this.parameters = [];
};

jBati.ParameterMapper.prototype = {
	
	addParameter: function(parameterName, parameterObject) {
		if(this.isScalar(parameterObject)) {
			jBati.log.trace('jBati.ParameterMapper.addParameter: scalar' + 
				parameterObject[parameterName]);
			this.parameters.push(parameterObject);
		} else {
			if(!this.hasProperty(parameterName, parameterObject)) {
				throw new Error('Missing property named: ' + parameterName 
					+ ' for object ' + parameterObject);
			}
			jBati.log.trace('jBati.ParameterMapper.addParameter: property' + 
				parameterObject[parameterName]);
			this.parameters.push(parameterObject[parameterName]);
		}
	},

	isScalar: function(maybeScalar) {
		var is = false;
		if (	
				(maybeScalar instanceof Number)  || 
				(maybeScalar instanceof String)  ||
				(maybeScalar instanceof Date)    ||
				(typeof maybeScalar == 'number') ||
				(typeof maybeScalar == 'string') ) {
			is = true;
		}
		jBati.log.trace('jBati.ParameterMapper.isScalar: ' + is);
		return is;
	},

	hasProperty: function(parameterName, parameterObject) {
		var has = false;
		for(var i in parameterObject) {
			if(i == parameterName) {
				has = true;
			}
		}
		jBati.log.trace('jBati.ParameterMapper.hasProperty: ' + has);
		return has;
	}
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
		pm.addParameter(matches[1], parameterObject);
	}
	pm.sql += sql.substring(copyFrom, sql.length);
	jBati.log.trace('jBati.ParameterMapper.bind: ' + jBati.toJSON(pm));
	return pm;
};

Jaxer.Log.info('Loading jbati.js complete'); 
