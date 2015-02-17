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

getRegionPresence = function(playerName, bodyName, regionName){
    // returns data object containing resources and buildings in given region on given body
    var playerData = getPlayerData(playerName);

    for (var i = 0; i < playerData.locations.length; i++){
        if (playerData.locations[i].body == bodyName
            && playerData.locations[i].name == regionName){
            return playerData.locations[i];
        }  // else keep looking
    }
    // if not found region not settled by this player, return zero for everything
    var res = ZERO_REGION;
    res.body = bodyName;
    res.name = regionName;
    return res;
}

addBuildings = function( playerName, bodyName, regionName, amount, buildingName){
    var data = getRegionPresence(playerName, bodyName, regionName);

    // add building to count
    if (typeof buildingName === undefined){
        data.units[buildingName] = amount;
    } else {
        data.units[buildingName] = parseInt(data.units[buildingName]) + parseInt(amount);
    }
}

buildOption = function(str){
    // returns HTML for an select option with given string as value & text
     return "<option value='" + str + "'>" + str + "</option>";
}

getProductionLevels = function(buildingName){
    // returns the resource production levels for named building from unitProductions lookupTable

    //TODO: use lookupTable instead of the following switch

    switch(buildingName) {
        case "greenhouse":
            return {"biomass":2, "energy":-2};
        case "power plant":
            return {"energy": 1};
        case "mine":
            return {"biomass":-1, "energy":-1, "metal":1}
        default:
            throw new Error("unrecognized building name: " + buildingName);
    }
}

sumResources = function(r1, r2){
    // returns sum of resources in r2 to r1
    // (for max efficiency r2 should be the shorter of the two lists)
    var _res = {};
    // res = copy(r1)
    for (resKey in r1){
        _res[resKey] = r1[resKey];
    }
    // res += r2
    for (resKey in r2){
        if (typeof _res[resKey] === "undefined"){
            _res[resKey] = parseInt(r2[resKey]);
        } else {
            _res[resKey] = parseInt(_res[resKey]) + parseInt(r2[resKey]);
        }
    }
    return _res;
}

getProduction = function(playerName, bodyName, regionName){
    // returns current production levels for given player region
    var regionalData = getRegionPresence(playerName, bodyName, regionName);
    var production = {};

    for (buildingName in regionalData.units){
        var buildingOutput = getProductionLevels(buildingName);
        production = sumResources(production, buildingOutput);
    }
    return production;
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
        $("#raw-player-save").html( JSON.stringify(playerData));
        $("#body-chooser").trigger("change");
        if (!playerData.hasPlayed || playerData.hasPlayed == "false"){
            $("#main-controls").show();
            $("#turn-complete").hide();
        } else {
            $("#turn-complete").show();
            $("#main-controls").hide();
        }

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
    $("#region-chooser").trigger("change");
});
// ==============================


// ==============================
// === resource production    ===
// ==============================
$("#region-chooser").on("change", function(evt){
    var player = $("#player-selector").val();
    var body = $("#body-chooser").val();
    var region = $("#region-chooser").val();

    $("#production-summary").html(JSON.stringify(getProduction( player, body, region )));
});
// ==============================


// ==============================
// ===      Region Summary    ===
// ==============================
$("#region-chooser").on("change", function(evt){
    var player = $("#player-selector").val();
    var body = $("#body-chooser").val();
    var region = $("#region-chooser").val();

    var regionalData = getRegionPresence(player, body, region);

    $("#resources-summary").html(JSON.stringify(regionalData.resources));
    $("#buildings-summary").html(JSON.stringify(regionalData.units));
});
// ==============================

// ==============================
// ===      turn handling     ===
// ==============================
$("#turn-submit-btn").on("click", function(evt){
    var playerName = $("#player-selector").val();
    var player = getPlayerData(playerName);

    player.hasPlayed = true;

    // compute production (@ each location) for this turn
    for (locationIndex in player.locations){
        var location = player.locations[locationIndex];
        var deltaRes = getProduction( playerName, location.body, location.name );
        location.resources = sumResources(location.resources, deltaRes);
    }

    $.post( "/uploadCurrentGame", window.gameData, function( response ) {
        response.send('success');
        location.reload();
    });
});

nextTurn = function(){
    // moves to the next turn
    window.gameData["turn"] = parseInt(window.gameData["turn"]) + 1;

    // reset all player-has-played booleans
    for (var i = 0; i < window.gameData.players.length; i++) {
        window.gameData.players[i].hasPlayed = false;
    }

    $.post( "/uploadCurrentGame", window.gameData, function( response ) {
        alert('new game json uploaded');
        response.send('success');
    });
}

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
// ==============================

// ==============================
// ===    construction        ===
// ==============================
$("#build-stuff-btn").on("click", function(evt){
    var amount = $("#build-amount").val();
    var building = $("#selected-building").val();
    var player = $("#player-selector").val();
    var body = $("#body-chooser").val();
    var region = $("#region-chooser").val();

    // TODO: subtract resources

    $(document).trigger("buildBuilding", {"playerName":player, "bodyName":body, "regionName":region, "amount":amount, "buildingName":building});
});

$(document).on("buildBuilding", function(evt, kwargs){
    addBuildings(kwargs.playerName, kwargs.bodyName, kwargs.regionName, kwargs.amount, kwargs.buildingName);
});

$(document).on("buildBuilding", function(evt, kwargs){
    $("#actions-list").append("<li>build " + kwargs.amount + " " + kwargs.buildingName + "(s)");
});

// reset the action list on player switch WARN: this doesn't actually undo the actions
$("#player-selector").on("change", function(evt){
    $("#actions-list").html("<li>TURN START</li>");
});
// ==============================

