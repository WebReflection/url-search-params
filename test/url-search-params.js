//remove:
var URLSearchParams = require('../build/url-search-params.node.js');
//:remove

wru.test([
  {
    name: "main",
    test: function () {
      wru.assert(typeof URLSearchParams == "function");
    }
  }
]);
