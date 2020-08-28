/*global CodeMirror, define*/
(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') // CommonJS
    mod(require('codemirror/lib/codemirror'), require('codemirror/mode/gfm/gfm'), require('codemirror/addon/mode/overlay'));
  else if (typeof define == 'function' && define.amd) // AMD
    define(['codemirror/lib/codemirror', 'codemirror/mode/gfm/gfm', 'codemirror/addon/mode/overlay'], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {

'use strict';
require('codemirror/mode/gfm/gfm.js');

CodeMirror.defineMode('zfm', function(config, modeConfig) {
  var zfmOverlay = {
    startState: function() {
      return {
          inBrackets: false,
      };
    },
    copyState: function(s) {
      return {
        inBrackets: s.inBrackets,
      };
    },
    token: function(stream, state) {
      if(!state.inBrackets) {
        if (stream.match('[[')) {
          state.inBrackets = true;
          return null;
        }
        while (stream.next() != null && !stream.match('[[', false)) {
            /**/
        }
        return null;
      }
      else {
        while ((stream.peek()) != null) {
          if (stream.match(']]', false)) {
            state.inBrackets = false;
            return 'locallink url';
          }
          else
            stream.next();
        }
        state.inBrackets = false;
        return null;
      }
    },
  };

  var markdownConfig = {
  };
  for (var attr in modeConfig) {
    markdownConfig[attr] = modeConfig[attr];
  }
  markdownConfig.name = 'gfm';
  return CodeMirror.overlayMode(CodeMirror.getMode(config, markdownConfig), zfmOverlay);

}, 'markdown');

  CodeMirror.defineMIME('text/x-zfm', 'zfm');
});
