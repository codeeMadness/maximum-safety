class Logging {
    constructor() {}

    static warning(message) {
        console.log("[WARNING] " + message);
    }

    static info(message) {
        console.log("[INFO] " + message);
    }

    static success(message) {
        console.log("[SUCCESS] " + message);
    }

    static error(message) {
        console.log("[ERROR] occured " + message);
    }
}

module.exports = Logging;