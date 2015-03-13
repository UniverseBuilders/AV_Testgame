'use strict'

var selectDropdownbyNum = function ( element, optionNum ) {
    if (optionNum){
        var options = element.findElements(by.tagName('option'))
            .then(function(options){
                options[optionNum].click();
            });
    }
};

var pickFirstPlayer = function(browser){
    var el = browser.findElement(by.model('playCtrl.playerID'));
    selectDropdownbyNum(el, 1);
};

var pickHomeRegion = function(browser){
    browser.element(by.model('playCtrl.selectedBodyID')).sendKeys('Earth');
    browser.element(by.model('playCtrl.selectedRegionClass')).sendKeys('surface');
    browser.element(by.model('playCtrl.selectedTerritory')).sendKeys('USA-SouthEast');
};

describe('player selection', function() {
    it('should show region selector when player selected', function () {
        browser.get('/');
        expect(element(by.id('region-select-box')).isDisplayed()).toBeFalsy();
        pickFirstPlayer(browser);
        expect(element(by.id('region-select-box')).isDisplayed()).toBeTruthy();
    });
});

describe('region selection', function(){
   it('should show region overview for the home region', function(){
       browser.get('/');
       pickFirstPlayer(browser);
       expect(element(by.id('region-overview')).isDisplayed()).toBeFalsy();
       pickHomeRegion(browser);
       expect(element(by.id('region-overview')).isDisplayed()).toBeTruthy();
   });
});

/* TODO?
describe('district claim', function(){
    it('should add a new region to the overview when built'){

    };
});
*/