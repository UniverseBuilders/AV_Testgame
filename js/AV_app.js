(function() {
    var app = angular.module('avCore', []);

    app.controller('playerControls', ['$http', function($http) {
        game = this;
        game.players = [];

        $http.get('/gameData/currentGame.json').success(function(data){
            //window.gameData = data;
            game.players = data.players;
            //$(document).trigger("gameDataLoaded");
        });

        this.player = function(){
            // returns player object for currently selected player
            return game.players[game.playerID];
        };
    }]);

})();