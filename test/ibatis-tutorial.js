/*
 *  A sqlMap example shamelessly copied from the iBatis tutorial
 */

if(typeof examples == 'undefined') {
	var examples = {};
	examples.domain = {};
}

// User domain object
examples.domain.Person = function() {};

// User client for jBati ORM
examples.domain.jbatiClient = jBati.buildSqlMapClient ( 

<sqlMapConfig>
	<sqlMap namespace="Person">
	
		<!-- Use scalar type as parameter and allow results to
		be auto-mapped results to Person object (JavaBean) properties -->
		<select id="getPerson" resultClass="examples.domain.Person">
			SELECT 
			PER_ID 			as id,
			PER_FIRST_NAME 	as firstName,
			PER_LAST_NAME 	as lastName,
			PER_BIRTH_DATE 	as birthDate,
			PER_WEIGHT_KG 	as weightInKilograms,
			PER_HEIGHT_M		as heightInMeters
			FROM TEST_PERSON 
			WHERE PER_ID = #value#
		</select>
		
		<!-- Use Person object properties as parameters for insert.  Each of the
		parameters in the #hash# symbols is a Person property.  -->
		<insert id="insertPerson" parameterClass="examples.domain.Person">
			INSERT INTO TEST_PERSON (
				PER_ID, PER_FIRST_NAME, PER_LAST_NAME, 
				PER_BIRTH_DATE, PER_WEIGHT_KG, PER_HEIGHT_M
			) VALUES (
				#id#, #firstName#, #lastName#, 
				#birthDate#, #weightInKilograms#, #heightInMeters#
			)
		</insert>
		
		<!-- Use Person object properties as parameters for update. Each of the
		parameters in the #hash# symbols is a Person property.  -->
		<update id="updatePerson" parameterClass="examples.domain.Person">
			UPDATE TEST_PERSON
			SET PER_FIRST_NAME = #firstName#, 
			PER_LAST_NAME = #lastName#, 
			PER_BIRTH_DATE = #birthDate#, 
			PER_WEIGHT_KG = #weightInKilograms#, 
			PER_HEIGHT_M = #heightInMeters#
			WHERE PER_ID = #id#
		</update>
		
		<!-- Use Person object "id" properties as parameters for delete. Each of the
		parameters in the #hash# symbols is a JavaBeans property.  -->
		<delete id="deletePerson" parameterClass="examples.domain.Person">
			DELETE FROM TEST_PERSON WHERE PER_ID = #id#
		</delete>
	
	</sqlMap>
</sqlMapConfig>

);
