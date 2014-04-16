@ECHO OFF
FOR %%F IN (lib\*.jar) DO call :addcp %%F
goto extlibe
:addcp
SET CLASSPATH=%CLASSPATH%;%1
goto :eof
:extlibe
SET CLASSPATH=%CLASSPATH%;bin\
SET CLASSPATH
java -classpath %CLASSPATH% org.vertx.java.platform.impl.cli.Starter run http.ServerBase -conf conf/config.json