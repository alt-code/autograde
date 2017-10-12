const child_process = require('child_process')
const http = require('http');
const fs = require('fs');
const Promise = require("bluebird");
const jenkins = require('jenkins')({ baseUrl: 'http://admin:admin@192.168.76.76:8080', crumbIssuer: false });


let options = {cwd: ''};
const setCWD = (cwd) => {
    if( !fs.existsSync(cwd) )
        throw new Error('invalid path provided');
    options.cwd = cwd;
}

const commitFuzzedCode = (master_sha1, n) => {
    child_process.execSync(`git stash && (git checkout fuzzer || git checkout -b fuzzer) && git checkout stash -- . && git commit -am "Fuzzing master:${master_sha1}: # ${n}"`, options)
    child_process.execSync('git push --all origin', options)
    child_process.execSync('git stash drop', options);
    let lastSha1 = child_process.execSync(`git rev-parse fuzzer`, options).toString().trim()
    return lastSha1;
}

const revertToMasterHead=()=> {
//const revertToFirstCommit = (firstSha1, n) => {
    //child_process.execSync(`git checkout ${firstSha1}`, options)
    child_process.execSync(`git checkout -B master && git reset --hard origin/master`, options)
}

const gitLog = () => 
{
    return child_process.execSync('git log', options).toString().trim();
}

const getInfo = (dest) => {
    let branch = child_process.execSync(`git rev-parse --abbrev-ref HEAD`, options).toString().trim();
    let sha1   = child_process.execSync(`git rev-parse origin/master`, options).toString().trim();
    return {branch: branch, sha1: sha1}
}

const waitOnQueue = (id, timeout) => {
    var start = Date.now();
    return new Promise(waitForQueueItem);
    function waitForQueueItem(resolve, reject) {
        jenkins.queue.item(id, function(err, item) {
            if (err) reject(err);
            if (item.executable || item.cancelled ) {
                resolve(item);
            }
            if (timeout && (Date.now() - start) >= timeout)
                reject(new Error("timeout"));
            else
                setTimeout(waitForQueueItem.bind(this, resolve, reject), 50);
        });
    }
}

const waitForBuild = (job,id, timeout) => {
    var start = Date.now();
    return new Promise(waitForBuildItem);
    function waitForBuildItem(resolve, reject) {
        jenkins.build.get(job, id, function(err, item) {
            if (err) reject(err);
            if (item.result ) {
                resolve(item);
            }
            if (timeout && (Date.now() - start) >= timeout)
                reject(new Error("timeout"));
            else
                setTimeout(waitForBuildItem.bind(this, resolve, reject), 100);
        });
    }
}

const triggerJenkinsBuild = (jenkinsIP, jenkinsToken, githubURL, sha1) => {
    try {
        child_process.execSync(`curl "http://${jenkinsIP}:8080/git/notifyCommit?url=${githubURL}&branches=fuzzer&sha1=${sha1}"`)
        console.log(`Succesfully trigger build for fuzzer:${sha1}`)
    } catch (error) {
        console.log(`Couldn't trigger build for fuzzer:${sha1}`)
    }
}



exports.commitFuzzedCode = commitFuzzedCode;
exports.getInfo = getInfo;
exports.gitLog = gitLog;
exports.revertToMasterHead = revertToMasterHead;
exports.triggerJenkinsBuild = triggerJenkinsBuild;
exports.setCWD = setCWD;
exports.waitOnQueue = waitOnQueue;
exports.waitForBuild = waitForBuild;