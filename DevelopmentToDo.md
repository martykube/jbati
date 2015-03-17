This is a working document which list development activities which could be done.

  1. release/packaging
    1. template in version/revision numbers into source and documentation
    1. compress js files
    1. convert wiki documentation to HTML and package
    1. scripts for cutting release
    1. update source for MIT license
  1. documentation
    1. get version number API docs
    1. relate menus to files
    1. finish developers guide
    1. fix up svn to put last update date in document
  1. code
    1. SqlMapClient
      1. build out user API
      1. accept list of scalar parameters for binding
      1. queryForList - skip and limit parameters
    1. SqlMapConfig
      1. support multiple DB connections
    1. support for SqlLite
    1. corner that mysql date bug
  1. deployment
    1. make some sort of autoload for client vs. server, and generate required oncallback()'s