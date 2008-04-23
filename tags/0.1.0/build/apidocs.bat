echo off
setlocal
set NATURAL_DOCS_HOME=\opt\naturaldocs-1.35
set API_DOCS=..\apidocs
mkdir %API_DOCS% 
perl %NATURAL_DOCS_HOME%\NaturalDocs -s Small -o FramedHTML %API_DOCS% -i ..\lib -p .\naturaldocs
endlocal
