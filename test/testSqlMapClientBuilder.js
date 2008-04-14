//
// Test cases for jBati.Server.SqlMapClientBuilder
//

JBati.Server.log.info('testSqlMapClientBuilder');

var js = JBati.Server;
var cb = js.SqlMapClientBuilder;

// test creation of SqlMapClients
function testBuildSqlMapClient_SqlMapClientBuilder() {
  
	js.log.info('testBuildSqlMapClient_SqlMapClientBuilder');

	var xml = <sqlMapConfig/>;
  var client = cb.buildSqlMapClient('aName', xml.toXMLString());
  
  assertEquals(
  	client.sqlMapConfig.toXMLString(),  
		xml.toXMLString(), 
		'New aName configuration did not match');

	client = cb.buildSqlMapClient(xml.toXMLString());
  assertEquals(
  	client.sqlMapConfig.toXMLString(),  
  	xml.toXMLString(), 
		'New default configuration did not match');	
}
testBuildSqlMapClient_SqlMapClientBuilder.proxy = true;

// test fetch of existing SqlMapClients
function testGetSqlMapClient_SqlMapClientBuilder() {

	JBati.Server.log.info('testGetSqlMapClient_SqlMapClientBuilder');

	var xml_1 = <sqlMapConfig/>;
  cb.buildSqlMapClient('aName', xml_1.toXMLString());
	var xml_2 = 
		<sqlMapConfig><sqlMap/></sqlMapConfig>;
  cb.buildSqlMapClient(xml_2.toXMLString());
  
  var client = cb.getSqlMapClient('aName');
  assertEquals(
  	client.sqlMapConfig.toXMLString(),  
		xml_1.toXMLString(), 
		'aName configuration did not match');

	client = cb.getSqlMapClient();
  assertEquals(
  	client.sqlMapConfig.toXMLString(),  
		xml_2.toXMLString(), 
		'Default configuration did not match');
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

