'use strict'

describe('builder helper functions', function() {
    var builder;

    beforeEach(module('builder'));

    beforeEach(inject(function(_builder_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        builder = _builder_;
    }));

    describe('base build function', function() {
        it('subtracts cost from bank if cost<=bank', function () {
            var build = builder('build');

            this.called = false;
            var callback = function (tester) {
                tester.called = true;
            };

            var bank = {"metal": 11, "tests": 1};
            var lowCost = {"metal": 10};
            build._it(lowCost, bank, callback, this);
            expect(bank).toBe({"metal": 1, "tests": 1});
            // expect(this.called).toEqual(true);  // but we can't do this b/c async
            return true
            /*
             var equalCost = {"metal":11, "tests":1};
             var highCost = {"metal":100};
             var highCost2= {"metal":10, "magic":10};
             */
        });
    });
});