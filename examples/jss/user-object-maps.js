//
//
// User sqlMap and jBati client
//

(function () {

	if(typeof Examples == 'undefined') {
		Examples = {};
	}
	
	//
	// User client for jBati built from sqlMap
	//
	Examples.jbatiClient = new JBati.Server.SqlMapClient ( 
	
	<sqlMapConfig>
		<sqlMap namespace="Person">
		
			<!-- Use scalar type as parameter and allow results to
			be auto-mapped results to Person object -->
			<select id="getPerson" resultClass="Examples.Domain.Person">
				SELECT 
				PER_ID 			as id,
				PER_FIRST_NAME 	as firstName,
				PER_LAST_NAME 	as lastName,
				PER_BIRTH_DATE 	as birthDate,
				PER_WEIGHT_KG 	as weightInKilograms,
				PER_HEIGHT_M		as heightInMeters
				FROM person 
				WHERE PER_ID = #value#
			</select>
			
			<!-- Use Person object properties as parameters for insert.  Each of the
			parameters in the #hash# symbols is a Person property.  -->
			<insert id="insertPerson">
				INSERT INTO person (
					PER_ID, PER_FIRST_NAME, PER_LAST_NAME, 
					PER_BIRTH_DATE, PER_WEIGHT_KG, PER_HEIGHT_M
				) VALUES (
					#id#, #firstName#, #lastName#, 
					#birthDate#, #weightInKilograms#, #heightInMeters#
				)
			</insert>
			
			<!-- Use Person object properties as parameters for update. Each of the
			parameters in the #hash# symbols is a Person property.  -->
			<update id="updatePerson">
				UPDATE person
				SET PER_FIRST_NAME = #firstName#, 
				PER_LAST_NAME = #lastName#, 
				PER_BIRTH_DATE = #birthDate#, 
				PER_WEIGHT_KG = #weightInKilograms#, 
				PER_HEIGHT_M = #heightInMeters#
				WHERE PER_ID = #id#
			</update>
			
			<!-- Use Person object "id" properties as parameters for delete. Each of the
			parameters in the #hash# symbols is a JavaBeans property.  -->
			<delete id="deletePerson">
				DELETE FROM person 
				WHERE PER_ID = #id#
			</delete>
		
		</sqlMap>
	</sqlMapConfig>
	
	);
	
})();

/* DDL for person
create table if not exists person (  
	per_id 			integer,  
	per_first_name 	varchar(20),  
	per_last_name 	varchar(20),  
	per_birth_date 	datetime,  
	per_weight_kg 	decimal(5,2),  
	per_height_m		decimal(5,2),  
	constraint person_pk primary key(per_id));
*/
