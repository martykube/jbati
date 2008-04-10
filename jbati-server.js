/*	jBati JavaScript ORM Framework, version 0.0.3
*	(c) 2008 Marty Kube <martykube@yahoo.com>
*
*	jBati is freely distributable under the terms of the GPL V2 license.
*	For details, see the JBati web site: http://code.google.com/p/JBati
*
/*--------------------------------------------------------------------------*/


/**
* @fileoverview
* The jBati server side (browser) implementation.<br/>
* jBati uses the global variable JBati for it's namespace.
* @author Marty Kube - martykube@yahoo.com
* @version 0.?.?
*/

(function() {

	/** Global object used as the jBati namespace. */
	if(typeof JBati == 'undefined') { JBati = {};}
	
	/** 
	* The jBati namespace for the Server (browser) API. 
	* @class
	*/
	if(typeof JBati.Server == 'undefined') { var Server = {};}
	
	/** 
	* Logger for jBati 
	*/
	Server.log = new Jaxer.Log.ModuleLogger('JBati.Server', Jaxer.Log.TRACE);
	
	/**
	* Builds SqlMapClient instances from a supplied resource (e.g. XML configuration file).
	* 
	* The SqlMapClientBuilder class is responsible for parsing configuration documents and 
	* building the SqlMapClient instance. Its current implementation works with XML 
	* configuration files (e.g. sql-map-config.xml). 
	* 
	* The buildSqlMapClient method returns a {@link SqlMapClient} wihch is useful on the server
	* side.	However, the main usage patter is to load the configuration on the server side and
	* latter fetch the SqlMapClient on the browser.	Thus, names are used to support multiple 
	* database connection/sqlMapConfig combinations.  If no name is provided the configuration
	* becomes the default configuration.
	* 
	*/
	var SqlMapClientBuilder = {};
	
	/**
	* Holds the avaiable configurations.
	* @private
	*/
	SqlMapClientBuilder.configurations = {};
	
	/** Name of the default configuration */
	SqlMapClientBuilder.DEFAULT_CONFIGURATION = '__DEFAULT_CONFIGURATION__';
	
	/** 
	* Reads a sqlMapConfig XML string and builds new SqlMapClient.
	* If one parameter is supplied, it is assumed to the sqlMapConfig XML for the default connection.
	* If two parameters are supplied, the first parameter is taken to be the configuration name,
	* and the second parameter is taken to be the configurations XML.
	* The SqlMapClient returned can be fetched at a later time with {@link 
	SqlMapClientBuilder#getSqlMapClient}.
	* @nameOrXml {String} The name of the configuration of the sqlMapConfig XML.
	* @xml {String} The sqlMapConfig XML
	* @returns A SqlMapClient instance
	* @type SqlMapClient.
	* 
	*/
	SqlMapClientBuilder.buildSqlMapClient =	function (nameOrXml, xml) {
		var configName = (arguments.length == 1 ?  SqlMapClientBuilder.DEFAULT_CONFIGURATION :	nameOrXml);
		var sqlMapConfig = (arguments.length == 1 ?  nameOrXml : xml);
		SqlMapClientBuilder.configurations[configName] = sqlMapConfig;
		return new Server.SqlMapClient(sqlMapConfig);
	};
	
	/**
	* Builds a SqlMapClient from a sqlMapConfig that has been already read.
	* @param {String} name The name of the configuration.	If ommited, the default configuration
	* will be used.
	* @param name The name of the configuration from which a client is built.
	* @return A SqlMapClient
	* @type SqlMapClient
	* @throws Error If a configuration for name cannot be found.
	*/
	SqlMapClientBuilder.getSqlMapClient =	function (name) {
		var config;
		var configName = (arguments.length == 0 ?  
		SqlMapClientBuilder.DEFAULT_CONFIGURATION :	name);
		if((config = SqlMapClientBuilder.configurations[configName])) {
			return new Server.SqlMapClient(config);
		}
		throw new Error('SqlMapClientBuilder coulnd not find a sqlMapConfig for name: ' + name);
	};
	
	
	Server.SqlMapClientBuilder = SqlMapClientBuilder;
	
	/********************************
	* SqlMapClient
	********************************/
	
	SqlMapClient = {};
	
	/**
	* @private
	*/
	SqlMapClient = function (sqlMapConfig) {
		Server.log.trace('SqlMapClient(): ' + sqlMapConfig);
		this.config = new XML(sqlMapConfig);
	};
	
	// Create
	SqlMapClient.prototype.insert = function(statementId, parameterObject) {
		Server.log.debug('SqlMapClient.insert');
		this.fetchBindExecute(statementId, parameterObject);	
	};
	
	// Read
	SqlMapClient.prototype.queryForObject = function(statementId, parameterObject) {
		Server.log.debug('SqlMapClient.queryForObject');
		
		var statement = this.getStatementById(statementId);
		var resultSet = this.bindExectute(statement, parameterObject);
		
		// Unmarshal
		Server.log.trace('creating new object: ' + statement.@resultClass);
		var newObject = eval('new ' + statement.@resultClass + '()');
		for(i = 0; i <	resultSet.columns.length; i++) {
			newObject[resultSet.columns[i]] = resultSet.rowsAsArrays[0][i];
		}
		Server.log.trace('newObject: ' + Jaxer.Serialization.toJSONString(newObject));
		
		return newObject;
	};
	
	// Update
	SqlMapClient.prototype.update = function(statementId, parameterObject) {
		Server.log.debug('SqlMapClient.update');
		this.fetchBindExecute(statementId, parameterObject);	
	};
	
	// Delete
	SqlMapClient.prototype.remove = function(statementId, parameterObject) {
		Server.log.debug('SqlMapClient.remove');
		this.fetchBindExecute(statementId, parameterObject);	
	};
	
	// fetch statement, bind parameters, and execute
	SqlMapClient.prototype.fetchBindExecute = function(statementId, parameterObject) {
		Server.log.debug('SqlMapClient.fetchBindExecute');
		
		// fetch
		var statement = this.getStatementById(statementId);
		Server.log.trace('statement: ' + statement.sql);
		
		return this.bindExectute(statement, parameterObject);
	};
	
	// bind parameters and execute
	SqlMapClient.prototype.bindExectute = function (statement, parameterObject) {
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
	SqlMapClient.prototype.getStatementById = function(statementId) {
		Server.log.debug('SqlMapClient.getStatementById');
		Server.log.trace('SqlMapClient.config: \n' + this.config.toXMLString());
		
		var statement = this.config.sqlMap.*.(@id == statementId);
		Server.log.trace('statement: ' + statement.toXMLString());
		
		if(statement.length() != 1) {		
			throw new Error('SqlMapConfig.getStatementById: ' + 
			'Could not find statament for id: ' + statementId);
		}
		return statement;
	};
	
	Server.SqlMapClient = SqlMapClient;
	
	//************************************************************************
	// ParameterMapper - translates from iBatis sql/params to Jaxer sql/params
	//************************************************************************
	
	ParameterMapper = {};
	
	ParameterMapper = function () {
		this.sql = '';
		this.parameters = new Array();
	};
	
	ParameterMapper.prototype.addParameter = function(parameterName, parameterObject) {
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
	
	ParameterMapper.prototype.isScalar = function(maybeScalar) {
		var is = false;
		if (	
		(maybeScalar instanceof Number)  || 
		(maybeScalar instanceof String)  ||
		(maybeScalar instanceof Date)	 ||
		(typeof maybeScalar == 'number') ||
		(typeof maybeScalar == 'string')) {
			is = true;
		}
		Server.log.trace('ParameterMapper.isScalar: ' + is);
		return is;
	};
	
	ParameterMapper.prototype.hasProperty = function(parameterName, parameterObject) {
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
	ParameterMapper.bind = function(sql, parameterObject) {
		Server.log.debug('ParameterMapper.bind');
		Server.log.trace('ParameterMapper.bind: sql: ' + sql);
		Server.log.trace('ParameterMapper.bind: parameterObject: ' + 
		Jaxer.Serialization.toJSONString(parameterObject));
		var pm = new ParameterMapper();
		var replacementTokenRegex = /#([^#]+)#/g;
		var matches;
		var copyFrom = 0;
		while(null != (matches = replacementTokenRegex.exec(sql))) {
			pm.sql += sql.substring(
			copyFrom, 
			replacementTokenRegex.lastIndex - matches[0].length) + 	'?';
			copyFrom = replacementTokenRegex.lastIndex;
			pm.addParameter(matches[1], parameterObject);
		}
		pm.sql += sql.substring(copyFrom, sql.length);
		return pm;
	};
	
	Server.ParameterMapper = ParameterMapper;
	
	JBati.Server = Server;

})();

/********************************************************
* Dispatch callbacks from the client side implementation
*********************************************************/

function __jbati_proxy(sqlMapConfigName, clientMethodName) {
	var client = JBati.Server.SqlMapClientBuilder.getSqlMapClient(sqlMapConfigName);
	if (arguments.length == 3) {
		return client[clientMethodName](arguments[2]);
	} else if (arguments.length == 4) {
		return client[clientMethodName](arguments[2], arguments[3]);
	} else {
		throw new Error(
		'__jbati_proxy cannot dispatch, arguments.length: ' + arguments.length
		);
	}
}
__jbati_proxy.proxy = true;


