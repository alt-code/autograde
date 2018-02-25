const Check = require('../inspect/check');
const semver = require('semver');

class VersionCheck extends Check {

    constructor() {
        super();
    }

    async check(context, args)
    {
        return await this.verifyRange( context.container, args.cmd, args.range );
    }

    async verifyRange(container, cmd, expectedRange)
    {
        let output = await this.tools.exec(container, cmd);
        // output currently has extra newline
        output = output.split('\n')[0];

        let status = semver.gtr(output, expectedRange);

        let results = {
            cmd: cmd,
            actual: output,
            expected: expectedRange,
            status: status
        }
        return results;
    }

    async report(results)
    {
        console.log( `${results.cmd}: ${results.actual} > ${results.expected} => ${results.status} `);
    }
}

// Export factory class
module.exports = VersionCheck;