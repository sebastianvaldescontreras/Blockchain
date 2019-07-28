var expect = require('chai');
var chaiHttp = require('chai-http');
var QrController = require('../../src/controller/QrController'); 

expect.use(chaiHttp);
expect.should();

const token = 'Basic YXBpLXFyLXJzYTphcGlxcnJzYXNmMTEwNDIwMTk=';

async function iniTest(){
    try{
        var desc = await describe('1. QrControllerTest',function(){
            it('1.1. should get a string with rsa format', function(done){
                expect.request(QrController)
                .post('/qr')
                .send({
                    "blockchain":"blockchain"
                })
                .set({ ContentType : "application/json", Authorization : token })
                .end(function(error,response){
                    response.should.have.status(200);
                    done();
                });
            }); 
        });
    }
    catch(error){
        log.error(error);
    }
}

iniTest();