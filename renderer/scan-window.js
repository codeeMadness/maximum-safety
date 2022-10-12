let opts = {};

//====================INIT DATA=================//
infos.latestCleanTime();

let scanSchedule = document.getElementById("scan-schedule");
scanSchedule.addEventListener('click', () => {
    opts.schedule = scanSchedule.checked;
    console.log(opts);
})

let realtimeDetect = document.getElementById("realtime-detection");
realtimeDetect.addEventListener('click', () => {
    opts.realtimeDetect = realtimeDetect.checked;
    console.log(opts);
})

let scanInfo = document.getElementById('scan-information');
scanInfo.addEventListener('click', () => actions.openQuarantineSummaryWindow())

document.getElementById('clean-btn').addEventListener('click', () => {
    actions.cleanSystem();
    actions.featureProgress();
    infos.latestCleanTime();
})

document.getElementById('scan-btn').addEventListener('click', () => {

})