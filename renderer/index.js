const activateBtn = document.getElementById('activate-btn');
activateBtn.addEventListener('click', () => {
  actions.downloadBleachbit();
  actions.downloadClamAV();
  actions.onProgress();
});