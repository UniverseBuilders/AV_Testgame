$.get( "package.json", function( data ) {
    window.appData = data;
    $('.versionNumber').html(data.version);
});