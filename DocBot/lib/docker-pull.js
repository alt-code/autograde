//https://github.com/mafintosh/docker-run/commit/deb176341e8cd7722d64308b0450edbf5933383e

var raw = require('docker-raw-stream')
var docker = require('docker-remote-api')
var through = require('through2')
var pump = require('pump')
var events = require('events')
var debug = require('debug')('docker-run')

var request = docker(undefined, {version:'v1.14'})
var that = new events.EventEmitter()

var pull = function(image, cb)
{
    //if (opts.fork) return cb()

    debug('pulling to stdio for %s', image)
    var stdin = request.post('/images/create?fromImage='+image, {}, function(err, response) 
    {
        response.on('error',function(err){
            console.log(err);
        })
        response.on('data', function(data)
        {
            console.log(data);
        });
        response.on('end',function(){
            console.log('response end')
            that.emit('exit', 1024)
            that.emit('close')
        })
        if (err) return cb(err)
        //if (tty) return cb(null, stdin, response)

        var parser = response.pipe(raw())
        cb(null, stdin, parser.stdout, parser.stderr)
    });

    if (!stdin._header && stdin._implicitHeader) stdin._implicitHeader()
    if (stdin._send) stdin._send(new Buffer(0))
}

pull('python:2.7.13-onbuild',function(err, stdin, stdout, stderr)
{
    console.log(err)
});