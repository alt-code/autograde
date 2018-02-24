const fs            = require('fs-extra');
const path          = require('path');
const child_process = require('child_process');
const _             = require('lodash');

class Ansible {

    constructor() {
    }

    async playbook(hw_path, autogradeYML, verbose)
    {
        console.log(`Executing playbook for ${path.basename(hw_path)}`);
        let outputPath = `${path.basename(hw_path)}.json`;
        // print to stdout and file output if verbose, otherwise redirect all output to file.
        let outputStyle = verbose ? `| tee ${outputPath}` : `> ${outputPath}`
        child_process.execSync(`cd ${hw_path} && ANSIBLE_STDOUT_CALLBACK=json ansible-playbook -i autograder-inventory -u ${autogradeYML.ansible_user} ${autogradeYML.ansible_playbook} ${outputStyle}`, {stdio:[0,1,2]});
    }
}

// Export factory class
module.exports = Ansible;