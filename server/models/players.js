
module.exports = {
    
    identity: 'players',
    
    connection: 'diskDb',
    
    attributes: {
        name: {
            type: 'string',
            primaryKey: true,
            unique: true   
        },
        score: 'int',
        rank: 'int',
        avatar: 'string'
    },
    
}
