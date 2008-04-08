/*  JBati JavaScript ORM Framework, version 0.0.3
 *  (c) 2008 Marty Kube <martykube@yahoo.com>
 *
 *  JBati is freely distributable under the terms of the GPL V2 license.
 *  For details, see the JBati web site: http://code.google.com/p/JBati
 *
/*--------------------------------------------------------------------------*/

(function() {

	// The JBati global object
	if(typeof JBati == 'undefined') { JBati = {}; }

})();


(function () {

	var Server = {};
	Server.log = new Jaxer.Log.ModuleLogger('JBati.Server', Jaxer.Log.TRACE);

	/********************************
	* SqlMapClient
	********************************/

	Server.SqlMapClient = function (sqlMapConfig) {
		this.config = sqlMapConfig;
	};

	// create
	Server.SqlMapClient.prototype.insert = function(id, parameterObject) {
		Server.log.debug('SqlMapClient.insert');
		this.fetchBindExecute(id, parameterObject);	
	};

	// read
	Server.SqlMapClient.prototype.queryForObject = function(id, parameterObject) {
		Server.log.debug('SqlMapClient.queryForObject');
		
		var statement = this.getStatementById(id);
		var resultSet = this.bindExectute(statement, parameterObject);
	
		// Unmarshal
		Server.log.trace('creating new object: ' + statement.@resultClass);
		var newObject = eval('new ' + statement.@resultClass + '()');
		for(i = 0; i <  resultSet.columns.length; i++) {
			newObject[resultSet.columns[i]] = resultSet.rowsAsArrays[0][i];
		}
		Server.log.trace('newObject: ' + Jaxer.Serialization.toJSONString(newObject));
		
		return newObject;
	};

	// update
	Server.SqlMapClient.prototype.update = function(id, parameterObject) {
		Server.log.debug('SqlMapClient.update');
		this.fetchBindExecute(id, parameterObject);	
	};

	// update
	Server.SqlMapClient.prototype.delete = function(id, parameterObject) {
		Server.log.debug('SqlMapClient.delete');
		this.fetchBindExecute(id, parameterObject);	
	};

	// fetch statement, bind parameters, and execute
	Server.SqlMapClient.prototype.fetchBindExecute = function(id, parameterObject) {
		Server.log.debug('SqlMapClient.fetchBindExecute');
	
		// fetch
		var statement = this.getStatementById(id);
		Server.log.trace('statement: ' + statement.sql);
		
		return this.bindExectute(statement, parameterObject);
	};

	// bind parameters and execute
	Server.SqlMapClient.prototype.bindExectute = function (statement, parameterObject) {
		Server.log.debug('SqlMapClient.bindExectute');
	
		// bind
		var boundStatement = Server.ParameterMapper.bind(statement.toString(), parameterObject);
		
		// execute
		Server.log.trace('SqlMapClient: executing sql: ' + boundStatement.sql);
		Server.log.trace('SqlMapClient: with parameters: ' + boundStatement.parameters);
		var resultSet = Jaxer.DB.execute(boundStatement.sql, boundStatement.parameters);
		
		return resultSet;
	};

	// Fish out a statement by ID
	Server.SqlMapClient.prototype.getStatementById = function(statementId) {
		Server.log.debug('SqlMapClient.getStatementById');

		var statement = this.config.sqlMap.*.(@id == statementId);
		Server.log.trace('statement: ' + statement.toXMLString());

		if(statement.length() != 1) {		
			throw new Error('SqlMapConfig.getStatementById: ' + 
				'Could not find statament for id: ' + statementId);
		}
		return statement;
	};

	//************************************************************************
	// ParameterMapper - translates from iBatis sql/params to jaxer sql/params
	//************************************************************************
	
	Server.ParameterMapper = function () {
		this.sql = '';
		this.parameters = new Array();
	};

	Server.ParameterMapper.prototype.addParameter = function(parameterName, parameterObject) {
		if(this.isScalar(parameterObject)) {
			Server.log.trace('ParameterMapper.addParameter: scalar: ' + 
				parameterObject);
			this.parameters.push(parameterObject);
		} else {
			if(!this.hasProperty(parameterName, parameterObject)) {
				throw new Error('Missing property named: ' + parameterName 
					+ ' for object ' + parameterObject);
			}
			Server.log.trace('ParameterMapper.addParameter: property: ' + 
				parameterObject[parameterName]);
			this.parameters.push(parameterObject[parameterName]);
		}
	};

	Server.ParameterMapper.prototype.isScalar = function(maybeScalar) {
		var is = false;
		if (	
				(maybeScalar instanceof Number)  || 
				(maybeScalar instanceof String)  ||
				(maybeScalar instanceof Date)    ||
				(typeof maybeScalar == 'number') ||
				(typeof maybeScalar == 'string')) {
			is = true;
		}
		Server.log.trace('ParameterMapper.isScalar: ' + is);
		return is;
	};

	Server.ParameterMapper.prototype.hasProperty = function(parameterName, parameterObject) {
		var has = false;
		for(var i in parameterObject) {
			if(i == parameterName) {
				has = true;
			}
		}
		Server.log.trace('ParameterMapper.hasProperty: ' + has);
		return has;
	};

	// returns a ParameterMapper containing jaxer sql/params
	Server.ParameterMapper.bind = function(sql, parameterObject) {
		Server.log.debug('ParameterMapper.bind');
		Server.log.trace('ParameterMapper.bind: sql: ' + sql);
		Server.log.trace('ParameterMapper.bind: parameterObject: ' + Jaxer.Serialization.toJSONString(parameterObject));
		var pm = new Server.ParameterMapper();
		var replacementTokenRegex = /#([^#]+)#/g;
		var matches;
		var copyFrom = 0;
		while(matches = replacementTokenRegex.exec(sql)) {
			pm.sql += sql.substring(
				copyFrom, 
				replacementTokenRegex.lastIndex - matches[0].length) + 	'?';
			copyFrom = replacementTokenRegex.lastIndex;
			pm.addParameter(matches[1], parameterObject);
		}
		pm.sql += sql.substring(copyFrom, sql.length);
		return pm;
	};

	JBati.Server = Server;

})();
