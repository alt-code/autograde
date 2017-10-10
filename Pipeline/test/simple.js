var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var pipeline = require("../jenkins.js");
var fuzzer = require("../fuzzer.js");

describe('testMain', function()
{
    describe('#repo', function()
    {
        it('should check branch and master', function() {
            var info = pipeline.getInfo('test/resources')
            // master 3ee83e99983b5541b8b7ee558a84a11191e4db49
            expect(info.branch).to.be.equals("master")
            expect(info.sha1).to.be.equals("3ee83e99983b5541b8b7ee558a84a11191e4db49")
        });
        it('should fail on non-paths', function() 
        {
            expect( pipeline.setCWD.bind(pipeline, "/ && ls -l") ).to.throw('invalid path provided');
        });
    });

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
    