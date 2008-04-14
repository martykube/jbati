//
// Test cases for jBati.Server.SqlMapConfig
//

JBati.Server.log.info('testSqlMapConfig');

var js = JBati.Server;

//
// create from an XML string and check toXMLString
//
function testToXMLString_SqlMapConfig() {
  
	js.log.info('testToXMLString_SqlMapConfig');

	var xml = <sqlMapConfig/>;
	assertEquals(
		new js.SqlMapConfig(xml.toXMLString()).toXMLString(), 
		xml.toXMLString(),
		'SqlMapConfig did not return same xml as constructed with');
}
testToXMLString_SqlMapConfig.proxy = true;

//
// basic create test
//
function testCreate_SqlMapConfig() {

	js.log.info('testCreate_SqlMapConfig');

	var filename = Jaxer.Dir.resolvePath('sqlMapConfig.xml');
	var contents = Jaxer.File.read(filename);   
	var config = new js.SqlMapConfig(contents);
	assertTrue(/<sqlMapConfig>/g.test(config.toXMLString()), 
		'Did not consume XML correctly');
	assertEquals(config.maps.length, 1, 'Should have read person.xml sqlMap');
}
testCreate_SqlMapConfig.proxy = true;

//
// cleaning up XML
//
function testCleanUpXml_SqlMapConfig() {

	var toClean = 
		'<?xml version="1.0" encoding="UTF-8" ?> \n' +
		' \n' +
		'<!DOCTYPE sqlMap  \n' +
		'	PUBLIC "-//ibatis.apache.org//DTD SQL Map 2.0//EN" \n' +
		'	"http://ibatis.apache.org/dtd/sql-map-2.dtd"> \n' +
		' \n' +
		'<RootElement/> 	 \n';
	assertEquals(js.SqlMapConfig.cleanUpXml(toClean, 'RootElement'), '<RootElement/> 	 \n', 
		'CleanUp went poorly');
}
testCleanUpXml_SqlMapConfig.proxy = true;


function testGetStatementById_SqlMapConfig() {
	throw new Error('Under construction');
}
testGetStatementById_SqlMapConfig.proxy = true;

(function () {
	JBati.Test.SqlMapConfig = [
		testToXMLString_SqlMapConfig.name,
		testCreate_SqlMapConfig.name,
		testCleanUpXml_SqlMapConfig.name,
		testGetStatementById_SqlMapConfig.name
	];
	JBati.Server.log.info('Loaded JBati.Test.SqlMapConfig: ' +
		JBati.Test.SqlMapConfig);
})();

