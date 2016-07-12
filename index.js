/**
 * Disables all login when in minified production code, else allows
 * all logging to happen (when presumably in dev).
 *
 * Trick from https://blog.mariusschulz.com/2015/04/08/detecting-minified-javascript-code
 *
 * @type {number}
 */
const LOG_LEVEL = /not minified/.test(() => { /* not minified */ }) ? 3 : 0;
const LOG_METHODS = [
  'error',
  'warn',
  'log',
  'debug',
];
const noop = () => {};

const supportsGroup = !! window.console.group;
let consoleGroup = null;
let consoleTimeout = null;

/**
 * Creates a console object
 * @param reference
 * @returns {{}}
 */
function consoleFactory(...reference) {
  const console = {};
  let logLevel = LOG_LEVEL;

  if (typeof reference[reference.length - 1] === 'number') {
    logLevel = reference.splice(reference.length - 1, 1);
    if (LOG_LEVEL < logLevel) {
      logLevel = LOG_LEVEL;
    }
  }

  const module = `CasinoFlix#${reference.join('/')}:`;

  LOG_METHODS.forEach((method, level) => {
    if (level <= logLevel) {
    if (supportsGroup) {
      console[method] = function (...args) {
        if (consoleGroup !== module) {
          if (consoleGroup !== null) {
            window.console.groupEnd();
            clearTimeout(consoleTimeout);
          }

          window.console.group(module);

          consoleGroup = module;

          consoleTimeout = setTimeout(() => {
              window.console.groupEnd();
          consoleGroup = null;
        }, 16);
        }

        return window.console[method].apply(window.console, args);
      };
    } else {
      console[method] = function (...args) {
        return window.console[method].apply(window.console, [module].concat(...args));
      };
    }
  } else {
    // Suppress
    console[method] = noop;
  }
});

  return console;
}

export default consoleFactory;