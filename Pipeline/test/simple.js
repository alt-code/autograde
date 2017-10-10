var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var pipeline = require("../jenkins.js");
var fuzzer = require("../fuzzer.js");

let TESTREPO = process.env.CLASSOPS_REPO || '/Users/gameweld/dev/JSPDemo';

describe('testMain', function()
{
    before(function() {
        pipeline.setCWD(TESTREPO)
    });
    describe('#repo', function()
    {
        it('should revert to master branch and sha1', function() {
            pipeline.revertToFirstCommit("a8d03631f014f18b8be812ba33de2eb2e7c566e0")
            var info = pipeline.getInfo(TESTREPO)
            expect(info.branch).to.be.equals("master")
            expect(info.sha1).to.be.equals("a8d03631f014f18b8be812ba33de2eb2e7c566e0")
        });
        it('should fail on non-paths', function() 
        {
            expect( pipeline.setCWD.bind(pipeline, "/ && ls -l") ).to.throw('invalid path provided');
        });
    });

    describe('#run()', function()
    {
        it('should find java files and change them', function(done) {
            let javaPaths = fuzzer.getJavaFilePaths(TESTREPO);
            expect(javaPaths.length).to.be.above(0)

            javaPaths.forEach(javaPath =>{
                let lines = fuzzer.fileFuzzer(javaPath);
                expect(lines.length).to.be.above(0);
            })

            pipeline.commitFuzzedCode('a8d03631f014f18b8be812ba33de2eb2e7c566e0',1)
            done();
        });
    });
});
    