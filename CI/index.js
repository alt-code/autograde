const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const path = require('path')
const child_process = require('child_process')
const fs = require('fs-extra')
const yaml = require('js-yaml');
const json2yaml = require('json2yaml')
const mustache = require('mustache')
const git = require('simple-git/promise')

const token = require('./config.json').gh_token;
const uname = 'smirhos'

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 3000

app.post('/submit', (req, res) => {
    console.log('submission received: ', req.body.repo);
    
    const remote = `https://${uname}:${token}@${req.body.repo}`
    let repo_name = req.body.repo.replace('github.ncsu.edu/', '')
    repo_name = repo_name.replace('/', '_')
    
    

    try {
        fs.removeSync(`repos/${repo_name}`)
    } catch (err) {
        console.error(err)
    }

    git().silent(true)
        .clone(remote, path.resolve(`repos/${repo_name}`))
        .then(()=>{
            // git().checkoutLocalBranch(req.body.branch  || 'master', `repos/${repo_name}`)
            child_process.execSync(`cd repos/${repo_name} && git checkout ${req.body.branch  || 'master'}`);
        })
        .then(() => {
                res.send('received successfully')
                console.log('running...')
                run(`repos/${repo_name}`)
            })
        .catch((err) => res.send('failed: ' + err))
})

async function run (repo_path) {
    // copy files, add variables
    let servers = require('./templates/servers.json')
    let renderedInventory = mustache.render(fs.readFileSync('templates/inventory.ini.template').toString(), {IP_ADDRESS: servers.pop()})
    fs.writeFileSync('templates/servers.json', JSON.stringify(servers))
    fs.writeFileSync(path.resolve(repo_path, 'inventory.ini'), renderedInventory)
    fs.copySync('templates/opunit.yml', path.resolve(repo_path, 'test/opunit.yml'))
    fs.copySync('devops_servers_rsa', path.resolve(repo_path, 'devops_servers_rsa'))

    let ourVariables = require('./templates/variables.json');
    
    let studentVariables = yaml.safeLoad(fs.readFileSync(path.resolve(repo_path, 'variables.yml')), {json: true})

    for(v of Object.keys(ourVariables)) {
        studentVariables[v] = ourVariables[v];
    }
    // console.log('student', studentVariables);
    fs.writeFileSync(path.resolve(repo_path, 'variables.yml'), json2yaml.stringify(studentVariables));
    //------------------------


    // Run Ansible and run opunit
    console.log('running ansible...')
    try {
        child_process.execSync(`cd ${repo_path} && ansible-playbook -i inventory.ini playbook.yml --extra-vars "ansible_sudo_pass=ubuntu" > ansible.stdout`)
    } catch (err) {
        console.error('=> ansible playbook failed.')
    }
    // child_process.execSync(`cd ${repo_path} && opunit verify`)
    console.log('running opunit...')
    child_process.execSync(`cd ${repo_path} && echo "opunit results ..." > opunit.stdout`)

    //-------------------------
}

app.post('/check_opunit', (req, res) => {
    let repo_name = req.body.repo.replace('github.ncsu.edu/', '')
    repo_name = repo_name.replace('/', '_')
    res.send(fs.readFileSync(`repos/${repo_name}/opunit.stdout`))
})

app.post('/check_ansible', (req, res) => {
    let repo_name = req.body.repo.replace('github.ncsu.edu/', '')
    repo_name = repo_name.replace('/', '_')
    res.send(fs.readFileSync(`repos/${repo_name}/ansible.stdout`))
})

app.post('/inventory_status', (req, res) => {
    res.send(fs.readFileSync(`templates/servers.json`))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
