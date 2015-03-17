Last update: 20080408

## Introduction ##

The jBati feature set is closely modeled on [iBATIS](http://ibatis.apache.org).  Therefore, this road map was developed by looking at iBATIS features and deciding what to include.

The current goal is to quickly implement the minimal set of features that makes jBati usable in a meaningful way.  This should allow for a quick release and evaluation of the usefulness of the project.

The iBATIS features are evaluated here for inclusion in jBati V1 with the following questions in mind:

  * Does the feature makes sense for the target platform of JavaScript/Jaxer/MySQL
  * Is the feature _really_ needed to support use, or is the feature a nice to have
  * Which features are most important for basic usage

jBati is composed of two main parts, the first being the user API and the second being the configuration of domain object mapping via SQL maps.  The jBati API will match the iBATIS API in a direct manner.  The jBati API functionality will be matched to the features supported in the sqlMap configuration.

This road map will therefore focus on sqlMap elements.  The goal is to list which elements are applicable and identify the set that will be used for the initial release.

## XML config files ##

The domain object mapping and database connections are specified in XML files.  The current plan is to use E4X and embed the XML in JavaScript code.

## sqlMapConfig ##

The sqlMapConfig element/XML file handles all configuration outside of the actual domain object mapping (sqlMap).

The plan for database connections is to use the Jaxer application connection by default and to also allow multiple connections (via multiple sqlMapClient instances) with connection information specified in sqlMapConfig XML elements.  Likewise, jBati will delegate all transaction semantics to Jaxer.  The following table list the planned support for sqlMapConfig elements.


| **Element** | **Attribute** | **Description** | **Support in V1** | **Priority** | **Comments** |
|:------------|:--------------|:----------------|:------------------|:-------------|:-------------|
| properties | resource | Java properties to load | N |  |  |
| properties | name/value | Set a property | Y | H | Good place to put Jaxer connection properties |
| settings |  |  | N |  | Mostly connection pool parameters |
| resultObjectFactory |  |  | N |  |  |
| typeAlias | Shorten long class names |  | Y | L | A nice to have|
| transactionManager |  |  | N |  | defer to Jaxer txn mangement |
| sqlMap | resource | Include sqlMap XML from a file | Y | L | A nice to have |
| sqlMap | url | Include sqlMap XML from an URL | Y  | L | A nice to have|


## sqlMap ##

The main elements are SQL containers: 

&lt;statement&gt;

, 

&lt;insert&gt;

, 

&lt;update&gt;

, 

&lt;delete&gt;

, 

&lt;select&gt;

, and 

&lt;procedure&gt;

.  The high level functionality supported for SQL containers is:

  * Each SQL container supports a combination of methods (insert, select, etc., which is taken to mean which API methods can be used with the SQL container).  jBati should support the same combinations as iBATIS.
  * The same SQL container/attributes combinations as iBATIS will be supported
  * Procedure support is lower priority
  * Inline SQL parameters are supported for the simple syntax (no types or defaults).  The full syntax is lower priority.
  * Relationships (1:1, 1:M, and M:M) are not supported for V1

Functionality supported for XML elements contained within SQL container elements are:

  * Reuse of SQL fragments via the 

&lt;include&gt;

 tag will not be supported.  Reuse of XML fragment is supported by [E4X variable interpolation](http://rephrase.net/days/07/06/e4x) in XML literals.
  * Auto-generated keys should be supported for MySQL (medium priority)
  * Dynamic Mapped Statements are not supported


Planned support for the attributes of the SQL container elements is listed in the following table:

| **Element** | **Attribute** | **Description** | **Support in V1** | **Priority** | **Comments** |
|:------------|:--------------|:----------------|:------------------|:-------------|:-------------|
| statement | id | Name of SQL | Y | H |  |
| statement | parameterClass| Class whose parameter as bound to SQL | N |  | Not need as JavaScript objects are all Maps |
| statement | resultClass | Class constructed from result set | Y | H |  |
| statement | parameterMap | Detailed mapping from parameter class to SQL parameters| N |  | Use inline parameters only |
| statement | resultMap | Controls mapping from result columns to object properties | ? |  | This is very useful for Java.  No sure it is need for JavaScript |
| statement | cacheModel |  |  N |  |  |
| statement | resultSetType| JDBC parameter |  N |  |  |
| statement | fetchSize | JDBC parameter | N |  |  |
| statement | xmlResultName | Maps result set to XML doc | N |  |  |
| statement | remapResults | Hints about table name substution in SQL | N |  |  |
| statement | timeout | Overrides system default | N |  |  |


### Everything Else is Not Supported ###