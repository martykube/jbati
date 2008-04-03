//
// Test cases to jBatui.ParameterMapper
//

function testIsScalar_ParameterMapper() {
	var pm = new jBati.ParameterMapper();
	assertTrue(pm.isScalar(1), '1 is a scalar');
	assertTrue(pm.isScalar(parseInt('2')), '2 is a scalar');
	assertTrue(pm.isScalar(1.23), '1.23 is a scalar');
	assertTrue(pm.isScalar(new Date()), 'Date is a scalar');
	assertTrue(pm.isScalar('Foo'), 'String is a scalar');
}

function testHasProperty_ParameterMapper() {
	var pm = new jBati.ParameterMapper();
	var o = {};
	assertTrue(!pm.hasProperty('foo', o), 'should not have property foo');
	o.foo = undefined;
	assertTrue(pm.hasProperty('foo', o), 'should have undefined prop foo');
	o.foo = [];
	assertTrue(pm.hasProperty('foo', o), 'should have prop foo');
	delete o.foo;
	assertTrue(!pm.hasProperty('foo', o), 'prop foo should have gone away');
}

function testAddParameter_ParameterMapper () {
	var pm = new jBati.ParameterMapper();
	assertTrue(pm.parameters.length == 0 , 'Should be no params');
	pm.addParameter('value', 1);
	assertTrue(pm.parameters.length == 1, 'Should be 1 params');
	var o = {};
	o.foo = {};
	pm.addParameter('foo', o);
	assertTrue(pm.parameters.length == 2, 'Should be 2 params');
	try {
		pm.addParameter('notAParam', o);
		fail('notAParam is not a property of o');
	} catch (e) {}
}

function testBind_ParameterMapper() {


	var sql = 'select * from t where c1 = #value#';
	var pm = jBati.ParameterMapper.bind(sql, 1);
	assertEquals(pm.sql, 'select * from t where c1 = ?', 'Should replace one token');
	assertEquals(pm.parameters.length, 1, 'Should have one bind param');
	assertEquals(pm.parameters[0], 1, 'Should have 1 as bind param');
	
	sql = 'select * from t where c1 = #fee# and c2 = #foo#';
	pm = jBati.ParameterMapper.bind(sql, 1);
	assertEquals(pm.sql, 'select * from t where c1 = ? and c2 = ?', 
		'Should replace two tokens');
	assertEquals(pm.parameters.length, 2, 'Should have two bind params');
	assertEquals(pm.parameters, [1, 1], 'Should have 1, 1 as bind params');
	
	var d = new Date();
	var o = {foo: 1, bar: d, baz: 'Yo!'};
	sql = 'select * from t where f = #foo# and b = #bar# and z = #baz#';
	pm = jBati.ParameterMapper.bind(sql, o);
	assertEquals(pm.sql, 'select * from t where f = ? and b = ? and z = ?', 
		'Should replace three tokens');
	assertEquals(pm.parameters, [1, d, 'Yo!'], 'Should have 1, d, "Yo!" as parameters');

	try {
		pm = jBati.ParameterMapper.bind('select * from t where f = #foo#', {fee: 1});
		fail('Should have found missing parameter');
	} catch (e) {
		;
	}
} 
