const _        = require('lodash');
const Bluebird = require('bluebird');
const fs       = require('fs-extra');
const path     = require('path');
const spawn    = require('child_process').spawn;
const yargs    = require('yargs');
const yaml      = require('js-yaml');

// // Register run command
// yargs.command('grade <repo_url>', 'Grade a repo that has grader.yml', (yargs) => {

//     yargs.positional('repo_url', {
//         describe: 'Repository URL',
//         type: 'string'
//     });

// }, async (argv) => {

//     // Get id and source directory
//     let id = argv.id;
//     console.log( id );
// });


// // Turn on help and access argv
// yargs.help().argv;


const child_process = require('child_process');

const homeworks = require('./homeworks.json')

// rm old containers...
try {
    child_process.execSync(`docker rm $(docker ps -aq) -f`)    
} catch (error) { }


homeworks.forEach(hw=> {
    let hws_path  = path.resolve(process.cwd(), `.homeworks`);
    let hw_path  = path.resolve(hws_path, `hw-${hw.id}`);
    fs.mkdirpSync(hws_path);
    if(!fs.existsSync(path.resolve(hws_path, `hw-${hw.id}`)))
        child_process.execSync(`cd .homeworks && git clone ${hw.repo} ${hw_path}`);
    let autogradeYML = yaml.safeLoad(fs.readFileSync(`${hw_path}/.autograde.yml`))
    
    console.log(JSON.stringify(autogradeYML));
    autogradeYML.ansible_hosts.forEach(host => {
        child_process.execSync(`docker run --name ${hw.id}-${host} -d -it phusion/passenger-full:latest /bin/bash`);

        // Creating inventory:
        fs.appendFileSync(
            path.resolve(hw_path, `autograder-inventory`), 
            `
            [${host}]
            ${hw.id}-${host} ansible_connection=docker ansible_python_interpreter=/usr/bin/python3
            `)
    })

    child_process.execSync(`cd ${hw_path} && ansible-playbook -i autograder-inventory -u ${autogradeYML.ansible_user} ${autogradeYML.ansible_playbook}`, {stdio:[0,1,2]});

    child_process.execSync(`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' smirhos-app`, {stdio:[0,1,2]})
    console.log('container ip:', containerIP);
})

