var NodeRSA = require('node-rsa');

  module.exports = {
    encryptValue: (qrContent) =>{
        var pk = new NodeRSA({b: 1024});
  
        //var privateKey = process.env.RSA_PRIVATE_KEY;
        var privateKey = "-----BEGIN RSA PRIVATE KEY-----"+
        "MIICXwIBAAKBgQDDfSO2XlGQAM/Ty77p3gtFWOR7qNx9ABsMg+tHt4nMWiA+Uhnb"+
        "AAoARiuviZuqCU/s+10M6u0zRb0hdoZHdMNCk56OaijarG3nEpWSyw77yR+grXjP"+
        "34A0s9HR9siNWiDIJiECrj7AmDM2XuNWWJY24v2bTjyDjyuFzbQeJDuwHQIDAQAB"+
        "AoGBAInv69oLlVuZ5wtYEZ7taWCGR7olvWaKQ4vCLasOC7Jgya2PuuS3k1b8LGkR"+
        "HQCOz5G1D8REpBhwlfJdsoQLFJbQgVoAo9qBrhNOXGZjFSWReHFSQk04+a2ha3zQ"+
        "krFyuhGRtcIOD+4fCW6Yo2kenYqwjqriFn/3iSAg9IZTkkb1AkEA/Pm8Zt8vPpcz"+
        "1wAisyuIOcE1uHJHcrd1/eprjK0S/O5PGT9hjDyhKEgI7PLXrr7aSkWYYv335Qhc"+
        "+0quuDiArwJBAMXTdUehUeSPV21jEUPUgCxQR7M+XyFt1dyIhIkOX8zVLdK9osXB"+
        "xYnoMKwSmQO4OzKOVCChkTS2mz6Xm/a9lvMCQQDk9VaqOKd227ykg8/kH6s8snzf"+
        "gjbeQeN9u5Q5j0+XMkzOygmMtjcZ0RCa/DNvSfchr5l7Rub9GLOnEHHP8/urAkEA"+
        "iHP8QIVYrHPnFS+xV/06z9YsLsoF6lQNoQmVicgdcndVHTjrDsdCz4YWFIrbesJY"+
        "Kt4bz0pCk36lhL4kuUQ62wJBAPOCKmEfjBGHvEiBzOl3bjjPYMVf3XtmhVh8kItK"+
        "tgryVxIPLz83RasnlgIza7KihCSQ7OBD6g+x2x68GRapRJs="+
        "-----END RSA PRIVATE KEY-----";
      
        pk.importKey(privateKey);
        var encrypted = pk.encryptPrivate(qrContent, 'base64');
        return encrypted;
    },
    decryptValue: (encrypted)=>{
        var pk = new NodeRSA({b: 1024});
        
        var publicKey = "-----BEGIN RSA PUBLIC KEY-----"+
        "MIGJAoGBAMN9I7ZeUZAAz9PLvuneC0VY5Huo3H0AGwyD60e3icxaID5SGdsACgBG"+
        "K6+Jm6oJT+z7XQzq7TNFvSF2hkd0w0KTno5qKNqsbecSlZLLDvvJH6CteM/fgDSz"+
        "0dH2yI1aIMgmIQKuPsCYMzZe41ZYljbi/ZtOPIOPK4XNtB4kO7AdAgMBAAE="+
        "-----END RSA PUBLIC KEY-----";
      
        pk.importKey(publicKey);
        var decrypt = pk.decryptPublic(encrypted, 'utf-8');
        return decrypt;
    }
  };
  
 