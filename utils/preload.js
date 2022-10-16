const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('actions', {
    openQuarantineSummaryWindow: () => ipcRenderer.send('open-quarantine-summary-window'),
    downloadBleachbit: () => ipcRenderer.invoke('download-bleachbit'),
    downloadClamAV: () => ipcRenderer.invoke('download-clamav'),
    onProgress: () => ipcRenderer.on('progress', (e, percentage) => {
        var elem = document.getElementById("activate-bar");
        elem.style.width = percentage + "%";
        if(percentage >= 100) {
            ipcRenderer.send('open-scan-window');
        }
    }),
    cleanSystem: () => ipcRenderer.invoke('clean-system'),
    scanSystem: () => ipcRenderer.invoke('scan-now'),
    featureProgress: () => ipcRenderer.on('feature-progress', (e, message) => {
        if(message.name == 'bleachbit') {
            var elem = document.getElementById("clean-bar");
            elem.style.width = message.percentage + "%";
        }

        if(message.name == 'clamav') {
            var elem = document.getElementById("scan-bar");
            elem.style.width = message.percentage + "%";
        }

    })
})

contextBridge.exposeInMainWorld('infos', {
    latestCleanTime: () => ipcRenderer.on('latest-cleantime', (e, time) => {
        var elem = document.getElementById("clean-information");
        time = time ? time : 'No Clean Yet!';
        console.log("Latest Clean Time: " + time);
        elem.innerHTML = `Last clean date: ${time}`;
    }),
    scanSummary: () => ipcRenderer.on('summary-scan', (e, infecteds) => {
        var elem = document.getElementById("scan-information");
        let infectedsNew = infecteds.filter(i => i.status == 'NEW');
        elem.innerHTML = `Quarantine file New (${infectedsNew.length}) Total (${infecteds.length})`;
        elem.addEventListener('click', () => {
            ipcRenderer.send('open-quarantine-summary-window');
        })
    }),
    summaryTable: () => ipcRenderer.on('summary-table', (e, infecteds) => {
        var tbodyRef = document.getElementById('summary-table').getElementsByTagName('tbody')[0];
        tbodyRef.innerHTML = '';
        infecteds.forEach(i => {
            // Insert a row at the end of table
            var newRow = tbodyRef.insertRow();

            // Insert a cell at the end of the row
            var filenameCell = newRow.insertCell();
            var reasonCell = newRow.insertCell();
            var scandateCell = newRow.insertCell();
            var actionCell = newRow.insertCell();

            // Append a text node to the cell
            filenameCell.innerHTML = i.filename;
            reasonCell.innerHTML = 'Malicious software';
            scandateCell.innerHTML = i.status.length > 0 ? i.scanDate + " (" + i.status + ")" : i.scanDate;

            let bundleBtn = document.createElement('button');
            bundleBtn.innerHTML = 'Burn from system';
            bundleBtn.onclick = () => {
                ipcRenderer.send('bundle-infected-file', i.location);
            }

            let allowBtn = document.createElement('a');
            allowBtn.innerHTML = 'allow on system';
            allowBtn.addEventListener('click', () => {
                ipcRenderer.send('allow-infected-file', i.location);
            })

            actionCell.appendChild(bundleBtn);
            actionCell.appendChild(document.createTextNode(' OR '));
            actionCell.appendChild(allowBtn);
        });
        
    }),
})