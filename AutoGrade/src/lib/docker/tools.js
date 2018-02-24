const child_process = require('child_process');
var Docker = require('dockerode');

class Tools {

    constructor() {
        this.docker = new Docker({socketPath: '/var/run/docker.sock'});
    }

    async getContainerIp(name) {
        var container = this.docker.getContainer(name);
        let data = await container.inspect();
        return data.NetworkSettings.IPAddress;
    }

    async run(name)
    {
        //this.docker.run(testImage, ['bash', '-c', 'uname -a'], process.stdout)
        //child_process.execSync(`docker run --name ${hw.id}-${host} -d -it phusion/passenger-full:latest /bin/bash`);
    }

}

// Export factory class
module.exports = Tools;