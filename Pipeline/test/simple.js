const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;

const pipeline = require("../pipeline.js");
const fuzzer = require("../fuzzer.js");
const jenkins = require('jenkins')({ baseUrl: 'http://admin:admin@192.168.76.76:8080', crumbIssuer: false });

let TESTREPO = process.env.CLASSOPS_REPO || '/Users/gameweld/dev/JSPDemo';

describe('testMain', function()
{
    before(function() {
        pipeline.setCWD(TESTREPO)
    });

    describe("#jenkins", function()
    {
       it('Test server should be alive', function(done)
       {
          jenkins.info(function(err, data) {
            if (err) throw err;
            done()
          });
       }); 
       it('Check for test build configuration', function(done) {
          jenkins.job.config('my_hello_world_job', function(err, data) {
            if (err) throw err;
           
            done()
          });
       });

       it('Check build status fails', function(done) {
         jenkins.job.build({ name: 'my_hello_world_job', parameters: { name: 'value' } }, function(err, queueNumber) {
            if (err) throw err;

            pipeline.waitOnQueue(queueNumber,1000).then(function(item)
            {
                expect(item.executable).to.exist;
    
                jenkins.build.get('my_hello_world_job', item.executable.number, function(err, data) {
                    if (err) throw err;
                    //console.log('build', data.result);
                    expect(data.result).to.be.equal("FAILURE");
                    done()
                });
            });
         });
       });

       it('Check build status for jspdemo_build', function(done) {
        jenkins.job.build({ name: 'jspdemo_build' }, function(err, queueNumber) {
           if (err) throw err;
           // Wait for queue item to become executable and get build item
           pipeline.waitOnQueue(queueNumber,1000).then(function(item)
           {
               expect(item.executable).to.exist;

               jenkins.build.get('jspdemo_build', item.executable.number, function(err, data) {
                    if (err) throw err;
                    //console.log('build', data.result);
                    expect(data.result).to.be.equal("SUCCESS");
                    done()
               });
           });
        });
      });


    });

    describe('#repo', function()
    {
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

        it('should revert to master branch and sha1', function() {
            pipeline.revertToMasterHead()
            var info = pipeline.getInfo(TESTREPO)
            expect(info.branch).to.be.equals("master")
            expect(info.sha1).to.be.equals("a8d03631f014f18b8be812ba33de2eb2e7c566e0")
        });

        it('repo history should not contain fuzz commits', function() {
            pipeline.revertToMasterHead()
            var log = pipeline.gitLog();
            expect(log).to.have.property("length");
            expect(log.split('\n')).to.have.lengthOf(47);
        });
    });
});
    