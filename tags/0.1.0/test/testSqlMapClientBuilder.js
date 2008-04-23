//
// Test cases for jBati.Server.SqlMapClientBuilder
//

JBati.Server.log.info('testSqlMapClientBuilder');

(function () {
	JBati.tsmcb = {};
	JBati.tsmcb.testDir = Jaxer.Dir.combine(Jaxer.System.tempFolder, 'jbati');
	JBati.tsmcb.sqlMapConfig = Jaxer.Dir.combine(JBati.tsmcb.testDir, 'sqlMapConfig.xml');
	JBati.tsmcb.person = Jaxer.Dir.combine(JBati.tsmcb.testDir, 'person.xml');
		
})();

function setUp_SqlMapClientBuilder() {
	JBati.Server.log.info('setUp_SqlMapConfig');
	
	// create working directory
	var td = new Jaxer.Dir(JBati.tsmcb.testDir);
	JBati.Server.log.info('setUp_SqlMapConfig');
	createIfNotExists(td);
	JBati.Server.log.info('JBati.tsmcb.sqlMapConfig: ' + JBati.tsmcb.sqlMapConfig);
	
	// create sqlMapConfig
	var tf = new Jaxer.File(JBati.tsmcb.sqlMapConfig);
	JBati.Server.log.info('setUp_SqlMapConfig');
	createIfNotExists(tf);
	tf.truncate();
	tf.open('w');
	tf.write(
		'<?xml version="1.0" encoding="UTF-8" ?>\n' +
		'<!DOCTYPE sqlMapConfig PUBLIC "-//ibatis.apache.org//DTD SQL Map Config 2.0//EN" "http://ibatis.apache.org/dtd/sql-map-config-2.dtd">\n' +
		'<sqlMapConfig>\n' +
		'	<sqlMap resource="person.xml" />\n' +
		'</sqlMapConfig>\n' +
		'\n'
	);
	tf.close();
	

	// create person.xml
	var tf = new Jaxer.File(JBati.tsmcb.person);
	createIfNotExists(tf);
	tf.truncate();
	tf.open('w');
	tf.write(
		'<?XML VERSION="1.0" ENCODING="UTF-8" ?>\n'+
		'\n'+
		'<!DOCTYPE sqlMap \n'+
		'	PUBLIC "-//ibatis.apache.org//DTD SQL Map 2.0//EN"\n'+
		'	"http://ibatis.apache.org/dtd/sql-map-2.dtd">\n'+
		'\n'+
		'<sqlMap namespace="Person">\n'+
		'\n'+
		'	<select id="selectPerson" resultClass="Examples.Domain.Person">\n'+
		'		SELECT \n'+
		'		PER_ID 			as id,\n'+
		'		PER_FIRST_NAME 	as firstName,\n'+
		'		PER_LAST_NAME 	as lastName,\n'+
		'		PER_BIRTH_DATE 	as birthDate,\n'+
		'		PER_WEIGHT_KG 	as weightInKilograms,\n'+
		'		PER_HEIGHT_M		as heightInMeters\n'+
		'		FROM person \n'+
		'		WHERE PER_ID = #value#\n'+
		'	</select>\n'+
		'	\n'+
		'</sqlMap>\n'+
		'\n'
	);
	tf.close();

}
setUp_SqlMapClientBuilder.proxy = true;

function tearDown_SqlMapClientBuilder() {
	JBati.Server.log.info('tearDown_SqlMapConfig');
	removeIfExists(new Jaxer.File(JBati.tsmcb.sqlMapConfig));
	removeIfExists(new Jaxer.File(JBati.tsmcb.person));
	removeIfExists(new Jaxer.Dir(JBati.tsmcb.testDir));
}
tearDown_SqlMapClientBuilder.proxy = true;

//
// test creation of SqlMapClients
//
function testBuildSqlMapClient_SqlMapClientBuilder() {
  
	JBati.Server.log.info('testBuildSqlMapClient_SqlMapClientBuilder');

	var url =  Jaxer.Dir.pathToUrl(JBati.tsmcb.sqlMapConfig);
  var client = JBati.Server.SqlMapClientBuilder.buildSqlMapClient(url);
  	
	assertTrue(client.sqlMapConfig.xml.sqlMap.length() == 1, 
		'Client should have a sqlMapConfig on sqlMap');

  var namedClient = JBati.Server.SqlMapClientBuilder.buildSqlMapClient(url, 'aname');
 
	assertTrue(namedClient.sqlMapConfig.xml.sqlMap.length() == 1, 
		'Client should have a sqlMapConfig on sqlMap');

}
testBuildSqlMapClient_SqlMapClientBuilder.proxy = true;

// test fetch of existing SqlMapClients
function testGetSqlMapClient_SqlMapClientBuilder() {

	JBati.Server.log.info('testGetSqlMapClient_SqlMapClientBuilder');

	var url =  Jaxer.Dir.pathToUrl(JBati.tsmcb.sqlMapConfig);
  var client = JBati.Server.SqlMapClientBuilder.buildSqlMapClient(url);

	assertEquals(
		JBati.Server.SqlMapClientBuilder.getSqlMapClient(),
		client,
		'Should return the same default client');
	var theName = 'foo-bar';
  var namedClient = JBati.Server.SqlMapClientBuilder.buildSqlMapClient(url, theName);

	assertEquals(
		JBati.Server.SqlMapClientBuilder.getSqlMapClient(theName),
		namedClient,
		'Should return the same named client');
}
testGetSqlMapClient_SqlMapClientBuilder.proxy = true;
	
(function () {
	JBati.Test.SqlMapClientBuilder = [
		testBuildSqlMapClient_SqlMapClientBuilder.name,
		testGetSqlMapClient_SqlMapClientBuilder.name
	];
	JBati.Server.log.info('Loaded JBati.Test.SqlMapClientBuilder: ' +
		JBati.Test.SqlMapClientBuilder);
})();

