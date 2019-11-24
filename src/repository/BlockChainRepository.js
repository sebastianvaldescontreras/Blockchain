const level = require('level');
const db = level('./db',{ valueEncoding: 'json'});

var chain = []; 

module.exports = class SaveController{

    async putBlockAsync(chain){
        db.put('chain', chain,(error)=>{ 
        }); 
        chain = await this.getBlockChainAsync();
        console.log(JSON.stringify(chain, null, 4));
    }

    getBlockChainAsync(){
        return new Promise(resolve=> {
            db.get('chain', (err, chain) =>{ 
                resolve(chain);
            });
        });
    }  
    
    deleteBlockAync(){
        return new Promise(resolve=> {
            db.del('chain', (error)=>{ 
                if(error != null){
                    resolve(false);
                }else{
                    resolve(true);
                }
            }); 
        });
    }
}


