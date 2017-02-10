(function(global, Tester) {
'use strict';

var tester;

tester = new Tester(global.document.getElementById('tester'));

global.tester = tester;
}(this, this.Tester));
