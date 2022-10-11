// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

function move(callback = null) {
  var id = setInterval(() => { 
      let percentage = actions.getProgress();
      if(!percentage) percentage = 0;
      
      console.log("FE: " + percentage);
      setBar(percentage);
      if(percentage >= 100) {
        clearInterval(id);
        if (typeof callback === 'function') callback();
      }
  }, 5000);
}

function setBar(percentage) {
  var elem = document.getElementById("activate-bar");
  elem.style.width = percentage + "%";
}

const activateBtn = document.getElementById('activate-btn');
activateBtn.addEventListener('click', () => {
  actions.downloadBleachbit();
  // actions.downloadClamAV();
  move(() => actions.openScanWindow());
});