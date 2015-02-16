// this script is for populating and responding to elements on the main control page

// =============================
// === === === utils === === ===
// =============================
getPlayerData = function(playerName){
    // returns player data object for given player name
    for (var i = 0; i < window.gameData.players.length; i++) {
        if( window.gameData.players[i].name == playerName ){
            return window.gameData.players[i];
        }
    }
    // if name not found
    throw new Error("player '" + playerName + "' not found");
}
// =============================


// ================================
// === choose-a-player dropdown ===
// ================================
$(document).on("gameDataLoaded", function () {
    var listItems = '<option selected="selected" value="0">- Select -</option>';

    for (var i = 0; i < window.gameData.players.length; i++) {
         listItems += "<option value='" + window.gameData.players[i].name + "'>"
            + window.gameData.players[i].name
            + "</option>";
    }

    $("#player-selector").html(listItems);
});

$("#player-selector").on("change", function(evt){
    var player = $("#player-selector").val();
    try{
        var playerData = getPlayerData(player);
        $("#main-controls").show();
        $("#raw-player-save").html( JSON.stringify(playerData));
    } catch(err){
        $("#main-controls").hide();
        $("#raw-player-save").html( "ERR: " +err.message );
        throw err;
    }


});

// ================================
