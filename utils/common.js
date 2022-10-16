'use strict'
const fs = require("fs");
const { location: win_location, params : win_params} = require("./winconstant");

const formatDate = (date) => {
    var dateString =
        date.toDateString() + " " +
        ("0" + date.getUTCHours()).slice(-2) + ":" +
        ("0" + date.getUTCMinutes()).slice(-2) + ":" +
        ("0" + date.getUTCSeconds()).slice(-2);
    return dateString;
}

const copyFile = (origin, target) => {
    target = target.replace("\\", "/");
    fs.copyFile(origin, target, (err) => {
      if (err) {
        writeToFile(location.LOG_LOCATION.concat(win_params.SLASH, "app.log"), `${formatDate(new Date())} [ERROR] ${err}`);
      }
      else 
        writeToFile(win_location.LOG_LOCATION.concat(win_params.SLASH, "app.log"), `${formatDate(new Date())} [SUCCESS] ${origin} was copied to ${target}`);
    });
}

const writeToFile = (path, content) => {
    path = path.replace("\\", "/");
    fs.appendFileSync(path, content.concat("\n"));
}

module.exports = {formatDate, copyFile, writeToFile}