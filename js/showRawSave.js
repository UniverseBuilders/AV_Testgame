function showRawSave(selectorStr){
    // gets the raw game save json and inserts it into elements retrieved via given selector string
    $.get( "gameData/currentGame.json", function( data ) {
        $( selectorStr ).html( JSON.stringify(data));
        window.gameData = data;
        $(document).trigger("gameDataLoaded");
    });
}

showRawSave('#raw-save')