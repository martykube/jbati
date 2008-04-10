//
// Test cases for jBati.Server.SqlMapClientBuilder
//

JBati.Server.log.info('testSqlMapClientBuilder');

var cb = JBati.Server.SqlMapClientBuilder;

function testBuildSqlMapClient_SqlMapClientBuilder() {
  
	JBati.Server.log.info('testBuildSqlMapClient_SqlMapClientBuilder');

  var client = cb.buildSqlMapClient('aName', '<sqlMapConfig/>');
  
  assertEquals(client.config.toXMLString(),  new XML('<sqlMapConfig/>').toXMLString(), 
	      'Configuration did not match');

	client = cb.buildSqlMapClient('<sqlMapConfig/>');
  assertEquals(client.config.toXMLString(),  new XML('<sqlMapConfig/>').toXMLString(), 
	      'Configuration did not match');
	
}
testBuildSqlMapClient_SqlMapClientBuilder.proxy = true;


function testGetSqlMapClient_SqlMapClientBuilder() {

	JBati.Server.log.info('testGetSqlMapClient_SqlMapClientBuilder');

  cb.buildSqlMapClient('aName', '<sqlMapConfig/>');
  var client = cb.getSqlMapClient('aName');
  assertTrue(typeof client != 'undefined', 'Did not fetch client for aName');

  cb.buildSqlMapClient('<sqlMapConfig/>');
	client = cb.getSqlMapClient();
  assertTrue(typeof client != 'undefined', 'Did not fetch default client');

}
testGetSqlMapClient_SqlMapClientBuilder.proxy = true;
	
(function () {
	JBati.Test.SqlMapClientBuilder = [
		testBuildSqlMapClient_SqlMapClientBuilder.name,
		testGetSqlMapClient_SqlMapClientBuilder.name
	];
	JBati.Server.log.info('Loaded JBati.Test.SqlMapClientBuilder: ' +
		JBati.Test.ParameterMapper);
})();

