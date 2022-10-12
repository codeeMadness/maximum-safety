class ProgressManager {
    constructor(thread) {
        this.thread = thread;
    }

    updateThread(name, progress) {
        let found = this.thread.find(element => element.name == name);
        if(found) found.progress = progress;
    }

    total() {
        let progress = 0;
        this.thread.forEach(element => {
            progress += element.progress;
        })
        return progress;
    }

    toPercentage() {
        let percentage = this.total()/(this.thread.length * 100) * 100;
        return percentage;
    }
}

module.exports = ProgressManager;