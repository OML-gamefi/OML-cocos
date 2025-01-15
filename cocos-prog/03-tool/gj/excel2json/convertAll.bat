@cd /d %~dp0
@for %%i in (..\*.xlsx) do @(
excel2json.exe -i=%%i -o=..\json\ -t=t
)
pause