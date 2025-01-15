@cd /d %~dp0
@for %%i in (..\*.xlsx) do @(
xls2json_new -i=%%i -o=..\jsonserver\
)
pause
