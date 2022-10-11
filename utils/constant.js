const params = {
    DISK: 'E:',
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
    BLEACHBIT_INSTALL : 'BleachBit-4.4.1-setup-English.exe /S /NoDesktopShortcut /currentuser'
}

module.exports = {params, cmd};