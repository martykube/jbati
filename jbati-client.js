/***********************************************************************  
 *  jBati JavaScript ORM Framework, version 0.?.?
 *  (c) 2008 Marty Kube <martykube@yahoo.com>
 *
 *  jBati is freely distributable under the terms of the GPL V2 license.
 *  For details, see the JBati web site: http://code.google.com/p/JBati
 *
 /**********************************************************************/


/**
 * @fileoverview
 * The jBati client side (browser) implementation.<br/>
 * jBati uses the global variable JBati for it's namespace.
 * @author Marty Kube - martykube@yahoo.com
 * @version 0.?.?
 */

(function() {

	if(typeof JBati == 'undefined') { 
	  /** Global object used as the jBati namespace. */
	   JBati = {}; 
	}
	
	
	if(typeof JBati.Client == 'undefined') { 
	  /** 
	   * The jBati namespace for the Client (browser) API. 
	   * @class
	   */
	  JBati.Client = {}; 
	}

})();


/**
 * SqlMapClient provides the jBati API for use in a browser.<br/>
 * 
 * Typical methods use the jBati proxy functions to invoke a server side SQL operation.
 * Most methods have two versions, the first performs a blocking call and the second version
 * (for which the function name is post-fixed with 'Async') performs an asynchronous call.
 * @param sqlMapConfigName Name of the SqlMapConfig data that the new client will use.
 * @constructor
 */
JBati.Client.SqlMapClient = function(sqlMapConfigName) {

  /** Name of the SqlMapConfig for this client */
  this.sqlMapConfigName = sqlMapConfigName;	
};

/**
 * Executes a mapped SQL INSERT statement.<br/>
 * The parameter object is generally used to supply the input data for the INSERT values as 
 * well as the WHERE clause parameter(s).
 * @param {String} statementId The name of the SQL statement.
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns Nothing.
 */
JBati.Client.SqlMapClient.prototype.insert = function(statementId, parameterObject) {
  return __jbati_proxy(this.sqlMapConfigName, 'insert', statementId, parameterObject);
};

/**
 * Executes a mapped SQL INSERT statement asynchronously.<br/>
 * The parameter object is generally used to supply the input data for the INSERT values as 
 * well as the WHERE clause parameter(s).
 * @param {String} statementId The name of the SQL statement.
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns Nothing.
 */
JBati.Client.SqlMapClient.prototype.insertAsync = function(callback, statementId, parameterObject) {
  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'insert', statementId, parameterObject);
};

/**
 * Executes a mapped SQL SELECT statement that returns data to populate a single object instance.<br/>
 * The parameter object is generally used to supply the input data for the WHERE clause parameter(s).
 * @param {String} statementId The name of the SQL statement.
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns A single object populated by the result set.
 */
JBati.Client.SqlMapClient.prototype.queryForObject = function(statementId, parameterObject) {
  return __jbati_proxy(this.sqlMapConfigName, 'queryForObject', statementId, parameterObject);
};

/**
 * Executes a mapped SQL SELECT statement that returns data to populate a single object instance 
 * asynchronously.<br/>
 * The parameter object is generally used to supply the input data for the WHERE clause parameter(s).
 * @param {String} statementId The name of the SQL statement
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns A single object populated by the result set.
 */
JBati.Client.SqlMapClient.prototype.queryForObjectAsync = function(callback, statementId, parameterObject) {
  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'queryForObject', statementId, parameterObject);
};


/**
 * Executes a mapped SQL UPADTE statement.<br/>
 * The parameter object is generally used to supply the input data for the UPDATE values as well as the 
 * WHERE clause parameter(s).
 * @param {String} statementId The name of the SQL statement
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns Nothing.
 */
JBati.Client.SqlMapClient.prototype.update = function(statementId, parameterObject) {
  return __jbati_proxy(this.sqlMapConfigName, 'update', statementId, parameterObject);
};

/**
 * Executes a mapped SQL UPADTE statement asynchronously.<br/>
 * The parameter object is generally used to supply the input data for the UPDATE values as well as the 
 * WHERE clause parameter(s).
 * @param {String} statementId The name of the SQL statement
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns Nothing.
 */
JBati.Client.SqlMapClient.prototype.updateAsync = function(callback, statementId, parameterObject) {
  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'update', statementId, parameterObject);
};


/**
 * Executes a mapped SQL DELETE statement.<br/>
 * The parameter object is generally used to supply the input data for the WHERE clause parameter(s).<br/>
 * This method is named remaove instead of delete since delete is a javascript keyword 
 * (which must be the reason for IE objecting to on object.delete).
 * @param {String} statementId The name of the SQL statement
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns Nothing.
 */
JBati.Client.SqlMapClient.prototype.remove = function(statementId, parameterObject) {
  return __jbati_proxy(this.sqlMapConfigName, 'remove', statementId, parameterObject);
};

/**
 * Executes a mapped SQL DELETE statement asynchronously.<br/>
 * The parameter object is generally used to supply the input data for the WHERE clause parameter(s).<br/>
 * This method is named remaove instead of delete since delete is a javascript keyword 
 * (which must be the reason for IE objecting to on object.delete).
 * @param {String} statementId The name of the SQL statement
 * @params {Object} parameterObject The object that provides parameters for the SQL statement.
 * @returns Nothing.
 */
JBati.Client.SqlMapClient.prototype.removeAsync = function(callback, statementId, parameterObject) {
  return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'remove', statementId, parameterObject);
};



