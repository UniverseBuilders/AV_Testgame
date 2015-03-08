// this script is for populating and responding to elements on the main control page not otherwise handled by angular

// ==============================
// ===      turn handling     ===
// ==============================
nextTurn = function(){
    // moves to the next turn
    window.gameData.save.turn = parseInt(window.gameData.save.turn) + 1;

    // reset all player-has-played booleans
    for (var i = 0; i < window.gameData.save.players.length; i++) {
        window.gameData.save.players[i].hasPlayed = false;
    }

    $.post( "/uploadCurrentGame", window.gameData.save, function( response ) {
        alert('game json uploaded');
        location.reload();
    });
}

$(document).on("gameDataLoaded", function(evt){
    $('#current-turn').html(window.gameData.save.turn);
});

$(document).on("gameDataLoaded", function(evt){
    var html = "";

    for (i in gameData.save.players){
        var player = gameData.save.players[i];
        if (!player.hasPlayed || player.hasPlayed == "false"){
            html += '<i class="fa fa-square-o fa-2x"></i>';
        } else {
            html += '<i class="fa fa-check-square-o fa-2x"></i>';
        }
        html += player.name + '<br>';
    }

    $('#player-completion-list').html(html);
});
// ==============================

