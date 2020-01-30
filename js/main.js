(function(global, document, BodySwitcher, Tester) {
'use strict';

var bodiesForm = document.getElementById('bodies'),
  bodySwitcher,
  tester,
  testerForm = document.getElementById('tester');

// Wire up the regex experimentation environment.
tester = new Tester(testerForm);

// Load pieces of sample text and connect them to the environment.
bodySwitcher = new BodySwitcher(bodiesForm, tester);

// FIXME: Remove these testing variables.
global.tester = tester;
global.bodySwitcher = bodySwitcher;
}(this, this.document, this.BodySwitcher, this.Tester));
