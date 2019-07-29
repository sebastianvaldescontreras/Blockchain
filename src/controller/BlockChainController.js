const express = require('express');
const basicAuth = require('express-basic-auth')
const qrcode = require('qrcode');
var RSA = require('rsa-compat').RSA;
var qrService = require('../service/RsaService');
var BlockchainController = require('./BlockChainService');
var BlockChainRepository = require('./BlockChainRepository');
var BlockDto = require('../dto/BlockDto');
var options = { bitlen: 1024, exp: 65537, public: true, pem: true, internal: true };
const qrController = express();
let index = 0;
let blockchainController = new BlockchainController();
let blockChainRepository = new BlockChainRepository();

qrController.set('port', process.env.PORT || 8080);
qrController.use(basicAuth({ authorizer: myAuthorizer }));

function myAuthorizer(username, password) {
  //return username.startsWith(process.env.QR_USER) && password.startsWith(process.env.QR_PASSWORD)
  return username.startsWith("blockchain") && password.startsWith("blockchain");
};

qrController.use(express.json());

//--------------------------------------------------------------------------------------------------------
//Metodo post para enviar datos en formato json encriptados en RSA a QR dentro de cadena de bloques. 
qrController.put('/blockencripted', async (request, response) => {
  //1. Convierto el contenido de la peticion a string.
  var requestJsonText = JSON.stringify(request.body);
  //2. Valido que el contenido no tenga mas de 4296 caracteres.
  if (requestJsonText.length > 4296 || !contentValidate(requestJsonText)) {
    response.status(400);
    response.send('');
  }
  //3. Muestro el contenido json de la peticion.
  //console.log(requestJsonText);
  //4. Encripto el JSON en RSA.
  var encrypted = qrService.encryptValue(requestJsonText);
  //5. Muestro el RSA.
  //console.log(encrypted);
  //6. Desencripto el RSA para revisar el JSON ingresado.
  var decrypt = qrService.decryptValue(encrypted);
  //console.log(decrypt);
  //7. Convierto contenido a RSA.
  var contenido = await getQrWithContentRsa(encrypted);
  //console.log(contenido);
  //8. Obtengo la cadena si es que existe
  var chain = await blockChainRepository.getBlockChainAsync();
  //9. Si existe inicializo con la cadena de base de datos
  //console.log(chain);
  if(chain !== undefined){
    blockchainController = new BlockchainController(chain.chain);
    index = chain.chain[chain.chain.length - 1].index;
  }else{
    blockchainController = new BlockchainController();
  }
  index = index + 1;
  //console.log(JSON.stringify(blockchainController, null, 4));
  //10.Creo un objeto de BlockDto para guardar contenido RSA en JSON. 
  const blockDto = new BlockDto(index, new Date(), { contenido });
  //11.Agrego el bloque a la cadena
  blockchainController.addBlock(blockDto);
  //12.Persistencia del bloque
  await blockChainRepository.putBlockAsync(blockchainController);
  //13.valido la cadena de bloques.
  if(blockchainController.checkValid(blockchainController)){
    response.status(200);
    response.send({insertBlock: true});
  }else{
    response.status(400)
    response.status({error: 'Blockchain Invalida! '});
  }   
});

//--------------------------------------------------------------------------------------------------------
//Metodo post para enviar datos en formato json a QR dentro de cadena de bloques. 
qrController.post('/blockqr', async (request, response) => {
  //1. Convierto el contenido de la peticion a string.
  var requestJsonText = JSON.stringify(request.body);
  //2. Valido que el contenido no tenga mas de 4296 caracteres.
  if (requestJsonText.length > 4296 || !contentValidate(requestJsonText)) {
    response.status(400);
    response.send('');
  }
  //3. Convierto la peticion a QR.
  var contenido = await getQrWithContentRsa(requestJsonText);
  //4.Obtengo la Cadena guardada si es que existe
  var chain = await blockChainRepository.getBlockChainAsync();
  //4. Si existe inicializo con la cadena de base de datos
  //console.log(chain);
  if(chain !== undefined){
    blockchainController = new BlockchainController(chain.chain);
    index = chain.chain[chain.chain.length - 1].index;
  }else{
    blockchainController = new BlockchainController();
  }
  index = index + 1;
  //console.log(JSON.stringify(blockchainController, null, 4));
  //5.Creo un objeto de BlockDto para guardar contenido RSA en JSON. 
  const blockDto = new BlockDto(index, new Date(), { contenido });
  //6.Agrego el bloque a la cadena
  blockchainController.addBlock(blockDto);
  //7.Persistencia del bloque
  await blockChainRepository.putBlockAsync(blockchainController);
  //8.valido la cadena de bloques.
  if(blockchainController.checkValid(blockchainController)){
    response.status(200);
    response.send({insertBlock: true});
  }else{
    response.status(400)
    response.status({error: 'Blockchain Invalida! '});
  }   
});

//--------------------------------------------------------------------------------------------------------
//Metodo para obtener las llaves publica y privada de RSA. 
qrController.post('/keys', (request, response) => {
  RSA.generateKeypair(options, function (err, keypair) {
    var privateKey = RSA.exportPrivatePem(keypair);
    var publicKey = RSA.exportPublicPem(keypair);
    response.status(200);
    response.send(privateKey + publicKey);
  });
});
//--------------------------------------------------------------------------------------------------------
//Metodo para borrar toda la cadena de bloques. 
qrController.delete('/blockchain', async (request, response) => {
  index = 0;
  var blockChainDelete = await blockChainRepository.deleteBlockAync();
  if(blockChainDelete){
    response.status(200)
    response.send({deleteBlockChain: true});
  }else{
    response.status(400)
    response.status({error: 'Blockchain Error al Borrar! '});
  }
});
//--------------------------------------------------------------------------------------------------------
// Metodo para agregar un valor a la cadena de bloque en formato json
qrController.post('/block', async (request, response) => {
  //1. Convierto el contenido de la peticion a string.
  var requestJsonText = JSON.stringify(request.body);
  //2. Valido que el contenido no tenga mas de 4296 caracteres.
  if (requestJsonText.length > 4296 || !contentValidate(requestJsonText)) {
    response.status(400);
    response.send('');
  }
  //3. Convierto el contenido de la peticion a string.
  var contenido = request.body;
  //4. Muestro el contenido json de la peticion.
  //console.log(contenido);
  //5. Obtengo la cadena si es que existe
  var chain = await blockChainRepository.getBlockChainAsync();
  //6. Si existe inicializo con la cadena de base de datos
  //console.log(chain);
  if(chain !== undefined){
    blockchainController = new BlockchainController(chain.chain);
    index = chain.chain[chain.chain.length - 1].index;
  }else{
    blockchainController = new BlockchainController();
  }
  index = index + 1;
  //console.log(JSON.stringify(blockchainController, null, 4));
  //7.Creo un objeto de BlockDto para guardar contenido RSA en JSON. 
  const blockDto = new BlockDto(index, new Date(), { contenido });
  //8.Agrego el bloque a la cadena
  blockchainController.addBlock(blockDto);
  //9.Persistencia del bloque
  await blockChainRepository.putBlockAsync(blockchainController);
  //10.valido la cadena de bloques.
  if(blockchainController.checkValid(blockchainController)){
    response.status(200);
    response.send({insertBlock: true});
  }else{
    response.status(400)
    response.send({error: 'Blockchain Invalida! '});
  }
});
//--------------------------------------------------------------------------------------------------------
// Obtener Cadena de Bloques
qrController.get('/blockchain', async (request, response) => {
  var blockChain = await blockChainRepository.getBlockChainAsync();
  if(blockChain !== undefined){
    response.status(200);
    response.send(blockChain);
  }else{
    response.status(400);
    response.send({error: 'Blockchain vacia! '});
  }
});
//--------------------------------------------------------------------------------------------------------
contentValidate = (content) =>{
  var compare = content.replace(/[-\/\\^$*+<>?()|[\]]/g, "");
  return compare.length == content.length;
}
//--------------------------------------------------------------------------------------------------------
getQrWithContentRsa = (contentRsa) =>{
  return new Promise(resolve => {
    qrcode.toDataURL(contentRsa)
    .then(async qr => {
      resolve(qr);
    });
  });
}

module.exports = qrController;



