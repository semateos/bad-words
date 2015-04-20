var Path = require('path');

module.exports = {
    
    models: Path.normalize(__dirname + '/../models'),
    
    data: {
		fixtures: [
		    {
				model: 'cats',
				items: [
				    {
						id: 1,
						name: 'Ren',
						points: 0,
						connected: false
				    },

				    {
						id: 2,
						name: 'Stimpy',
						points: 0,
						connected: false
				    },

				    {
						id: 3,
						name: 'Sven',
						points: 0,
						connected: false
				    }
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
