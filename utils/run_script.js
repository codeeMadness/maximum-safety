//Uses node.js process manager
const process = require('process');
const child_process = require('child_process');
const Logging = require('./logging');

// This function will output the lines from the script 
// and will return the full combined output
// as well as exit code when it's done (using the callback).
const run_script = (command, args, opt = null, callback = null) => {
    let running = true;
    let percentage = 0;
    let returnData = '';

    if(opt && opt.progress) {
        var id = setInterval(() => {

            if(running) {
                percentage += 10;
                if(percentage >=90) percentage = 90;
            }
            else {
                percentage = 100;
                clearInterval(id);
            }

            if(opt.window) {
                // console.log('progress inteval ' + percentage);
                opt.window.webContents.send('feature-progress', {name: opt.name, percentage: percentage});
            }
    
        }, 100);
    }

    var child = child_process.spawn(command, args, {
        encoding: 'utf8',
        shell: true
    });
    // You can also use a variable to save the output for when the script closes later
    child.on('error', (error) => {
        Logging.error(error);
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        //Here is the output
        // data=data.toString();   
        Logging.info(data);     
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        // Return some data to the renderer process with the mainprocess-response ID
        // mainWindow.webContents.send('mainprocess-response', data);
        //Here is the output from the command
        returnData = data;
        // Logging.info(data);
    });

    child.on('close', (code) => {
        Logging.info("Code returns " + code);
        //Here you can get the exit code of the script  
        switch (code) {
            case 0:
            case 1:
                running = false;
                Logging.success("End process");
                if (typeof callback === 'function') callback(returnData);
                break;
        }

    });
    
}

const change_dir = (path) => {
    path = path.replace("\\", "/");
    try {
        // Change the directory
        process.chdir(path);
        Logging.success("Directory changed");
    } catch (error) {
        // Printing error if occurs
        Logging.error(error);
    }
}

module.exports = {run_script, change_dir};