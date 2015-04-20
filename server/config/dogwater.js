var Path = require('path');

module.exports = {
    
    models: Path.normalize(__dirname + '/../models'),
    
    data: {
		fixtures: [
		    {
				model: 'players',
				items: [
				    {
						id: 1,
						name: 'Alien',
						score: 0,
                        avatar: 'images/avatar-alien.png',
						connected: false
				    },
				    {
						id: 2,
						name: 'Ballmer',
						score: 0,
                        avatar: 'images/avatar-ballmer.png',
						connected: false
				    },
                    {
						id: 3,
						name: 'Beiber',
						score: 0,
                        avatar: 'images/avatar-beiber.png',
						connected: false
				    },
                    {
						id: 4,
						name: 'Betty',
						score: 0,
                        avatar: 'images/avatar-betty.png',
						connected: false
				    },
                    {
						id: 5,
						name: 'Busey',
						score: 0,
                        avatar: 'images/avatar-busey.png',
						connected: false
				    },
                    {
						id: 6,
						name: 'Georgio',
						score: 0,
                        avatar: 'images/avatar-georgio.png',
						connected: false
				    },
                    {
						id: 7,
						name: 'Hillary',
						score: 0,
                        avatar: 'images/avatar-hillary.png',
						connected: false
				    },
                    {
						id: 8,
						name: 'Kramer',
						score: 0,
                        avatar: 'images/avatar-kramer.png',
						connected: false
				    },
                    {
						id: 9,
						name: 'Michael',
						score: 0,
                        avatar: 'images/avatar-michael.png',
						connected: false
				    },
                    {
						id: 10,
						name: 'Mimi',
						score: 0,
                        avatar: 'images/avatar-mimi.png',
						connected: false
				    },
                    {
						id: 11,
						name: 'Ohmy',
						score: 0,
                        avatar: 'images/avatar-ohmy.png',
						connected: false
				    },
                    {
						id: 12,
						name: 'Old Man',
						score: 0,
                        avatar: 'images/avatar-oldman.png',
						connected: false
				    },
                    {
						id: 13,
						name: 'Oprah',
						score: 0,
                        avatar: 'images/avatar-oprah.png',
						connected: false
				    },
                    {
						id: 14,
						name: 'Peter',
						score: 0,
                        avatar: 'images/avatar-peter.png',
						connected: false
				    },
                    {
						id: 15,
						name: 'Trump',
						score: 0,
                        avatar: 'images/avatar-trump.png',
						connected: false
				    },
				]
		    }
		]
    },
    
    connections: {
		diskDb: {
		    adapter: 'disk'
		}
    },
    
    adapters: {
		disk: require('sails-disk')
    }
    
}
