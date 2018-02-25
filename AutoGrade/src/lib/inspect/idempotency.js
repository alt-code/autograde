const fs            = require('fs-extra');
const path          = require('path');
const child_process = require('child_process');
const _             = require('lodash');

const Ansible = require('../harness/ansible');

class IdempotencyCheck {

    constructor() {
        this.ansible = new Ansible();
    }

    async check(hw, hw_path, autogradeYML)
    {
        console.log(`Checking idempotency`)
        let outputOne =  await this.ansible.playbook(hw_path, autogradeYML, false);
        let outputTwo =  await this.ansible.playbook(hw_path, autogradeYML, false);

        console.log( outputTwo.stats );

        let hosts = [];
        for( host of autogradeYML.ansible_hosts )
        {
            let server = `${hw.id}-${host}`;
            let changedOne = outputOne.stats[server].changed;
            let changedTwo = outputTwo.stats[server].changed;
            let status = changedTwo == 0 ? true : false;
            hosts.push( {host: host, idempotent: status} );
        }
        console.log( `Idempotent status: ${JSON.stringify(hosts.join(','))}`);
    }
}

// Export factory class
module.exports = IdempotencyCheck;