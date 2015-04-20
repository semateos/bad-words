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
                        rank: 1,
						connected: false
				    },
				    {
						id: 2,
						name: 'Ballmer',
						score: 0,
                        avatar: 'images/avatar-ballmer.png',
                        rank: 2,
						connected: false
				    },
                    {
						id: 3,
						name: 'Beiber',
						score: 0,
                        avatar: 'images/avatar-beiber.png',
                        rank: 3,
						connected: false
				    },
                    {
						id: 4,
						name: 'Betty',
						score: 0,
                        avatar: 'images/avatar-betty.png',
                        rank: 4,
						connected: false
				    },
                    {
						id: 5,
						name: 'Busey',
						score: 0,
                        avatar: 'images/avatar-busey.png',
                        rank: 5,
						connected: false
				    },
                    {
						id: 6,
						name: 'Georgio',
						score: 0,
                        avatar: 'images/avatar-georgio.png',
                        rank: 6,
						connected: false
				    },
                    {
						id: 7,
						name: 'Hillary',
						score: 0,
                        avatar: 'images/avatar-hillary.png',
                        rank: 7,
						connected: false
				    },
                    {
						id: 8,
						name: 'Kramer',
						score: 0,
                        avatar: 'images/avatar-kramer.png',
                        rank: 8,
						connected: false
				    },
                    {
						id: 9,
						name: 'Michael',
						score: 0,
                        avatar: 'images/avatar-michael.png',
                        rank: 9,
						connected: false
				    },
                    {
						id: 10,
						name: 'Mimi',
						score: 0,
                        avatar: 'images/avatar-mimi.png',
                        rank: 10,
						connected: false
				    },
                    {
						id: 11,
						name: 'Ohmy',
						score: 0,
                        avatar: 'images/avatar-ohmy.png',
                        rank: 11,
						connected: false
				    },
                    {
						id: 12,
						name: 'Old Man',
						score: 0,
                        avatar: 'images/avatar-oldman.png',
                        rank: 12,
						connected: false
				    },
                    {
						id: 13,
						name: 'Oprah',
						score: 0,
                        avatar: 'images/avatar-oprah.png',
                        rank: 13,
						connected: false
				    },
                    {
						id: 14,
						name: 'Peter',
						score: 0,
                        avatar: 'images/avatar-peter.png',
                        rank: 14,
						connected: false
				    },
                    {
						id: 15,
						name: 'Trump',
						score: 0,
                        avatar: 'images/avatar-trump.png',
                        rank: 15,
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
