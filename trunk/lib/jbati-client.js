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

	// namespace: JBati.Client
	// The jBati client side (browser) implementation.
	//
	JBati.Client = {};
	
	// class: JBati.Client.SqlMapClient
	// SqlMapClient provides the jBati query API for use in a browser.
	// 
	// Typical methods use the jBati proxy function to invoke a server side SQL 
	// operation. Most methods have two versions, the first performs a blocking 
	// call and the second version (for which the function name is post-fixed 
	// with 'Async') performs an asynchronous call.


	
	// constructor: SqlMapClient
	// Create a new client based on the name of a SqlMapConfig.
	// 
	// Parameters:
	//	sqlMapConfigName - The name of the SqlMapConfig XML file loaded on the 
	// 	server side.
	//
	JBati.Client.SqlMapClient = function(sqlMapConfigName) {
	  this.sqlMapConfigName = sqlMapConfigName;	
	};

	JBati.Client.SqlMapClient.prototype = {

		// method: insert	
		// Executes a mapped SQL INSERT statement. The parameter object is generally 
		// used to supply the input data for the INSERT values as well as the WHERE 
		// clause parameter(s).
		//
		// Parameters:
		// 	statementId - The name of the SQL statement.
		// 	parameterObject  - The object that provides parameters for the SQL statement.
		//
		insert: function(statementId, parameterObject) {
	  	return __jbati_proxy(this.sqlMapConfigName, 'insert', statementId, parameterObject);
		},

		// method: insertAsync
		// Executes a mapped SQL INSERT statement asynchronously. The parameter object is generally 
		// used to supply the input data for the INSERT values as well as the WHERE 
		// clause parameter(s).
		//
		// Parameters:
		// 	statementId - The name of the SQL statement.
		// 	parameterObject  - The object that provides parameters for the SQL statement.
		//
		insertAsync: function(callback, statementId, parameterObject) {
		  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'insert', statementId, parameterObject);
		},
	
		// method: queryForObject
		// Executes a mapped SQL SELECT statement that returns data to populate a 
		// single object instance. The parameter object is generally 
		// used to supply the input data for the WHERE clause parameter(s).
		//
		// Parameters:
		// 	statementId - The name of the SQL statement.
		// 	parameterObject - The object that provides parameters for the SQL statement.
		//
		// Returns:
		// 	A single object populated by the result set.
		//
		queryForObject: function(statementId, parameterObject) {
		  return __jbati_proxy(this.sqlMapConfigName, 'queryForObject', statementId, parameterObject);
		},
	
		// method: queryForObjectAsync
		// Executes a mapped SQL SELECT statement asynchronously that returns data to populate a 
		// single object instance. The parameter object is generally 
		// used to supply the input data for the WHERE clause parameter(s).
		//
		// Parameters:
		// 	statementId - The name of the SQL statement.
		// 	parameterObject - The object that provides parameters for the SQL statement.
		//
		// Returns:
		// 	A single object populated by the result set.
		//
		queryForObjectAsync: function(callback, statementId, parameterObject) {
		  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'queryForObject', statementId, parameterObject);
		},

		// method: update
		// Executes a mapped SQL UPADTE statement.
		// The parameter object is generally used to supply the input data for the 
		// UPDATE values as well as the  WHERE clause parameter(s).
		//
		// Parameters:
		// 	statementId - The name of the SQL statement
		// 	parameterObject - The object that provides parameters for the SQL statement.
		//
		update: function(statementId, parameterObject) {
		  return __jbati_proxy(this.sqlMapConfigName, 'update', statementId, parameterObject);
		},
	
		// method: updateAsync
		// Executes a mapped SQL UPADTE statement asynchronously.
		// The parameter object is generally used to supply the input data for the 
		// UPDATE values as well as the  WHERE clause parameter(s).
		//
		// Parameters:
		// 	statementId - The name of the SQL statement
		// 	parameterObject - The object that provides parameters for the SQL statement.
		//
		updateAsync: function(callback, statementId, parameterObject) {
		  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'update', statementId, parameterObject);
		},
	
		// method: remove
		// Executes a mapped SQL DELETE statement.
		// The parameter object is generally used to supply the input data for the 
		// WHERE clause parameter(s).  This method is named remove instead of 
		// delete since delete is a javascript keyword.
		// 
		// Parameters:
		// 	statementId - The name of the SQL statement
		// 	parameterObject - The object that provides parameters for the SQL statement.
		//
		remove: function(statementId, parameterObject) {
		  return __jbati_proxy(this.sqlMapConfigName, 'remove', statementId, parameterObject);
		},
	
		// method: removeAsync
		// Executes a mapped SQL DELETE statement asynchronously.
		// The parameter object is generally used to supply the input data for the 
		// WHERE clause parameter(s).  This method is named remove instead of 
		// delete since delete is a javascript keyword.
		// 
		// Parameters:
		// 	statementId - The name of the SQL statement
		// 	parameterObject - The object that provides parameters for the SQL statement.
		//
		removeAsync: function(callback, statementId, parameterObject) {
		  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'remove', statementId, parameterObject);
		}
	};

})();	


// section: Globals
// These objects are exported into the browser global namespace.
//
// function: __jbati_proxy
// Used by jBati for server callbacks.
//
//
// variable: JBati
// Provides the jBati namespace.
//
