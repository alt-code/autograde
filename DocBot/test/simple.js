var chai = require("chai");
var expect = chai.expect;

var docbot = require("../index.js");

describe('testMain', function()
{
//    this.timeout(4000);
    describe('#run()', function()
    {
        it('should find code snippet, execute print hello', function(done) {
            var example = 'Paragraph\n\n* 1\n* 2\n* 3\n\n### Header\n\n```python\nprint "hello"\n```';
            var result = docbot.extractSnippet(example,'h3 + pre')
            docbot.runPythonSnippet(result[0]._literal).then(function(res)
            {
                done()
                expect(res.exitCode).to.equal(0);
                expect(res.output).to.equal("hello\n");
            });
        });
    });
});
    