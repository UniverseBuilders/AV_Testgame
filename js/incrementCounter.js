function incrementCounter(){
    // gets the raw game save json increments the counter, POSTS the data
    $.get( "gameData/currentGame.json", function( data ) {
        window.currentGame = data;
        window.currentGame["counter"] += 1;

        $.post( "/uploadCurrentGame", window.currentGame, function( response ) {
            alert('new game json uploaded');
            res.send('success');
        });

    });
}

showRawSave('#raw-save')