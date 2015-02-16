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

buildOption = function(str){
    // returns HTML for an select option with given string as value & text
     return "<option value='" + str + "'>" + str + "</option>";
}
// =============================


// ================================
// === choose-a-player dropdown ===
// ================================
$(document).on("gameDataLoaded", function () {
    var listItems = '<option selected="selected" value="0">- Select -</option>';

    for (var i = 0; i < window.gameData.players.length; i++) {
         listItems += buildOption(window.gameData.players[i].name);
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


// ==============================
// === choose-a-body dropdown ===
// ==============================
$.get( "gameData/regions.json", function( data ) {
    window.regions = data;
    $(document).trigger("regionsLoaded");
});

$(document).on("regionsLoaded", function () {
    var listItems = '';

    for (region in window.regions){
        listItems += buildOption(region);
    }

    $("#body-chooser").html(listItems);
    $("#body-chooser").trigger("change");
});

$("#body-chooser").on("change", function(evt){
    // update territory box
    var body = window.regions[$("#body-chooser").val()];

    var listItems = '';
    for (var i = 0; i < body.orbit.length; i++){
        listItems += buildOption(body.orbit[i]);
    }
    for (var i = 0; i < body.atmospheric.length; i++){
        listItems += buildOption(body.atmospheric[i]);
    }
    for (var i = 0; i < body.surface.length; i++){
        listItems += buildOption(body.surface[i]);
    }

    $("#region-chooser").html(listItems);
});

// ==============================