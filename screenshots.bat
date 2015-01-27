echo off
cd %~dp0
%~dp0\phantomjs.exe %~dp0\screenshots.js %1
rem %~dp0\TrifleJS.exe %~dp0\screenshots.js %1