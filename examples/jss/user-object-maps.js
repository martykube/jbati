//
// User sqlMap
//

(function () {

	var path = Jaxer.Dir.resolvePath('../jss/sqlMapConfig.xml');
	var url = Jaxer.Dir.pathToUrl(path);
	JBati.Server.SqlMapClientBuilder.buildSqlMapClient(url, 'ExamplesJSS');

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
