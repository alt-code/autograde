const ql = require("mkql"), ast = require("mkast")
const run = require('docker-run')
const fs = require('fs');
const assert = require('assert');

var example = 'Paragraph\n\n* 1\n* 2\n* 3\n\n### Header\n\n```python\nprint "hello"\n```';
var result  = ql.query(example, 'h3 + pre')

console.log(result[0]._literal)

//var dir = './.snippets';
//if (!fs.existsSync(dir)){
//    fs.mkdirSync(dir);
//}
//fs.writeFileSync('./.snippets/a.py', result[0]._literal)

let options = {
    //tty:true,
    volumes: {},
    entrypoint: 'python',
//    argv: '/docbot/.snippets/a.py'
    argv: `-c${result[0]._literal}`
}
options.volumes[__dirname] = "/docbot"
var child = run('python:2.7.13-onbuild', options);

//process.stdin.setRawMode(true)
//process.stdin.pipe(child.stdin)
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)

buf = ""
child.stdout.on('data', (data) => {
    buf += data;
});

child.on('exit', (code) => {
    console.log(`Exit code: ${code}`)
    assert.equal(buf,"hello\n")
});

