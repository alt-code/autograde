
const fs            = require('fs-extra');
const path          = require('path');
const child_process = require('child_process');
const stream        = require('stream');
var Docker          = require('dockerode');
const _             = require('lodash');

class Tools {

    constructor() {
        this.docker = new Docker({socketPath: '/var/run/docker.sock'});
    }

    async removeContainers()
    {
        let self = this;
        return new Promise( async function (resolve, reject) 
        {
            let containers = await self.docker.listContainers({all: true});
            for( let containerInfo of containers )
            {
                if( containerInfo.State === 'running' )
                {
                    await self.docker.getContainer(containerInfo.Id).stop();
                }
                await self.docker.getContainer(containerInfo.Id).remove();
                //console.log( containerInfo );
            };
            resolve()
        });
    }

    async pull(imageName)
    {
        let self = this;
        console.log( `pulling ${imageName}`);
        return new Promise((resolve, reject) => {
            self.docker.pull(imageName, (error, stream) => {
                self.docker.modem.followProgress(stream, (error, output) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(output);
                }, (event) => console.log(event));
            });
    })        
    }

    async getContainerIp(name) {
        var container = this.docker.getContainer(name);
        let data = await container.inspect();
        return data.NetworkSettings.IPAddress;
    }

    async clonerepo(hw, hw_path)
    {
        if(!fs.existsSync(hw_path))
            child_process.execSync(`echo "cloning ${hw.repo}" && cd .homeworks && git clone ${hw.repo} ${hw_path}`);
    }

    async playbook(hw_path, autogradeYML)
    {
        child_process.execSync(`cd ${hw_path} && ansible-playbook -i autograder-inventory -u ${autogradeYML.ansible_user} ${autogradeYML.ansible_playbook}`, {stdio:[0,1,2]});
    }

    async run(image, cmd, name)
    {
        //await this.docker.run(image, [cmd], process.stdout, {name: name});
        await this.docker.createContainer({
            name: name, 
            Image: image,
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            Cmd: Array.isArray(cmd) ? cmd: [cmd],
            OpenStdin: false,
            StdinOnce: false,
        }).then(function(container) {
            return container.start();
        });
    }

    async exec(name, cmd)
    {
        let self = this;
        return new Promise(function(resolve,reject)
        {
            var options = {
                Cmd: ['bash', '-c', cmd],
                //Cmd: ['bash', '-c', 'echo test $VAR'],
                //Env: ['VAR=ttslkfjsdalkfj'],
                AttachStdout: true,
                AttachStderr: true
            };
            var container = self.docker.getContainer(name);
            var logStream = new stream.PassThrough();

            var output = "";
            logStream.on('data', function(chunk){
            //console.log(chunk.toString('utf8'));
                output += chunk.toString('utf8');
            });

            container.exec(options, function(err, exec) {
                if (err) return;
                exec.start(function(err, stream) {
                    if (err) return;
            
                    container.modem.demuxStream(stream, logStream, logStream);
                    stream.on('end', function(){
                        logStream.destroy();
                        resolve(output);
                    });
                    
                    // exec.inspect(function(err, data) {
                    //     if (err) return;
                    //     console.log(data);
                    // });
                });
            });
        }); 
    }

}

// Export factory class
module.exports = Tools;