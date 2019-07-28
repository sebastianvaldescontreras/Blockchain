var expect = require('chai');
var chaiHttp = require('chai-http');
var qrService = require('../../src/service/QrService'); 

expect.use(chaiHttp);
expect.should();

var log4js = require('log4js');
var log = log4js.getLogger();
log.level = 'info';
log.level = 'error';

let encrypted; 

describe('1. QrServiceTest',function(){
    it('1.1. should get a string with rsa key public', function(done){
        var requestJsonText = JSON.stringify({
            "folio":"1234567890",
            "proposal":"1234567890",
            "validate":"1234567890"
        });
        encrypted = qrService.encryptValue(requestJsonText);
        log.info(encrypted);
        expect.assert.equal(encrypted, 'dXKCdf/jz+gdwa8ftw/cvHRkRvFRJOSOBOm5NZ5PvwbBYQlOqonXELgRFIHTt205BltZUY74sQibwrmeUpx4K2BtccJLSTsyom5DEnEevKZohZqgt90ICzW7tYYXfTqtVjd7TcPX3+6W/08CMg+YcDpKIlhQd9Yzskq+HFw81K4=');
        done();
    }); 

    it('1.2. should get a string with rsa key private', function(done){
        var decrypt = qrService.decryptValue(encrypted);
        log.info(decrypt);
        expect.assert.equal(decrypt,'{"folio":"1234567890","proposal":"1234567890","validate":"1234567890"}');
        done();
    }); 
});