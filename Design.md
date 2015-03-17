Last update: 20080408

# Introduction #

The design and architecture of jBati is developed here by considering:
  * User interaction with the framework, which is illustrated by development of two use cases.
  * Platform support provided by the target platform, which is [Jaxer](http://www.aptana.com/jaxer).
  * Configuration required by the end user.

The main driver is ease of use by the framework's client as represented by use cases developed in this document.  The Jaxer architecture places constraints on the implementation, mostly by forcing selection of the context (browser, server, server-proxy, etc.) that sections of JavaScript code run in.  The fact that code can run in several different context and that there is a good sized amount of configuration data (object mapping) suggest that there are many moving parts to configure.  The jBati framework should do everything it can to make the user's configuration task easy.

## Use cases ##

In order for the use cases to make sense, we need to identify the different sections of code and the context in which the code sections execute.

The three main [context](http://www.aptana.com/node/275) in which JavaScript code in a Jaxer application executes are:

  1. Browser
  1. Server
    1. Initial page processing
    1. [Callbacks](http://www.aptana.com/node/224)
  1. Proxied functions (server side functions for which Jaxer generates proxy functions on the client)

The categories of code that are important from the framework design point of view are:

  * Client Application - the consumer of the framework, code that executes within the browser and uses jBati to create an application
  * Client Domain Objects - definition of objects used in the application for which jBati will handle persistence.
  * Client SqlMap - configuration information supplied by the client that specifies SQL statements and the association between Client Domain Objects and SQL statements.
  * jBati API - the functions exposed to the Client Application
  * jBati Core - the internal jBati code that supports the jBati API.

The sections of code are the actors in the following use cases.  The point of the use cases is to identify the context in which each actor operates.  This level of information is sufficient to drive the detailed design/implementation of jBati.

To make the use classes more clear, the following blocks of example code will be used.  The first example is a Client Domain Object:

```
function Person() {}
Person.prototype = {
  id: -1,
  firstName: '',
  lastName: '',
  birthDate: new Date(),
  weightInKilograms: 0,
  heightInMeters: 0
}
```

The domain objects generally need to be available in both the browser and server side context.

The next example is a Client SqlMapConfig which express the mapping of SQL statements to Client Domain Objects (using E4X in this example):

```
var userSqlMap = 
<sqlMap namespace="Person">
	<select id="getPerson" resultClass="examples.domain.Person">
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
</sqlMap>
```

The SqlMapConfig is used only in the Server context and is not exposed in the Browser context.  The final example shows using the jBati API to fetch a Person object with an ID of 1:

```
var client = jBati.getSqlMapClient();
var person = client.queryForObject('getPerson', 1);
```

The function `jBati.getSqlMapClient()` returns an instance of `jbati.SqlMapClient`.  This object corresponds to a database connection and a set of mappings between user objects and SQL.  The jBati API is exposed via this object:
```
jbati.SqlMapClient.prototype = {
  queryForObject: function(statamentID, parameterObject) {
    ...
  }
  insert: function(statementID, parameterObject) {
    ...
  }
  ...
}
```

Where `statementID` identifies the SQL statement to be used and `patrameterObject` is the Client Domain Object to be persisted.

The jBati API can be exposed in both the Browser and Server context, depending on the usage.  This is the key point of the use cases: to illustrate what support the jBati framework will need to provide when the API is exposed in these two different context.

### Client uses jBati supplied proxy - jBati Client Side (JCS) ###

In this use case, the jBati API is exposed in the Browser.

```
<script runat="client">
function showPerson() {
  var client = jBati.getSqlMapClient();
  var person = client.queryForObject('getPerson', 1);
  document.getElementById('person-name').innerHTMML = person.firstName;
}
</script>
```

In this use case, the context for Client Domain Objects and the Client SqlMap is the same (Server only).  The jBati API is exposed in the Browser context and the jBati Core needs to be exposed as Jaxer created proxies to support the jBati API.

The proxy functions will have a fixed set on names and correspond roughly to functions exposed through the jBati API client side object.  It is important to support multiple Client SqlMapsClients, as the the client SqlMapsConfig objects could have different underlying database connections.

Mulitple Client SqlMapClients will be supported by have each jBati SqlMapClient correspond to a user supplied SqlMapConfig.  For example:

```
<script runat="client">
  var client = jBati.getSqlMapClient('defalut');
  var otherDatabaseClient = jBati.getSqlMapClient('config-2');
</script>
```

Each SqlMapClient will hold a reference to it's SqlMapConfig and return that to the server via the proxy call.  In this example, the SqlMapClient method queryForObject:

```
<script runat="client">
jBati.prototype = {
  sqlMapConfig: 'config-2',  // Name the SqlMapConfig for for this SqlMapClient instance
  queryForObject: function(id, parameterObject) {
    return _jbati_proxy_queryForObject(this, id, parameterObject);
  }
}
</script>
```

The jBati Core proxy functions will be exposed in the Browser, so care needs to be taken to avoid name clashes.  The implementation will be along these lines:

```
<script runat="server-proxy">
_jbati_proxy_queryForObject(client, id, parameterObject) {
  var config  = fetchSqlMapConfig(client);
  var sql = config.getSqlStatementById(id);
  sql.bind(parameterObject);
  var resultSet = Jaxer.DB.execute(sql);
  // create user domain object
  var o = objectFromResultSet(resultSet);
  return o;
}
</script>
```

The following tables summarizes the context in which categories of code will execute in:

| Category | Browser | Proxy | Server |
|:---------|:--------|:------|:-------|
| Client Application| X |  |  |
| Client Domain Objects| X |  | X |
| Client SqlMap|  |  | X |
| jBati API | X |  | X |
| jBati Core|  | X | X |

An example of Client Side use of jBati is shown at [examples/jcs](http://code.google.com/p/jbati/source/browse/trunk/examples/jcs/jbati-client-side.html).

### Client builds proxy code - jBati Server Side (JSS) ###

The client designs a set of data access functions, implements them on the server side, and then lets Jaxer build client side proxies.  For example, the client could write a server side function for fetching a Person:

```
<script runat="server-proxy">
function getPerson(id) {
  var client = jBati.getSqlMapClient();
  var person = client.queryForObject('getPerson', 1);
  return person;
}
</script>
```

The Browser code might look like this:

```
<script runat="client">
function showPerson() {
  var person = getPerson(12);
  document.getElementById('person-name').innerHTMML = person.firstName;
}
</script>
```

The domain object(s) need to be available in both the Browser and Server context:

```
<script runat="both">
function Person() {}
Person.prototype = {
  id: -1,
  firstName: '',
  lastName: '',
  birthDate: new Date(),
  weightInKilograms: 0,
  heightInMeters: 0
}
</script>
```

The jBati API is used only on the server.  In all cases, the Client SqlMapConfig and the jBati Core are Server side only objects:

```
<script src="client-object-map.js" runat="server"></script>
<script src="jbati.js" runat="server"></script>
<script src="jbati-core.js" runat="server"></script>
```

The following tables summarizes the context in which categories of code will execute in:

| Category | Browser | Proxy | Server |
|:---------|:--------|:------|:-------|
| Client Application| X | X |  |
| Client Domain Objects| X |  | X |
| Client SqlMap|  |  | X |
| jBati API |  |  | X |
| jBati Core|  |  | X |

An example of Server Side use of jBati is shown at [examples/jss](http://code.google.com/p/jbati/source/browse/trunk/examples/jss/jbati-server-side.html?r=37).

## Configuration ##

The source for Domain object mapping is XML.  There seems to be three routes for loading this information:
  * Embedded in JavaScript with E4X
  * From the filesystem
  * From a URL
The URL option implies that the configuration is available from an HTTP server.  This is undesirable as database connection credentials are part of the configuration information.

The main configuration item that need to be dealt with is reading the SqlMapConfig XML at runtime.  The main complication is setting this up during server callbacks.  The configuration data needs to be reloaded on the server during Jaxer proxy callbacks with the Jaxer oncallback() function.  The user will have to supply some code to make sure the SqlMapConfig elements are loaded.

_200804 - Marty - This portion of the design is not yet complete pending development of some examples_