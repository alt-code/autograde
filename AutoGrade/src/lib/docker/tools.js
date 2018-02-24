const child_process = require('child_process');

class Tools {

    constructor() {
    }

    async getContainerIp(name) {
        let ip = await child_process.execSync(`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${name}`).toString();
        return ip.trim();
    }
}

// Export factory class
module.exports = Tools;