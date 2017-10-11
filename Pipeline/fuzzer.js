const fs = require('fs')
const path = require('path')

const jenkins = require('./pipeline')

// Sync get list of files in a directory, recursively. 
// https://gist.github.com/kethinov/6658166#gistcomment-1941504
const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
}

const getJavaFilePaths = (dirPath)=>{
    let filePaths = walkSync(dirPath)
    let javaPaths = []

    filePaths.forEach(file => {
        if (!file.match(/model/) && !file.match(/sql/) && path.basename(file).match(/[a-zA-Z0-9._/]+[.]java$/g)) {
            javaPaths.push(file)
        }
    })
    return javaPaths;
}

const fileFuzzer = (filePath) => {
    // reading the file line by line as an array
    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
    fs.writeFileSync(filePath, '', {encoding:'utf8'});

    lines.forEach(line=>{
        let rnd = Math.random();
        // Random.integer(0, 1)(engine)
        if(rnd>0.80 && !line.match(/<.+>/) && (line.match(/while/) || line.match(/if/)))
            line = line.replace('<', '>')
        else if(rnd<0.20 && !line.match(/<.+>/) && (line.match(/while/) || line.match(/if/)))
            line = line.replace('>', '<')

        rnd = Math.random()
        if(rnd > 0.80)
            line = line.replace('==', '!=')
        else
            line = line.replace('!=', '==')
        
        rnd = Math.random()
        if(rnd > 0.80 && !line.match(/@/) && !line.match(/\\/))
        {
            line = line.replace(/"([^"]*)"/g, `"ThisIsANotSoRandomString"`)
        }   
        
        
        // Adding new line to the end of each line to keep the format
        if(line != '\r')
            line += '\n'

        fs.appendFileSync(filePath, line, {encoding:'utf8'});
    })
    return lines;
}

const runFuzzingProcess = (root, n) => {
    let master_sha1 = process.env.MASTER_SHA1;
    let sha1 = process.env.SHA1;
    let jenkinsIP = process.env.JENKINS_IP;
    let jenkinsToken = process.env.JENKINS_BUILD_TOKEN;
    let githubURL = process.env.GITHUB_URL;
    for (var i = 0; i < n; i++) {
        let javaPaths = getJavaFilePaths(root);
        jenkins.revertToFirstCommit(sha1)
        javaPaths.forEach(javaPath =>{
            let rnd = Math.random();
            if(rnd > 0.95)
                fileFuzzer(javaPath);
        })
        let lastSha1 = jenkins.commitFuzzedCode(master_sha1, i);
        jenkins.triggerJenkinsBuild(jenkinsIP, jenkinsToken, githubURL, lastSha1)
    }
}



exports.getJavaFilePaths = getJavaFilePaths;
exports.fileFuzzer = fileFuzzer;
exports.runFuzzingProcess = runFuzzingProcess;