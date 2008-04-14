//
// Test cases for jBati.Server.SqlMap
//

JBati.Server.log.info('testSqlMap');

var js = JBati.Server;

//
// Read sqlMaps included with resource attribute
//
function testReadAsResource_SqlMap() {

	js.log.info('testCreate_SqlMap');

	// read from an absolute path
	var sqlMap = <sqlMap resource='person.xml'/>;
		
	var config = new js.SqlMap(sqlMap.toXMLString());
	assertEquals(
		config.configReference.toXMLString(), 
		sqlMap.toXMLString(), 
		'Did not readsqlMap reference correctly');
}
testReadAsResource_SqlMap.proxy = true;


(function () {
	JBati.Test.SqlMap = [
		testReadAsResource_SqlMap.name
	];
	JBati.Server.log.info('Loaded JBati.Test.SqlMap: ' +
		JBati.Test.SqlMap);
})();

