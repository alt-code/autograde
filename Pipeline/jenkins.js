const child_process = require('child_process')
const http = require('http');
const fs = require('fs')

let options = {cwd: 'test/resources'};
const setCWD = (cwd) => {
    if( !fs.existsSync(cwd) )
        throw new Error('invalid path provided');
    options.cwd = cwd;
}

const commitFuzzedCode = (master_sha1, n) => {
    child_process.execSync(`git stash && git checkout -b fuzzer && git checkout stash -- . && git commit -am "Fuzzing master:${master_sha1}: # ${n}"`, options)
    child_process.execSync('git push', options)
    child_process.execSync('git stash drop', options);
    let lastSha1 = child_process.execSync(`git rev-parse fuzzer`, options).toString().trim()
    return lastSha1;
}

const revertToFirstCommit = (firstSha1, n) => {
    child_process.execSync(`git checkout ${firstSha1}`, options)
}

const getInfo = (dest) => {
    let branch = child_process.execSync(`git rev-parse --abbrev-ref HEAD`, options).toString().trim();
    let sha1   = child_process.execSync(`git rev-parse master`, options).toString().trim();
    return {branch: branch, sha1: sha1}
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
exports.revertToFirstCommit = revertToFirstCommit;
exports.triggerJenkinsBuild = triggerJenkinsBuild;
exports.setCWD = setCWD;