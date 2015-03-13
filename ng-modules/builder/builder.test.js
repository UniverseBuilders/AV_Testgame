'use strict'

describe('builder helper functions', function() {
    beforeEach(module('builder'));

    /*
    beforeEach(inject(function(_build_, $gameData, $resMath){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        builder = _build_;
        gameData = $gameData;
        resMath = $resMath;
    }));
    */

    describe('build service', function() {
        var build;
        beforeEach(inject(function($injector) {
            build = $injector.get('build');
        }));

        describe('build._it base function', function() {
            it('subtracts cost from bank when cost<bank', function () {
                this.called = false;
                var callback = function (tester) {
                    tester.called = true;
                };

                var bank = {"metal": 11, "tests": 1};
                var lowCost = {"metal": 10};
                build._it(lowCost, bank, callback, this);
                expect(bank).toEqual({"metal": 1, "tests": 1});
                expect(this.called).toEqual(true);  // but we can't do this b/c async
            });

            it('subtracts cost from bank when cost==bank', function(){
                this.called = false;
                var callback = function (tester) {
                    tester.called = true;
                };

                var bank = {"metal": 11, "tests": 1};
                var equalCost = {"metal":11, "tests":1};
                build._it(equalCost, bank, callback, this);
                expect(bank).toEqual({});
                expect(this.called).toEqual(true);  // but we can't do this b/c async
            });

            it('does not work when cost > bank', function(){
                this.called = false;
                var callback = function (tester) {
                    tester.called = true;
                };

                var bank = {"metal": 11, "tests": 1};
                var highCost = {"metal":100};
                build._it(highCost, bank, callback, this);
                expect(bank).toEqual({"metal": 11, "tests": 1});
                expect(this.called).toEqual(false);  // but we can't do this b/c async
            });

            it('does not work when cost has resource not in bank', function(){
                this.called = false;
                var callback = function (tester) {
                    tester.called = true;
                };

                var bank = {"metal": 11, "tests": 1};
                var highCost2= {"metal":10, "magic":10};
                build._it(highCost2, bank, callback, this);
                expect(bank).toEqual({"metal": 11, "tests": 1});
                expect(this.called).toEqual(false);  // but we can't do this b/c async
            });
        });
    });
});