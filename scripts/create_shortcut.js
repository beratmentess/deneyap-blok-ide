const { execSync } = require('child_process');
const fs = require('fs');

const vbs = `
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "C:\\Users\\Berat Mentes\\Desktop\\Deneyap Blok IDE.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "C:\\Users\\Berat Mentes\\Desktop\\deneyapkart_locale\\release\\win-unpacked\\Deneyap Blok IDE.exe"
oLink.WorkingDirectory = "C:\\Users\\Berat Mentes\\Desktop\\deneyapkart_locale\\release\\win-unpacked"
oLink.Description = "Deneyap Blok IDE"
oLink.Save
`;

fs.writeFileSync('temp_shortcut.vbs', vbs);
execSync('cscript //nologo temp_shortcut.vbs');
fs.unlinkSync('temp_shortcut.vbs');
console.log('Shortcut created successfully on Desktop!');
