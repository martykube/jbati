/*  jBati JavaScript ORM Framework, version 0.0.3
 *  (c) 2008 Marty Kube <martykube@yahoo.com>
 *
 *  jBati is freely distributable under the terms of the GPL V2 license.
 *  For details, see the JBati web site: http://code.google.com/p/JBati
 *
/*--------------------------------------------------------------------------*/

(function() {

	// The jBati global object
	if(typeof JBati == 'undefined') { JBati = {}; }

})();


(function () {

	var Client = {};

	Client.SqlMapClient = function(sqlMapConfigName) {
		this.sqlMapConfigName = sqlMapConfigName;	
	};
		
	// Create
	Client.SqlMapClient.prototype.insert = function(statementId, parameterObject) {
		return __jbati_proxy(this.sqlMapConfigName, 'insert', statementId, parameterObject);
	}

	Client.SqlMapClient.prototype.insertAsync = function(callback, statementId, parameterObject) {
		return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'insert', statementId, parameterObject);
	}

	// Read 
	Client.SqlMapClient.prototype.queryForObject = function(statementId, parameterObject) {
		return __jbati_proxy(this.sqlMapConfigName, 'queryForObject', statementId, parameterObject);
	}
	
	Client.SqlMapClient.prototype.queryForObjectAsync = function(callback, statementId, parameterObject) {
		return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'queryForObject', statementId, parameterObject);
	}
	
	// Update
	Client.SqlMapClient.prototype.update = function(statementId, parameterObject) {
		return __jbati_proxy(this.sqlMapConfigName, 'update', statementId, parameterObject);
	}
	
	Client.SqlMapClient.prototype.updateAsync = function(callback, statementId, parameterObject) {
		return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'update', statementId, parameterObject);
	}
	
	// Delete
	Client.SqlMapClient.prototype.delete = function(statementId, parameterObject) {
		return __jbati_proxy(this.sqlMapConfigName, 'delete', statementId, parameterObject);
	}

	Client.SqlMapClient.prototype.deleteAsync = function(callback, statementId, parameterObject) {
		return __jbati_proxyAsync(callback, this.sqlMapConfigName, 'delete', statementId, parameterObject);
	}

	JBati.Client = Client;

})();