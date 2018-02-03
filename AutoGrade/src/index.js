const _        = require('lodash');
const Bluebird = require('bluebird');
const fs       = require('fs');
const path     = require('path');
const spawn    = require('child_process').spawn;
const yargs    = require('yargs');



// Register run command
yargs.command('run <id>', 'Build a docker image for a gist, then run it.', (yargs) => {

    yargs.positional('id', {
        describe: 'Gist ID',
        type: 'string'
    });

}, async (argv) => {

    // Get id and source directory
    let id = argv.id;
    console.log( id );
});


// Turn on help and access argv
yargs.help().argv;