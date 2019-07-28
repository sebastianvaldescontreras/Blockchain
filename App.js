var app = require('./src/controller/BlockChainController');

var port = app.get('port');

app.listen(port, function () {
  console.log('Blockchain cargada en puerto: '+port+'...');
});

