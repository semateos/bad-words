//controller for default routes
var controller = require('../controllers/api');

module.exports = [
    {
        method: 'GET',
        path: '/api/players/getPlayers',
        config: controller.getPlayers
    },
    
    {
        method: 'POST',
        path: '/api/players/addPlayer',
        config: controller.addPlayer
    },
    
    {
        method: 'GET',
        path: '/api/button/add',
        config: controller.addPlayer
    },
]
