const child_process = require('child_process')
const http = require('http');
const fs = require('fs')

const commitFuzzedCode = (master_sha1, n) => {
    child_process.execSync(`git stash && git checkout fuzzer && git checkout stash -- . && git commit -am "Fuzzing master:${master_sha1}: # ${n}" && git push`)
    child_process.execSync('git stash drop');
    let lastSha1 = child_process.execSync(`git rev-parse fuzzer`).toString().trim()
    return lastSha1;
}

const revertToFirstCommit = (firstSha1, n) => {
    child_process.execSync(`git checkout ${firstSha1}`)
}

const getInfo = (dest) => {
    if( !fs.existsSync(dest) )
        throw new Error('invalid path provided');
    let branch = child_process.execSync(`cd ${dest} && git rev-parse --abbrev-ref HEAD`).toString().trim();
    let sha1   = child_process.execSync(`cd ${dest} && git rev-parse master`).toString().trim();
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