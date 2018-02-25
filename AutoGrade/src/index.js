const _        = require('lodash');
const Bluebird = require('bluebird');
const fs       = require('fs-extra');
const path     = require('path');
const spawn    = require('child_process').spawn;
const yargs    = require('yargs');
const yaml     = require('js-yaml');

const Check = require('./lib/inspect/check');
const IdempotencyCheck = require('./lib/inspect/idempotency');

const DockerTools = require('./lib/harness/dockertools');
const Ansible = require('./lib/harness/ansible');
const Repos = require('./lib/harness/repos');

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

let tools = new DockerTools();
let ansible = new Ansible();
let repos = new Repos();

main();

async function main()
{
    // Remove previous containers
    await tools.removeContainers();

    for( let hw of homeworks )
    {
        await grade(hw);
    }
}

async function grade(hw)
{
    // Prepare local directory for storing homework projects
    let hws_path  = path.resolve(process.cwd(), `.homeworks`);
    let hw_path  = path.resolve(hws_path, `hw-${hw.id}`);
    fs.mkdirpSync(hws_path);

    // Retrieve student repo and clone locally.
    await repos.clonerepo(hw, hw_path);

    // Parse autograde requirements
    let autogradeYML = yaml.safeLoad(fs.readFileSync(`${hw_path}/.autograde.yml`))
    console.log(JSON.stringify(autogradeYML));

    const dockerImage = 'phusion/passenger-full:latest';
    // Ensure image exists
    await tools.pull(dockerImage);
    
    // Create docker container for each host
    for( host of autogradeYML.ansible_hosts )
    {
        // Create and start container
        await tools.run(dockerImage, '/bin/bash', `${hw.id}-${host}`);
    }

    // Create inventory
    ansible.makeInventory(hw_path, hw, autogradeYML);

    // Run student playbook against inventory
    await ansible.playbook(hw_path, autogradeYML, false);

    // Grade....
    // The following is just test code at moment
    let ip = await tools.getContainerIp('smirhos-app');
    console.log(ip);

    let check = new Check();
    let status = await check.requestStatus(`http://${ip}:3000`)
    if( status == 0 )
        console.log(`5 points! http://${ip}:3000 is accessible`);
    else
        console.log(`-5 points http://${ip}:3000 not running: ${status}`);

    let output = await tools.exec('smirhos-app', `node --version`);
    console.log( `node --version ${output}`);

    let idemCheck = new IdempotencyCheck();
    idemCheck.check( hw, hw_path, autogradeYML);
}
