//
// Load all of the test cases
//

(function () {
  
   JBati.Server.log.info('testSuite.js');
   if(typeof JBati == 'undefined') {JBati = {};}
   JBati.Test = {};
   //Jaxer.load('testParameterMapper.js');
   //Jaxer.load('testSqlMapClientBuilder.js');
   Jaxer.load('testSqlMapConfig.js');
   Jaxer.load('testSqlMap.js');

})();

function getTestCases() {
  return JBati.Test;
}
getTestCases.proxy = true;
