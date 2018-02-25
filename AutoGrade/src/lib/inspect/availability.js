const request = require('request');

class AvailabilityCheck {

    constructor(timeout) {
        this.timeout = timeout || 3000;
    }

    async endpoint(address, expectedStatus )
    {
        let status = await this.requestStatus(address);
        if( status == expectedStatus )
            console.log(`5 points! ${address} is accessible`);
        else
            console.log(`-5 points ${address} not running: ${status}`);
    }

    async requestStatus(address) {
        var self = this;
        return new Promise(function (resolve, reject) 
        {
            request(address, {timeout: self.timeout}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(0);
                }
                else if( error.code === 'ETIMEDOUT' ) {
                    resolve(error.code);
                }
                else
                {
                    resolve(error);
                }
            });
        });
    }
}

module.exports = AvailabilityCheck;