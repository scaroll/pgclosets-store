// Server-side polyfills for browser globals
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
  global.window = {};
  global.document = {};
  global.navigator = { userAgent: 'Node.js' };
}