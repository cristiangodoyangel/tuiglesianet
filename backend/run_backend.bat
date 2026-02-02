@echo off
echo Starting TuIglesiaNet Backend...
set JAVA_HOME=C:\Users\weblogica\.jdks\ms-21.0.9
cd api
call mvnw.cmd spring-boot:run
pause
