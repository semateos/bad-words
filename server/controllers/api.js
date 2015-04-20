// This is the base controller. Used for base routes, such as the default index/root path, 404 error pages, and others.
module.exports = {
    getPlayers: {
        handler: function(request, reply){
            // Grab the DB from dogwater
            var db = request.server.plugins['dogwater'];
            
            // Look for Stimpy in the cats model, placed there as a fixture
            // add a click to Stimpy
            db.players.find().then(function(players) {
                reply(players);
            });
            
        }
    },
    
    addPlayer: {
        handler: function(request, reply){
            // Grab the DB from dogwater
            var db = request.server.plugins['dogwater'];
            
            reply(request.body);
            
            var body = '';
            request.on('data', function (data) {
                body += data;
            });
            request.on('end', function () {
                var post = qs.parse(body);
                reply(post);
                // use post['blah'], etc.
            });
            
            /*
            db.players.create({
                name: request.name,
                score: request.score,
                rank: request.rank,
                avatar: request.scoreboardAvatar
            }).then(function(player) {
                reply(player);
            });
            
            */
        }
    },
    
    click: {
        handler: function(request, reply){
            // Grab the DB from dogwater
            var db = request.server.plugins['dogwater'];
            
            // Look for Stimpy in the cats model, placed there as a fixture
            // add a click to Stimpy
            db.cats.findOne(1).then(function(cat) {
                
                cat.clicks++;
                
                cat.save();

                reply({clicks: cat.clicks});
            });
            
        }
    },
    
    count: {
        handler: function(request, reply){

            // Grab the DB from dogwater
            var db = request.server.plugins['dogwater'];
            
            // Look for Stimpy in the cats model, placed there as a fixture
            db.cats.findOne(1)
            .then(function(cat) {
            
                // Reply with the number of clicks on Stimpy
                reply({clicks: cat.clicks});
                
            });
        }
    }
}