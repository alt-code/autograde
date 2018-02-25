const Check = require('../inspect/check');
const semver = require('semver');

class VersionCheck extends Check {

    constructor() {
        super();
    }

    async check(host, cmd, expectedRange)
    {
        let output = await this.tools.exec(host, cmd);
        // output currently has extra newline
        output = output.split('\n')[0];

        let status = semver.gtr(output, expectedRange);
        console.log( `${cmd}: ${output} > ${expectedRange} => ${status} `);
    }
}

// Export factory class
module.exports = VersionCheck;