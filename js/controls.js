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

// object with fully populated 0 values for a region
ZERO_REGION = {
    "body":undefined,
    "name":undefined,
    "resources":{
        "biomass":0,
        "metal":0,
        "energy":0
    },
    "units":{
        "greenhouse":0,
        "power plant":0,
        "mine":0
    }
}

getRegionPresence = function(params){
    // returns data object containing resources and buildings in given region on given body
    // Required params:
    //  :param:playerName : name of player
    //  :param:bodyName : name of celestial body
    //  :param:regionName : name of region on body
    // Optional params:
    // :param:mutable : true if trying to get mutable object, false||undefined if result is read-only
    var playerData = getPlayerData(params.playerName);

    for (var i = 0; i < playerData.locations.length; i++){
        if (playerData.locations[i].body == params.bodyName
            && playerData.locations[i].name == params.regionName){
            return playerData.locations[i];
        }  // else keep looking
    }
    // if not found region not settled by this player, return zero for everything
    if (typeof params.mutable === "undefined" || !params.mutable) {
        var res = ZERO_REGION;
        res.body = params.bodyName;
        res.name = params.regionName;
        return res;
    } else {  // no mutable object exists
        throw new Error("player has no presence in this region");
    }
}

buildOption = function(str){
    // returns HTML for an select option with given string as value & text
     return "<option value='" + str + "'>" + str + "</option>";
}




getProduction = function(playerName, bodyName, regionName){
    // returns current production levels for given player region
    var regionalData = getRegionPresence({"playerName":playerName, "bodyName":bodyName, "regionName":regionName});
    var production = {};

    for (buildingName in regionalData.units){
        var buildingOutput = getProductionLevels(buildingName);
        var buildingCount = regionalData.units[buildingName];
        var totalOutput = scaleResources(buildingOutput, buildingCount);
        production = sumResources(production, totalOutput);
    }
    return production;
}
// =============================


// ==============================
// === choose-a-body dropdown ===
// ==============================
$.get( "gameData/regions.json", function( data ) {
    window.regions = data;
    $(document).trigger("regionsLoaded");
});

/*
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
    $("#region-chooser").trigger("change");
});
*/
// ==============================


// ==============================
// === resource production    ===
// ==============================
/*
$("#region-chooser").on("change", function(evt){
    var player = $("#player-selector").val();
    var body = $("#body-chooser").val();
    var region = $("#region-chooser").val();

    $("#production-summary").html(JSON.stringify(getProduction( player, body, region )));
});
*/
// ==============================


// ==============================
// ===      Region Summary    ===
// ==============================
/*
$("#region-chooser").on("change", function(evt){
    var player = $("#player-selector").val();
    var body = $("#body-chooser").val();
    var region = $("#region-chooser").val();

    var regionalData = getRegionPresence({"playerName":player, "bodyName":body, "regionName":region});

    $("#resources-summary").html(JSON.stringify(regionalData.resources));
    $("#buildings-summary").html(JSON.stringify(regionalData.units));
});
*/
// ==============================

// ==============================
// ===      turn handling     ===
// ==============================
/*
$("#turn-submit-btn").on("click", function(evt){
    var playerName = $("#player-selector").val();
    var player = getPlayerData(playerName);

    player.hasPlayed = true;

    // compute production (@ each location) for this turn
    for (locationIndex in player.locations){
        var playerLocation = player.locations[locationIndex];
        var deltaRes = getProduction( playerName, playerLocation.body, playerLocation.name );
        playerLocation.resources = sumResources(playerLocation.resources, deltaRes);
    }

    $.post( "/uploadCurrentGame", window.gameData, function( response ) {
        alert('game json uploaded');
        location.reload();
    });
});
*/

nextTurn = function(){
    // moves to the next turn
    window.gameData["turn"] = parseInt(window.gameData["turn"]) + 1;

    // reset all player-has-played booleans
    for (var i = 0; i < window.gameData.players.length; i++) {
        window.gameData.players[i].hasPlayed = false;
    }

    $.post( "/uploadCurrentGame", window.gameData, function( response ) {
        alert('game json uploaded');
        location.reload();
    });
}

/*
$(document).on("gameDataLoaded", function(evt){
    $('#current-turn').html(window.gameData.turn);
});

$(document).on("gameDataLoaded", function(evt){
    var html = "";

    for (i in gameData.players){
        var player = gameData.players[i];
        if (!player.hasPlayed || player.hasPlayed == "false"){
            html += '<i class="fa fa-square-o fa-2x"></i>';
        } else {
            html += '<i class="fa fa-check-square-o fa-2x"></i>';
        }
        html += player.name + '<br>';
    }

    $('#player-completion-list').html(html);
});
*/
// ==============================

// ==============================
// ===    construction        ===
// ==============================
/*
$("#build-stuff-btn").on("click", function(evt){
    var amount = $("#build-amount").val();
    var building = $("#selected-building").val();
    var player = $("#player-selector").val();
    var body = $("#body-chooser").val();
    var region = $("#region-chooser").val();

    try {
        var resources = getRegionPresence({"playerName": player, "bodyName": body, "regionName": region, "mutable": true}).resources;
        var cost = getBuildingCost(building);
        if (!resources_lessThanOrEq( cost, resources)){
            throw new Error('insufficient resources');
        } else {
            resources = subtractResources(resources, cost);
        }

        $(document).trigger("buildBuilding", {"playerName":player, "bodyName":body, "regionName":region, "amount":amount, "buildingName":building});
    } catch(err){
        if (err.message == "player has no presence in this region"
            || err.message == "insufficient resources"){
            alert('not enough resources to build there');
        } else {
            throw err;
        }
    }
});

$(document).on("buildBuilding", function(evt, kwargs){
    $("#actions-list").append("<li>build " + kwargs.amount + " " + kwargs.buildingName + "(s) @ " + kwargs.regionName + " on " + kwargs.bodyName);
});
*/


// ==============================

