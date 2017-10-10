var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var pipeline = require("../jenkins.js");
var fuzzer = require("../fuzzer.js");

describe('testMain', function()
{
    describe('#run()', function()
    {
        it('should find java files and change them', function(done) {
            let javaPaths = fuzzer.getJavaFilePaths('test/resources');
            //jenkins.revertToFirstCommit(sha1)
            javaPaths.forEach(javaPath =>{
                let lines = fuzzer.fileFuzzer(javaPath);
                expect(lines.length).to.be.above(0);
            })
            expect(javaPaths.length).to.be.above(0)
            done();
        });
    });
});
    