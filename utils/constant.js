const params = {
    DISK: 'C:',
    LOCATION: 'Downloads',
    SLASH: '/',

    CLAMAV_URL: 'http://www.clamav.net/downloads/production/ClamAV-0.103.7.exe',
    CLAMAV_VERSION: 'ClamAV-0.103.7.exe',

    BLEACHBIT_URL: 'https://sourceforge.net/projects/bleachbit/files/bleachbit/4.4.1/BleachBit-4.4.1-setup-English.exe/download',
    BLEACHBIT_VERSION: 'BleachBit-4.4.1-setup-English.exe',
    
    SCHEDULE_CRON: '0 */6 * * *'
}

const cmd = {
    SLASH: '\\',
    BLEACHBIT_INSTALL : params.BLEACHBIT_VERSION + ' /S /NoDesktopShortcut /currentuser',
    CLAMAV_INSTALL: params.CLAMAV_VERSION + ' /SP- /VERYSILENT /SUPPRESSMSGBOXES /NORESTART',
    ENABLE_UAC: 'ADD HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD /d 1 /f',
    DISABLE_UAC: 'ADD HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD /d 0 /f'
}

module.exports = {params, cmd};