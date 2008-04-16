//
// Test cases for jBati.Server.SqlMapClient
//

JBati.Server.log.info('testSqlMapClient');

(function() {

	// namespace for this test case
	JBati.tsmClient = {};
	
	// DDL
	JBati.tsmClient.dropTable = 'drop table if exists jbati_test_person';
	JBati.tsmClient.createTable = 
		'create table if not exists jbati_test_person (  ' + 
		'	per_id 			integer,  ' + 
		'	per_first_name 	varchar(20),  ' + 
		'	per_last_name 	varchar(20),  ' + 
		'	per_birth_date 	datetime,  ' + 
		'	per_weight_kg 	decimal(5,2),  ' + 
		'	per_height_m		decimal(5,2),  ' + 
		'	constraint person_pk primary key(per_id))'; 

	// DML
	JBati.tsmClient.insertStmt = 
		'insert into jbati_test_person (' +
		'	per_id, per_first_name, per_last_name, per_birth_date, per_weight_kg, per_height_m) ' +
		'values (?, ?, ?, ?, ?, ?)';
	
	JBati.tsmClient.insertParams = [
		[1, 'bob', 'jones', new Date(), 80, 1.2],
		[101, 'sue', 'jones', new Date(1963, 10, 20, 14, 52, 59), 90, 1.1],
		[202, 'Wyatt', 'Frager', new Date(1978, 4, 5), 100, .9],
		[407, 'Erl', 'Only', new Date(1991, 3, 5), 70, .78],
		[678, 'Orley', 'Bobbin', new Date(1927, 2, 28), 670, 2.1]
	];

	// files
	JBati.tsmClient.testDir = Jaxer.Dir.resolvePath(Jaxer.Dir.combine(
		Jaxer.System.tempFolder, 'testing123/jbati/'
	));
	JBati.tsmClient.sqlMapConfig = Jaxer.Dir.resolvePath(Jaxer.Dir.combine(
		JBati.tsmClient.testDir, 'sqlMapConfig.xml'
	));
	JBati.tsmClient.sqlMapConfigUrl = Jaxer.Dir.pathToUrl(
		JBati.tsmClient.sqlMapConfig
	);
	JBati.tsmClient.person = Jaxer.Dir.resolvePath(Jaxer.Dir.combine(
		JBati.tsmClient.testDir, 'person.xml'
	));
	
	// user domain objects
	if(typeof Examples == 'undefined') {Examples = {};}
	Examples.Domain = {};
	Examples.Domain.Person = function () {}
	
})();


function setUp_SqlMapClient() {
	JBati.Server.log.info('setUp_SqlMapClient');

	// DB
	Jaxer.DB.execute(JBati.tsmClient.dropTable);	
	Jaxer.DB.execute(JBati.tsmClient.createTable);	
	for each (var bindParams in JBati.tsmClient.insertParams) {
		Jaxer.DB.execute(JBati.tsmClient.insertStmt, bindParams);
	}
	
	// ORM Mapping

	// create working directory
	var testDir = new Jaxer.Dir(JBati.tsmClient.testDir);
	createIfNotExists(testDir);
	
	// create sqlMapConfig1
	var testConfig = new Jaxer.File(JBati.tsmClient.sqlMapConfig);
	createIfNotExists(testConfig);
	testConfig.truncate();
	testConfig.open('w');
	testConfig.write(
		'<?xml version="1.0" encoding="UTF-8" ?>\n' +
		'<!DOCTYPE sqlMapConfig PUBLIC "-//ibatis.apache.org//DTD SQL Map Config 2.0//EN" "http://ibatis.apache.org/dtd/sql-map-config-2.dtd">\n' +
		'<sqlMapConfig>\n' +
		'	<sqlMap resource="person.xml" />\n' +
		'</sqlMapConfig>\n' +
		'\n'
	);
	testConfig.close();


	// create person1.xml
	var testMap = new Jaxer.File(JBati.tsmClient.person);
	createIfNotExists(testMap);
	testMap.truncate();
	testMap.open('w');
	testMap.write(
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
		'		FROM jbati_test_person \n'+
		'		WHERE PER_ID = #value#\n'+
		'	</select>\n'+
		'\n'+
		'	<select id="getPersonByLastName" resultClass="Examples.Domain.Person">\n'+
		'		SELECT \n'+
		'		PER_ID 			as id,\n'+
		'		PER_FIRST_NAME 	as firstName,\n'+
		'		PER_LAST_NAME 	as lastName,\n'+
		'		PER_BIRTH_DATE 	as birthDate,\n'+
		'		PER_WEIGHT_KG 	as weightInKilograms,\n'+
		'		PER_HEIGHT_M		as heightInMeters\n'+
		'		FROM jbati_test_person \n'+
		'		WHERE PER_ID = #lastName#\n'+
		'	</select>\n'+
		'	\n'+
		'	<select id="getObjectForPerson" resultClass="Object">\n'+
		'		SELECT \n'+
		'		PER_ID 			as id,\n'+
		'		PER_FIRST_NAME 	as firstName,\n'+
		'		PER_LAST_NAME 	as lastName,\n'+
		'		PER_BIRTH_DATE 	as birthDate,\n'+
		'		PER_WEIGHT_KG 	as weightInKilograms,\n'+
		'		PER_HEIGHT_M		as heightInMeters\n'+
		'		FROM jbati_test_person \n'+
		'		WHERE PER_ID = #value#\n'+
		'	</select>\n'+
		'	\n'+
		'	<insert id="insertPerson">\n'+
		'		INSERT INTO jbati_test_person (\n'+
		'			PER_ID, PER_FIRST_NAME, PER_LAST_NAME, \n'+
		'			PER_BIRTH_DATE, PER_WEIGHT_KG, PER_HEIGHT_M\n'+
		'		) VALUES (\n'+
		'			#id#, #firstName#, #lastName#, \n'+
		'			#birthDate#, #weightInKilograms#, #heightInMeters#\n'+
		'		)\n'+
		'	</insert>\n'+
		'	\n'+
		'	<update id="updatePerson">\n'+
		'		UPDATE jbati_test_person\n'+
		'		SET PER_FIRST_NAME = #firstName#, \n'+
		'		PER_LAST_NAME = #lastName#, \n'+
		'		PER_BIRTH_DATE = #birthDate#, \n'+
		'		PER_WEIGHT_KG = #weightInKilograms#, \n'+
		'		PER_HEIGHT_M = #heightInMeters#\n'+
		'		WHERE PER_ID = #id#\n'+
		'	</update>\n'+
		'	\n'+
		'	<delete id="deletePerson">\n'+
		'		DELETE FROM jbati_test_person \n'+
		'		WHERE PER_ID = #id#\n'+
		'	</delete>\n'+
		'\n'+
		'</sqlMap>\n'+
		'\n'
	);
	testMap.close();
	
}
setUp_SqlMapClient.proxy = true;


function tearDown_SqlMapClient() {
	JBati.Server.log.info('tearDown_SqlMapClient');
	Jaxer.DB.execute(JBati.tsmClient.dropTable);	

	removeIfExists(new Jaxer.File(JBati.tsmClient.sqlMapConfig));
	removeIfExists(new Jaxer.File(JBati.tsmClient.person));
	removeIfExists(new Jaxer.Dir(JBati.tsmClient.testDir));
}
tearDown_SqlMapClient.proxy = true;


function removeIfExists(fileOrDir) {
	JBati.Server.log.debug('removeIfExists: ' + fileOrDir.getPath());
	if(fileOrDir.exists()) fileOrDir.remove();
}


function createIfNotExists(fileOrDir) {
	JBati.Server.log.debug('createIfNotExists: ' + fileOrDir.getPath());
	if(!fileOrDir.exists()) fileOrDir.create();
}


//
// QueryForObject
//
function testQueryForObject_SqlMapClient() {

	var client = new JBati.Server.SqlMapClientBuilder.buildSqlMapClient(
		JBati.tsmClient.sqlMapConfigUrl);
		
	// query with scalar parameter
	var person1 = client.queryForObject('getPerson', 1);
	assertEquals(person1.id, 1, 'Person1 id should be 1');

	/* TODO: make array of scalars work
	var person2 = client.queryForObject('getPerson', [1]);
	assertEquals(person2.id, 1, 'Person id should be 1');
	*/
	
	// query with named parameter value
	var person3 = client.queryForObject('getPerson', {value: 678});
	assertEquals(person3.id, 678	, 'Person3 id should be 1');

	// query that selects no records
	try {
		var person4	= client.queryForObject('getPerson', 22);
		fail('Should have failed for no rows returned');
	} catch (e) {
		;
	}
	
	// query that selects more that one record
	try {
		var person5	= client.queryForObject('getPersonByLastName', 'jones');
		fail('Should have failed for more than one row returned');
	} catch (e) {
		;
	}

	// query with wrong parameter name
	try {
		var person6	= client.queryForObject('getPerson', {notParam: 678});
		fail('Should have failed for miss-named parameter');
	} catch (e) {
		;
	}
	
	// query that populates an Object
	/* TODO - make this work
	var person7 = client.queryForObject('getPerson', 1);
	assertEquals(person1.id, 1, 'Person7 id should be 1');	
	*/
		
}
testQueryForObject_SqlMapClient.proxy = true;




(function () {
	JBati.Test.SqlMapClient = [
		testQueryForObject_SqlMapClient.name
	];
	JBati.Server.log.info('Loaded JBati.Test.SqlMapClient: ' +
		JBati.Test.SqlMapClient);
})();


