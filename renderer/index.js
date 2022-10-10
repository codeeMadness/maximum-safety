// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

var i = 0;
function move(callback) {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("activate-bar");
        var width = 1;
        var id = setInterval(frame, 10);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
            i = 0;
            callback();
          } else {
            width++;
            elem.style.width = width + "%";
          }
        }
    }
}

function setBar(percentage) {
  var elem = document.getElementById("activate-bar");
  elem.style.width = percentage + "%";
}

const activateBtn = document.getElementById('activate-btn');
activateBtn.addEventListener('click', () => {
    // move(() => actions.openScanWindow());
    actions.downloadBleachbit();
    actions.downloadClamAV();
});