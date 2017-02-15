(function(global, CodeMirror) {
'use strict';

function Tester(testerForm) {
  testerForm.innerHTML = [
    '<p class="error-message"></p>',
    '<label>Pattern: <input type="text" class="pattern"></label>',
    '<textarea class="corpus"></textarea>'
  ].join('\n');

  this.corpusField = testerForm.querySelector('.corpus');
  this.editor = CodeMirror.fromTextArea(this.corpusField);
  this.errorField = testerForm.querySelector('.error-message');
  this.patternField = testerForm.querySelector('.pattern');
  this.testerForm = testerForm;

  this.bindEvents();
  this.clearError();
};

Tester.prototype.bindEvents = function bindEvents() {
  var ignoreSubmit = Tester.prototype.ignoreSubmit.bind(this),
    update = Tester.prototype.update.bind(this);

  this.editor.on('change', update);
  this.patternField.addEventListener('keypress', ignoreSubmit);
  this.patternField.addEventListener('keyup', update);
};

Tester.prototype.clearError = function clearErrors() {
  this.errorField.textContent = '';
  this.testerForm.classList.remove('error');
};

Tester.prototype.clearMatches = function clearMatches() {
  this.editor.getAllMarks().forEach(function(mark) {
    mark.clear();
  });
};

Tester.prototype.error = function error(message) {
  this.errorField.textContent = message;
  this.testerForm.classList.add('error');
};

Tester.prototype.findMatches = function findMatches() {
  // Based on example from https://mzl.la/2jVEJWo
  var allMatches = [],
    danger,
    fullText,
    pattern,
    thisMatch;

  this.clearError();

  try {
    pattern = new RegExp(this.patternField.value, 'g');
  }
  catch (e) {
    this.error(this.formatRegExpError(e));
    return [];
  }

  fullText = this.editor.getValue();
  while ((thisMatch = pattern.exec(fullText)) != null) {
    // Break before attempting to work with infinite matches.
    if (thisMatch[0].length === 0) {
      this.error('Matches literally everything');
      return [];
    }

    allMatches.push({
      match: thisMatch[0],
      start: thisMatch.index,
      end: thisMatch.index + thisMatch[0].length - 1,
      groups: thisMatch.slice(1)
    });
  }

  return allMatches;
};

Tester.prototype.formatRegExpError = function formatRegExpError(exc) {
  var messageComponents = exc.message.split(': ');
  return messageComponents.slice(-1)[0];
};

Tester.prototype.highlightMatches = function highlightMatches(matches) {
  var highlightClass = 'match';
  this.clearMatches();
  matches.forEach(function(matchObj) {
    var end = this.editor.posFromIndex(matchObj.end + 1),
      start = this.editor.posFromIndex(matchObj.start);

    this.editor.markText(start, end, {
      className: highlightClass
    });
  }, this);
};

Tester.prototype.ignoreSubmit = function ignoreSubmit(ev) {
  // From http://stackoverflow.com/a/16062620/803749
  var code = ev.keyCode || ev.which;
  if (code === 13) {
    ev.preventDefault();
    return false;
  }
};

Tester.prototype.setText = function setText(newText) {
  this.editor.setValue(newText);
  this.update();
};

Tester.prototype.update = function update() {
  var matches;

  if (this.patternField.value === '') {
    this.clearError();
    this.clearMatches();
    return;
  }

  matches = this.findMatches();
  this.highlightMatches(matches);
};

global.Tester = Tester;
}(this, this.CodeMirror));
