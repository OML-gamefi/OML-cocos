@cd /d %~dp0
@for %%i in (..\*.xlsx) do @(
xls2json_new -i=%%i -o=..\jsonserver\
)
copy ..\jsonserver ..\..\..\assets\resources\res\Config /y
copy ..\jsonserver ..\..\..\..\02_server\data\php\game_server\src\json /y
pause
