//
// Test cases for jBati.Server.SqlMapConfig
//

JBati.Server.log.info('testSqlMapConfig');

(function () {
	JBati.tsmc = {};
	JBati.tsmc.testDir = Jaxer.Dir.combine(Jaxer.System.tempFolder, 'jbati');
	JBati.tsmc.sqlMapConfig1 = Jaxer.Dir.combine(JBati.tsmc.testDir, 'sqlMapConfig1.xml');
	JBati.tsmc.person1 = Jaxer.Dir.combine(JBati.tsmc.testDir, 'person1.xml');
	
	// relative path test
	JBati.tsmc.subdir = Jaxer.Dir.combine(JBati.tsmc.testDir, 'subdir');
	JBati.tsmc.sqlMapConfig2 = Jaxer.Dir.combine(JBati.tsmc.testDir, 'sqlMapConfig2.xml');
	JBati.tsmc.person2 = Jaxer.Dir.combine(JBati.tsmc.subdir, 'person2.xml');
	
	// more than 1 sqlMap
	JBati.tsmc.sqlMapConfig3 = Jaxer.Dir.combine(JBati.tsmc.testDir, 'sqlMapConfig3.xml');
	
})();

function setUp_SqlMapConfig() {
	JBati.Server.log.info('setUp_SqlMapConfig');
	
	// create working directory
	var td = new Jaxer.Dir(JBati.tsmc.testDir);
	createIfNotExists(td);
	
	// create sqlMapConfig1
	var tf = new Jaxer.File(JBati.tsmc.sqlMapConfig1);
	createIfNotExists(tf);
	tf.truncate();
	tf.open('w');
	tf.write(
		'<?xml version="1.0" encoding="UTF-8" ?>\n' +
		'<!DOCTYPE sqlMapConfig PUBLIC "-//ibatis.apache.org//DTD SQL Map Config 2.0//EN" "http://ibatis.apache.org/dtd/sql-map-config-2.dtd">\n' +
		'<sqlMapConfig>\n' +
		'	<sqlMap resource="person1.xml" />\n' +
		'</sqlMapConfig>\n' +
		'\n'
	);
	tf.close();
	
	// create sqlMapConfig2
	var tf = new Jaxer.File(JBati.tsmc.sqlMapConfig2);
	createIfNotExists(tf);
	tf.truncate();
	tf.open('w');
	tf.write(
		'<?xml version="1.0" encoding="UTF-8" ?>\n' +
		'<!DOCTYPE sqlMapConfig PUBLIC "-//ibatis.apache.org//DTD SQL Map Config 2.0//EN" "http://ibatis.apache.org/dtd/sql-map-config-2.dtd">\n' +
		'<sqlMapConfig>\n' +
		'	<sqlMap resource="subdir/person2.xml" />\n' +
		'</sqlMapConfig>\n' +
		'\n'
	);
	tf.close();

	// create sqlMapConfig3
	var tf = new Jaxer.File(JBati.tsmc.sqlMapConfig3);
	createIfNotExists(tf);
	tf.truncate();
	tf.open('w');
	tf.write(
		'<?xml version="1.0" encoding="UTF-8" ?>\n' +
		'<!DOCTYPE sqlMapConfig PUBLIC "-//ibatis.apache.org//DTD SQL Map Config 2.0//EN" "http://ibatis.apache.org/dtd/sql-map-config-2.dtd">\n' +
		'<sqlMapConfig>\n' +
		'	<sqlMap resource="person1.xml" />\n' +
		'	<sqlMap resource="subdir/person2.xml" />\n' +
		'</sqlMapConfig>\n' +
		'\n'
	);
	tf.close();

	// create person1.xml
	var tf = new Jaxer.File(JBati.tsmc.person1);
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
		'	<select id="getPerson" resultClass="Examples.Domain.Person">\n'+
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
		'	<insert id="insertPerson">\n'+
		'		INSERT INTO person (\n'+
		'			PER_ID, PER_FIRST_NAME, PER_LAST_NAME, \n'+
		'			PER_BIRTH_DATE, PER_WEIGHT_KG, PER_HEIGHT_M\n'+
		'		) VALUES (\n'+
		'			#id#, #firstName#, #lastName#, \n'+
		'			#birthDate#, #weightInKilograms#, #heightInMeters#\n'+
		'		)\n'+
		'	</insert>\n'+
		'	\n'+
		'	<update id="updatePerson">\n'+
		'		UPDATE person\n'+
		'		SET PER_FIRST_NAME = #firstName#, \n'+
		'		PER_LAST_NAME = #lastName#, \n'+
		'		PER_BIRTH_DATE = #birthDate#, \n'+
		'		PER_WEIGHT_KG = #weightInKilograms#, \n'+
		'		PER_HEIGHT_M = #heightInMeters#\n'+
		'		WHERE PER_ID = #id#\n'+
		'	</update>\n'+
		'	\n'+
		'	<delete id="deletePerson">\n'+
		'		DELETE FROM person \n'+
		'		WHERE PER_ID = #id#\n'+
		'	</delete>\n'+
		'\n'+
		'</sqlMap>\n'+
		'\n'
	);
	tf.close();
	
	// create sub dir
	var sd = new Jaxer.Dir(JBati.tsmc.subdir);
	createIfNotExists(sd);

	// create person2.xml
	var tf = new Jaxer.File(JBati.tsmc.person2);
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
setUp_SqlMapConfig.proxy = true;

function tearDown_SqlMapConfig() {
	JBati.Server.log.info('tearDown_SqlMapConfig');

	removeIfExists(new Jaxer.File(JBati.tsmc.person2));
	removeIfExists(new Jaxer.Dir(JBati.tsmc.subdir));
	removeIfExists(new Jaxer.File(JBati.tsmc.sqlMapConfig1));
	removeIfExists(new Jaxer.File(JBati.tsmc.sqlMapConfig2));
	removeIfExists(new Jaxer.File(JBati.tsmc.sqlMapConfig3));
	removeIfExists(new Jaxer.File(JBati.tsmc.person1));
	removeIfExists(new Jaxer.Dir(JBati.tsmc.testDir));
}
tearDown_SqlMapConfig.proxy = true;

//
// Create tests
//
function testCreate_SqlMapConfig() {

	JBati.Server.log.info('testCreate_SqlMapConfig');

	//
	// Basic create case
	//
	var url = Jaxer.Dir.pathToUrl(JBati.tsmc.sqlMapConfig1);
	var sqlMapConfig = new JBati.Server.SqlMapConfig(url);
	
	assertTrue(typeof sqlMapConfig.xml == 'xml', 'Property xml should be an XML object');
	assertTrue(typeof sqlMapConfig.sqlMaps == 'xml', 'Property sqlMaps should be an XML object');
	
	assertEquals(
		sqlMapConfig.baseDir, 
		Jaxer.File.parentPath(JBati.tsmc.sqlMapConfig1),
		'baseDir should be directory from which SqlMapConfig was loaded');

	// Check xml by counting SqlMap references
	assertEquals(
		sqlMapConfig.xml.sqlMap.length(),
		1,
		'Number of refereed to sqlMaps did not agree');

	// Check the number of included SqlMaps should agree to the sqlMapConfig document
	assertEquals(
		sqlMapConfig.sqlMaps.length(), 
		sqlMapConfig.xml.sqlMap.length(), 
		'Number of included SqlMaps did not agree');		
		
	// Check the number of statements in the included sqlMaps
	assertEquals(
		sqlMapConfig.sqlMaps.*.length(),
		4,
		'Number of statements did not agree');
		
	//
	// Relative path in: <sqlMap resource="relative-path">
	//
	var url2 = Jaxer.Dir.pathToUrl(JBati.tsmc.sqlMapConfig2);
	var sqlMapConfig2 = new JBati.Server.SqlMapConfig(url2);

	// Check xml by counting SqlMap references
	assertEquals(
		sqlMapConfig2.xml.sqlMap.length(),
		1,
		'Number of refereed to sqlMaps did not agree');

	// Check the number of included SqlMaps should agree to the sqlMapConfig document
	assertEquals(
		sqlMapConfig2.sqlMaps.length(), 
		sqlMapConfig2.xml.sqlMap.length(), 
		'Number of included SqlMaps did not agree');		
		
	// Check the number of statements in the included sqlMaps
	assertEquals(
		sqlMapConfig2.sqlMaps.*.length(),
		1,
		'Number of statements did not agree');
		
	//
	// More than 1 included sqlMap
	//
	var url3 = Jaxer.Dir.pathToUrl(JBati.tsmc.sqlMapConfig3);
	var sqlMapConfig3 = new JBati.Server.SqlMapConfig(url3);

	// Check xml by counting SqlMap references
	assertEquals(
		sqlMapConfig3.xml.sqlMap.length(),
		2,
		'Number of refereed to sqlMaps did not agree');

	// Check the number of included SqlMaps should agree to the sqlMapConfig document
	assertEquals(
		sqlMapConfig3.sqlMaps.length(), 
		sqlMapConfig3.xml.sqlMap.length(), 
		'Number of included SqlMaps did not agree');		
	
}
testCreate_SqlMapConfig.proxy = true;

//
// Fetching statements
//
function testGetStatementById_SqlMapConfig() {

	var url = Jaxer.Dir.pathToUrl(JBati.tsmc.sqlMapConfig3);
	var sqlMapConfig = new JBati.Server.SqlMapConfig(url);
	
	var statement = sqlMapConfig.getStatementById('getPerson');
	assertTrue(typeof statement == 'xml', 'Statements should be an XML Objects');
	assertTrue(statement.@id == 'getPerson', 'Found the wrong statement');

	statement = sqlMapConfig.getStatementById('selectPerson');
	assertTrue(statement.@id == 'selectPerson', 'Found the wrong statement');

	statement = sqlMapConfig.getStatementById('deletePerson');
	assertTrue(statement.@id == 'deletePerson', 'Found the wrong statement');

	try {
			statement = sqlMapConfig.getStatementById('notAnId');
			throw new Error('Should have raised and exception for not found statement');
	} catch (e) {
			;
	}

}
testGetStatementById_SqlMapConfig.proxy = true;

(function () {
	JBati.Test.SqlMapConfig = [
		testCreate_SqlMapConfig.name,
		testGetStatementById_SqlMapConfig.name
	];
	JBati.Server.log.info('Loaded JBati.Test.SqlMapConfig: ' +
		JBati.Test.SqlMapConfig);
})();

