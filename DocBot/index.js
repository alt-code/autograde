const ql = require("mkql"), ast = require("mkast")
const run = require('docker-run')
const fs = require('fs');
var Promise = require("bluebird");

function extractSnippet(markdown, query)
{
    var result  = ql.query(markdown, query)
    return result;
}

function runPythonSnippet(code)
{
	return new Promise(function (resolve, reject) 
	{
        let options = {
            volumes: {},
            entrypoint: 'python',
            argv: `-c${code}`
        }
        options.volumes[__dirname] = "/docbot"
        var child = run('python:2.7.13-onbuild', options);
        
        //process.stdin.setRawMode(true)
        //process.stdin.pipe(child.stdin)
        //child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
        
        buf = ""
        child.stdout.on('data', (data) => {
            buf += data;
        });
        
        child.on('exit', (code) => {
            //console.log(`Exit code: ${code}`)
            resolve( {exitCode: code, output: buf} )
        });
        child.on('error', (err) => {
            reject(err);
        });
    });
}

exports.extractSnippet = extractSnippet;
exports.runPythonSnippet = runPythonSnippet;