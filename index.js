'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Disables all login when in minified production code, else allows
 * all logging to happen (when presumably in dev).
 *
 * Trick from https://blog.mariusschulz.com/2015/04/08/detecting-minified-javascript-code
 *
 * @type {number}
 */
var LOG_LEVEL = /not minified/.test(function () {/* not minified */
}) ? 3 : 0;
var LOG_METHODS = ['error', 'warn', 'log', 'debug'];
var noop = function noop() {};

var _console = console;

var supportsGroup = !!_console.group;
var consoleGroup = null;
var consoleTimeout = null;

/**
 * Creates a console object
 * @param reference
 * @returns {{}}
 */
function consoleFactory() {
  var console = {};
  var logLevel = LOG_LEVEL;

  for (var _len = arguments.length, reference = Array(_len), _key = 0; _key < _len; _key++) {
    reference[_key] = arguments[_key];
  }

  if (typeof reference[reference.length - 1] === 'number') {
    logLevel = reference.splice(reference.length - 1, 1);
    if (LOG_LEVEL < logLevel) {
      logLevel = LOG_LEVEL;
    }
  }

  var module = '#' + reference.join('/') + ':';

  LOG_METHODS.forEach(function (method, level) {
    if (level <= logLevel) {
      if (supportsGroup) {
        console[method] = function () {
          if (consoleGroup !== module) {
            if (consoleGroup !== null) {
              _console.groupEnd();
              clearTimeout(consoleTimeout);
            }

            _console.group(module);

            consoleGroup = module;

            consoleTimeout = setTimeout(function () {
              _console.groupEnd();
              consoleGroup = null;
            }, 16);
          }

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return (_console[method] || _console['log']).apply(_console, args);
        };
      } else {
        console[method] = function () {
          var _ref;

          return (_console[method] || _console['log']).apply(_console, (_ref = [module]).concat.apply(_ref, arguments));
        };
      }
    } else {
      // Suppress
      console[method] = noop;
    }
  });

  return console;
}

exports.default = consoleFactory;