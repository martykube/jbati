/***********************************************************************  
 *  jBati JavaScript ORM Framework
 *  (c) 2008 Marty Kube martykube@yahoo.com
 *
 *  jBati is freely distributable under the terms of the GPL V2 license.
 *  For details, see the JBati web site: http://code.google.com/p/JBati
 *
 /**********************************************************************/

(function() {
  
	if(typeof JBati == 'undefined') { JBati = {};}
	
	// namespace: JBati.Server
	// The jBati server side implementation.
	//
	var Server = JBati.Server = {};
	
	// object: log
	// The server side logger.
	//
	Server.log = new Jaxer.Log.ModuleLogger('JBati.Server', Jaxer.Log.TRACE);
	
	// class: JBati.Server.SqlMapClientBuilder
	// Builds <SqlMapClient> instances from a supplied resource (e.g. XML configuration file).
	// 
	// A singleton class which is responsible for parsing configuration documents and 
	// building the SqlMapClient instance. 
	// 
	// Method <buildSqlMapClient> returns a server side SqlMapClient.
	// The main usage pattern is to load the configuration on the server side and
	// latter fetch a SqlMapClient in the browser.	Method <getSqlMapClient> fetches
	// a client by name.  Thus, names are used to support multiple 
	// database connection/sqlMapConfig combinations.  If no name is provided the 
	// configuration becomes the default configuration.
	//
	var SqlMapClientBuilder = Server.SqlMapClientBuilder = (function() {
		
		// property: configurations
		// Holds the available configurations.
		//
		var configurations = {};

		//property: DEFAULT_CONFIGURATION
		//Name of the default configuration.
		//
		var DEFAULT_CONFIGURATION = '__DEFAULT_CONFIGURATION__';
		
		return {

			// function:  buildSqlMapClient
			// Reads a sqlMapConfig XML string and builds new SqlMapClient.
			// If one parameter is supplied, it is assumed to the sqlMapConfig XML 
			// for the default connection. If two parameters are supplied, the first 
			// parameter is taken to be the configuration name, and the second 
			// parameter is taken to be the configurations XML.
			//
			// Parameters:
			// 	nameOrXml - The name of the configuration of the sqlMapConfig XML.
			//  xml - The sqlMapConfig XML string
			//
			// Returns:
			// 		A <SqlMapClient> instance
			//
			buildSqlMapClient: 	function (nameOrXml, xml) {
				var configName = (arguments.length == 1 ? DEFAULT_CONFIGURATION : nameOrXml);
				var sqlMapConfig = (arguments.length == 1 ?  nameOrXml : xml);
				configurations[configName] = sqlMapConfig;
				return new Server.SqlMapClient(new Server.SqlMapConfig(sqlMapConfig));
			},


			// function: getSqlMapClient
			// Fetches a SqlMapClient from a named and previously loaded sqlMapConfig.
			//
			// Parameters:
			// 	name - The name of the configuration.	If ommited, the default configuration
			// will be used.
			//
			// Returns:
			//	 A <SqlMapClient>
			// 
			// Throws:
			// 	An Error if a configuration for name cannot be found.
			//
			getSqlMapClient:	function (name) {
				var config;
				var configName = (arguments.length == 0 ? DEFAULT_CONFIGURATION :	name);
				if((config = configurations[configName])) {
					return new Server.SqlMapClient(new Server.SqlMapConfig(config));
				}
				throw new Error('SqlMapClientBuilder coulnd not find a sqlMapConfig for name: ' + name);
			}
		};
	})();

	
	// class JBati.SqlMapConfig
	// Reads sqlMapConfig XML, loads the included sqlMap elements, and supports
	// querries for statements.
	
	// constructor: SqlMapConfig
	// Create a SqlMapConfig from sqlMapConfig XML.  This method accepts a complete
	// XML including a xml processing instruction and a DOCTYPE declaration (both
	// or which are ignored).  The document element must be a <sqlMapConfig> 
	// element.
	//
	// Parameters:
	// sqlMapConfigXMLString - XML string for a sqlMapConfig
	//
	var SqlMapConfig = Server.SqlMapConfig = function(sqlMapConfigXMLString) {
	
		Server.log.debug('SqlMapConfig: constructor');
		
		sqlMapConfigXMLString	= SqlMapConfig.cleanUpXml(sqlMapConfigXMLString, 'sqlMapConfig');
		this.config = new XML(sqlMapConfigXMLString);

		Server.log.trace('SqlMapConfig: config: ' + this.config.toXMLString());
		Server.log.trace('SqlMapConfig: Contained sqlMap(s): ' +  (this.config.sqlMap).toXMLString());

		for each (var sqlMap in this.config.sqlMap) {
			this.maps.push(new SqlMap(sqlMap));
		}
	}
	
	// method: cleanUpXml
	// Removes a leading xml processing instruction and DOCTYPE declaration if present.
	//
	// Parameters:
	//	xmlString - The XML (as a string) to be cleaned up
	//	rootElement - The document element tage name
	//
	// Returns:
	//	The XML string with offending items removed
	//
	SqlMapConfig.cleanUpXml = function(xmlString, rootElement) {
		var cleanUp = new RegExp('<\s*' + rootElement, 'g');
		var match = cleanUp.exec(xmlString);
		if(!match) {
			throw new Error('SqlMapConfig.cleanUpXml - missing root element: ' +  rootElement);
		} 
		xmlString =  xmlString.substring(
				cleanUp.lastIndex - match[0].length, xmlString.length);
		return xmlString;
	}

	SqlMapConfig.prototype = {
	
		// property: config
		// The sqlMapConfig as an XML object.
		//
		config: new XML(),
		
		// property: maps
		// Included sqlMaps as <SqlMap> objects.
		//
		maps: [],
	
		// method: toXMLString
		// Show the underlying XML sqlMapConfig document as a string.
		//
		// Returns:
		// 	A XML string.
		//
		toXMLString: function() {
			return this.config.toXMLString();
		},

		// method: getStatementById
		// Fetches a SQL statement from the supporting SqlMap of this client.
		//
		// Parameters:
		//	statementId - The name of the SQL statement.
		//
		// Returns:
		//	The statement XML object.
		//
		getStatementById: function(statementId) {
			Server.log.debug('SqlMapConfig.getStatementById');
			Server.log.trace('SqlMapConfig.config: \n' + this.config.toXMLString());
			
			var statement = this.config.sqlMap.*.(@id == statementId);
			Server.log.trace('statement: ' + statement.toXMLString());
			
			if(statement.length() != 1) {		
				throw new Error('SqlMapConfig.getStatementById: ' + 
				'Could not find statament for id: ' + statementId);
			}
			return statement;
		}
	};
		
		
	// class: JBati.Server.SqlMap
	// Represents an instance of a sqlMap.
	
	// constructor: SqlMap 
	// Create a new instance from the sqlMap XML reference element (in sqlMapConfig).
	// Read the refered to XML document.
	//
	// Parameters:
	//	sqlMap - The sqlMap XML object in a sqlMapConfig XML document
	//
	var SqlMap = Server.SqlMap = function(sqlMap) {

		Server.log.debug('SqlMap: ' + sqlMap.toXMLString());
		this.configReference = sqlMap;

		if(this.configReference.@resource) {
			Server.log.trace('SqlMap: Resolving path to resource: ' + this.configReference.@resource);
			var path = Jaxer.Dir.resolvePath(this.configReference.@resource);
			Server.log.trace('SqlMap: Resolved path: ' + path);
			var theFile = new Jaxer.File(path);
			if(theFile.exists()){
				if(theFile.isReadable()) {
					theFile.open('r');
					var contents = theFile.read();
					Server.log.trace('SqlMap: xml: ' + contents);
					contents = SqlMapConfig.cleanUpXml(contents, 'sqlMap');
					this.config = new XML(contents);
					theFile.close();
				} else {
					throw new Error('SqlMap: file is not readable: ' + path);
				}
			} else {
				throw new Error('SqlMap: file does not exist: ' + path);
			}
		} else {
			throw new Error('SqlMap - don\'t know how to include sqlMap: ' + 
				this.configReference.toXMLString());
		}

	}
	
	SqlMap.prototype = {
		
		// property: reference
		// The sqlMap reference (from a sqlMapConfig file) as an XML object.
		configReference: new XML(),
		
		// property: config
		// The sqlMap as an XML object.
		config: new XML()
	
	};
		
	// class: JBati.Server.SqlMapClient
	// Provides the user API for executing SQL statements on the server side
	// and supporting implementation on the server side.
	// The user API provided matches the client API (see <JBati.Client.SqlMapClient>
	// for detailed documentation of the user API).
	//
	
	// constructor: SqlMapClient
	// Internal constructor, use <SqlMapClientBuilder.buildSqlMapClient> or 
	// <SqlMapClientBuilder.getSqlMapClient> instead.
	//
	// Parameters:
	//	sqlMapConfig - A <SqlMapConfig> instance.
	//
	var SqlMapClient = Server.SqlMapClient = function (sqlMapConfig) {
		this.sqlMapConfig = sqlMapConfig;
	};
	
	SqlMapClient.prototype = {

		// method: insert
		// Execute an insert statement.
		//
		insert: function(statementId, parameterObject) {
			Server.log.debug('SqlMapClient.insert');
			this.fetchBindExecute(statementId, parameterObject);	
		},

		// method: queryForObject
		// Execute a select statement for one object.
		//
		queryForObject: function(statementId, parameterObject) {
			Server.log.debug('SqlMapClient.queryForObject');
			
			var statement = this.sqlMapConfig.getStatementById(statementId);
			var resultSet = this.bindExectute(statement, parameterObject);
			
			// Unmarshal
			Server.log.trace('creating new object: ' + statement.@resultClass);
			var newObject = eval('new ' + statement.@resultClass + '()');
			for(i = 0; i <	resultSet.columns.length; i++) {
				newObject[resultSet.columns[i]] = resultSet.rowsAsArrays[0][i];
			}
			Server.log.trace('newObject: ' + Jaxer.Serialization.toJSONString(newObject));
			
			return newObject;
		},
		
		// method: update
		// Execute an update statement.
		//
		update: function(statementId, parameterObject) {
			Server.log.debug('SqlMapClient.update');
			this.fetchBindExecute(statementId, parameterObject);	
		},
		
		// method: remove
		// Execute a delete statement.
		//
		remove: function(statementId, parameterObject) {
			Server.log.debug('SqlMapClient.remove');
			this.fetchBindExecute(statementId, parameterObject);	
		},
		
		// method: fetchBindExecute
		// Fetches a mapped SQL statement by ID, binds the SQL 
		// paramaters to values provided by the parameterObject, and executes the SQL.
		//
		// Parameters:
		// 	statementId - Name of the sql.
		//	parameterObject - The object which provides values for the parameters in 
		//		the SQL.
		// Returns:
		//	The result set.
		//
		fetchBindExecute: function(statementId, parameterObject) {
			Server.log.debug('SqlMapClient.fetchBindExecute');
			
			// fetch
			var statement = this.sqlMapConfig.getStatementById(statementId);
			Server.log.trace('statement: ' + statement.sql);
			
			return this.bindExectute(statement, parameterObject);
		},

		// method: bindExectute
		// Binds the SQL  paramaters to value provided by the parameterObject, and 
		// executes the SQL.
		//
		// Parameters:
		// 	statement - The statement XML object to be executed.
		//	parameterObject - The object which provides values for the parameters in 
		//		the SQL.
		// Returns:
		//	The result set.
		//
		bindExectute: function (statement, parameterObject) {
			Server.log.debug('SqlMapClient.bindExectute');
			
			// bind
			var boundStatement = Server.ParameterMapper.bind(statement.toString(), parameterObject);
			
			// execute
			Server.log.trace('SqlMapClient: executing sql: ' + boundStatement.sql);
			Server.log.trace('SqlMapClient: with parameters: ' + boundStatement.parameters);
			var resultSet = Jaxer.DB.execute(boundStatement.sql, boundStatement.parameters);
			
			return resultSet;
		}

	};


	// class: JBati.Server.ParameterMapper 
	// Translates from SqlMap SQL/parameters to Jaxer sql/parameters ready
	// for binding and execution by Jaxer.DB.
	//
	
	// constructor: ParameterMapper
	// Internal constructor, use <bind> instead.
	//
	var ParameterMapper =  Server.ParameterMapper = function () {
		this.sql = '';
		this.parameters = new Array();
	};
	
	// function: bind
	// Creates a ParameterMapper from SqlMap SQL and a parameterObject.
	//
	// Parameters:
	// 	sql - The SQL string for which parameters are replaced.
	//	parameterObject - The object which provides values.
	//
	// Returns:
	//	A ParameterMapper instance holding bound sql and replacement parameters
	//	suitable for passing to Jaxer.DB.
	//
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

	ParameterMapper.prototype = {
		
		// method: addParameter
		// Find value associated witha name on the parameter object.
		// If parameterObject is a scalar, the name is ignored.
		//
		// Parameters:
		//	parameterName - The name for which a value is found in paramamterObject.
		//	parameterObject - The obect which holds the values. 
		//
		addParameter: function(parameterName, parameterObject) {
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
		},
		
		// method: isScalar
		// Determines if a variable is single valued. 
		//
		// Parameters:
		//	maybeScalar - The variable which is examined.
		//
		// Returns:
		//	true if the variable is a scalar, false otherwise.
		//
		isScalar: function(maybeScalar) {
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
		},
	
		// method: hasProperty
		// Determines if an object has a named property.
		//
		// Parameters:
		//	parameterName - The name of the property to check for.
		//	parameterObject - The object that is examined for the property.
		//
		// Returns:
		//	true if the object has the property, otherwise false.
		//
		hasProperty: function(parameterName, parameterObject) {
			var has = false;
			for(var i in parameterObject) {
				if(i == parameterName) {
					has = true;
				}
			}
			Server.log.trace('ParameterMapper.hasProperty: ' + has);
			return has;
		}
	
	};

})();


// section: Exported functions
// These objects are in the server side global namespace.

// function: __jbati_proxy
// A global function exported to the client for jBati callbacks via the Jaxer 
// proxy API.
//
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


//
// variable: JBati
// Provides the jBati namespace.
//
