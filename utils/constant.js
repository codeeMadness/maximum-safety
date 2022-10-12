const params = {
    DISK: 'E:',
    LOCATION: 'Downloads',
    SLASH: '/',

    BLEACHBIT_INSTALLATION_PATH: 'E:/ProgramFiles/BleachBit',
    CLAMAV_INSTALLATION_PATH: 'E:/ProgramFiles/ClamAV',

    CLAMAV_URL: 'http://www.clamav.net/downloads/production/ClamAV-0.103.7.exe',
    CLAMAV_VERSION: 'ClamAV-0.103.7.exe',

    BLEACHBIT_URL: 'https://sourceforge.net/projects/bleachbit/files/bleachbit/4.4.1/BleachBit-4.4.1-setup-English.exe/download',
    BLEACHBIT_VERSION: 'BleachBit-4.4.1-setup-English.exe',
    
    SCHEDULE_CRON: '0 */6 * * *'
}

const cmd = {
    SLASH: '\\',

    BLEACHBIT_CMD: 'bleachbit_console.exe',

    BLEACHBIT_INSTALL : params.BLEACHBIT_VERSION + ' /S /NoDesktopShortcut /currentuser /D=E:\\ProgramFiles\\BleachBit',
    CLAMAV_INSTALL: params.CLAMAV_VERSION + ' /SP- /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /DIR=E:\\ProgramFiles\\ClamAV',

    ENABLE_UAC: 'ADD HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD /d 1 /f',
    DISABLE_UAC: 'ADD HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD /d 0 /f',

    BLEACHBIT_CLEAN: '-c "windows_explorer.*"'
}

module.exports = {params, cmd};