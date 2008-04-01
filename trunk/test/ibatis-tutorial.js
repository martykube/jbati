Jaxer.Log.info('Loading ibatis-tutorial.js'); 

/*
 *  Sql map from the iBatis tutorial
 */

if(typeof examples == 'undefined') {
	var examples = {};
	examples.domain = {};
}
examples.domain.Person = function() {};

jBati.SqlMapConfig.addSqlMap(
	{
		namespace: 'examples.domain.Person',
		statements : 
			[
				{ 
					type : 'select',
					id: 'getPerson',
					resultClass: 'examples.domain.Person',
					sql:  
						'SELECT ' +
						'PER_ID 			as id,' +
						'PER_FIRST_NAME 	as firstName,' +
						'PER_LAST_NAME 	as lastName,' +
						'PER_BIRTH_DATE 	as birthDate,' +
						'PER_WEIGHT_KG 	as weightInKilograms,' +
						'PER_HEIGHT_M		as heightInMeters' +
						'	FROM TEST_PERSON' +
						'	WHERE PER_ID = #value#'
				},
				{
					type : 'insert', 
					id: 'insertPerson',
					parameterClass: 'examples.domain.Person',
					sql: 
						'INSERT INTO ' +
						'TEST_PERSON  (PER_ID, PER_FIRST_NAME, PER_LAST_NAME, ' +
						'				PER_BIRTH_DATE, PER_WEIGHT_KG, PER_HEIGHT_M) ' +
						'VALUES (#id#, #firstName#, #lastName#, ' +
						'				#birthDate#, #weightInKilograms#, #heightInMeters#)'
                  											
				},
				{
					type : 'update', 
					id: 'updatePerson',
					parameterClass: 'examples.domain.Person',
					sql: 
						'UPDATE TEST_PERSON ' +
						'SET PER_FIRST_NAME = #firstName#,  ' +
						'    PER_LAST_NAME = #lastName#, PER_BIRTH_DATE = #birthDate#,  ' +
						'    PER_WEIGHT_KG = #weightInKilograms#,  ' +
						'    PER_HEIGHT_M = #heightInMeters# ' +
						'WHERE PER_ID = #id# '
				},
				{
					type : 'delete',
					id: 'deletePerson',
					parameterClass: 'examples.domain.Person',
					sql:  
						'DELETE FROM TEST_PERSON WHERE PER_ID = #id#'
				}
			]
		}
);

Jaxer.Log.info('SqlMapConfig: ' + jBati.toJSON(jBati.SqlMapConfig)); 
