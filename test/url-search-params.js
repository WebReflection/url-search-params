//remove:
var URLSearchParams = require('../build/url-search-params.node.js');
//:remove

wru.test([
  {
    name: "main",
    test: function () {
      wru.assert(/^function|object$/.test(typeof URLSearchParams));
    }
  }, {
    name: 'basics with leading "?"',
    test: function () {
      var usp = new URLSearchParams('a=1&b=2&c');
      wru.assert('has keys', usp.has('a') && usp.has('b') && usp.has('c'));
      wru.assert('a returns right value', usp.get('a') === '1');
      wru.assert('b returns right value', usp.get('b') === '2');
      wru.assert('c returns right value', usp.get('c') === '');
      wru.assert('a getAll returns right value', usp.getAll('a').join(',') === '1');
      wru.assert('b getAll returns right value', usp.getAll('b').join(',') === '2');
      wru.assert('c getAll returns right value', usp.getAll('c').join(',') === '');
      usp.append('a', '3');
      wru.assert('append adds values', usp.getAll('a').join(',') === '1,3');
      wru.assert('append preserves get', usp.get('a') === '1');
      wru.assert('append does not affect others', usp.getAll('b').join(',') === '2' && usp.getAll('c').join(',') === '');
      usp.set('a', '4');
      wru.assert('set overwrites known values', usp.getAll('a').join(',') === '4');
      usp['delete']('a');
      wru.assert('usp can delete', usp.has('a') === false);
      wru.assert('usp can return null', usp.get('a') === null);
      wru.assert('usp to string works as expected', usp.toString() === 'b=2&c=');
    }
  }, {
    name: 'basics with leading "?"',
    test: function () {
      var usp = new URLSearchParams('?a=1&b=2');
      wru.assert('has keys', usp.has('a') && usp.has('b'));
      wru.assert('a returns right value', usp.get('a') === '1');
      wru.assert('b returns right value', usp.get('b') === '2');
      wru.assert('a getAll returns right value', usp.getAll('a').join(',') === '1');
      wru.assert('b getAll returns right value', usp.getAll('b').join(',') === '2');
      usp.append('a', '3');
      wru.assert('append adds values', usp.getAll('a').join(',') === '1,3');
      wru.assert('append preserves get', usp.get('a') === '1');
      wru.assert('append does not affect others', usp.getAll('b').join(',') === '2');
      usp.set('a', '4');
      wru.assert('set overwrites known values', usp.getAll('a').join(',') === '4');
      usp['delete']('a');
      wru.assert('usp can delete', usp.has('a') === false);
      wru.assert('usp can return null', usp.get('a') === null);
      wru.assert('usp to string works as expected', usp.toString() === 'b=2');
    }
  }, {
    name: 'edge cases',
    test: function () {
      var usp = new URLSearchParams();
      var badString = '\x20\x21\x27\x28\x29\x7E';
      usp.append('a', badString);
      wru.assert('correct a value', usp.get('a') === badString);
      wru.assert('correct a escaping', usp.toString() === 'a=+%21%27%28%29%7E');
      usp.append(badString, badString);
      wru.assert('correct badString value', usp.get(badString) === badString);
      usp['delete']('a');
      wru.assert('usp can delete', usp.has('a') === false);
      wru.assert('usp can return null', usp.get('a') === null);
      wru.assert('correct badString escaping', usp.toString() === '+%21%27%28%29%7E=+%21%27%28%29%7E');
    }
  }, {
    name: 'parsing when creating',
    test: function () {
      var unescaped = '!';
      var escaped = encodeURIComponent(unescaped);
      var usp = new URLSearchParams(escaped + '=' + unescaped);
      wru.assert('correct ! escaping', usp.toString() === '%21=%21');
      wru.assert('correct ! key', usp.has('!'));
      wru.assert('correct ! value', usp.get('!') === '!');
      unescaped = '&';
      escaped = encodeURIComponent(unescaped);
      usp = new URLSearchParams(escaped + '=' + unescaped);
      wru.assert('correct & escaping', usp.toString() === '%26=');
      wru.assert('correct & key', usp.has('&'));
      wru.assert('correct & value', usp.get('&') === '');
      usp = new URLSearchParams('a=12=3');
      wru.assert('correct escaping', usp.toString() === 'a=12%3D3');
      wru.assert('correct value', usp.get('a') === '12=3');
    }
  }, {
    name: 'iterating with keys',
    test: function () {
      var usp = new URLSearchParams('a=1&a=2&b=3');
      var iterator = usp.keys()

      var next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value === 'a');

      next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value === 'a');

      next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value === 'b');

      next = iterator.next();
      wru.assert('correct iterator value', next.done);
      wru.assert('correct iterator value', next.value === undefined);
    }
  }, {
    name: 'iterating with values',
    test: function () {
      var usp = new URLSearchParams('a=1&a=2&b=3');
      var iterator = usp.values()

      var next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value === '1');

      next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value === '2');

      next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value === '3');

      next = iterator.next();
      wru.assert('correct iterator value', next.done);
      wru.assert('correct iterator value', next.value === undefined);
    }
  }, {
    name: 'iterating with entries',
    test: function () {
      var usp = new URLSearchParams('a=1&a=2&b=3');
      var iterator = usp.entries()

      var next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value[0] === 'a' && next.value[1] === '1');

      next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value[0] === 'a' && next.value[1] === '2');

      next = iterator.next();
      wru.assert('correct iterator value', !next.done);
      wru.assert('correct iterator value', next.value[0] === 'b' && next.value[1] === '3');

      next = iterator.next();
      wru.assert('correct iterator value', next.done);
      wru.assert('correct iterator value', next.value === undefined);
    }
  }, {
    name: 'iterating with forEach',
    test: function () {
      var usp = new URLSearchParams('a=1&a=2&b=3');

      var results = [];
      usp.forEach(function(value, key, object) {
        results.push({value: value, key: key, object: object});
      });

      wru.assert('correct loop count', results.length === 3);

      wru.assert('correct loop key', results[0].key === 'a');
      wru.assert('correct loop value', results[0].value === '1');
      wru.assert('correct loop object', results[0].object === usp);

      wru.assert('correct loop key', results[1].key === 'a');
      wru.assert('correct loop value', results[1].value === '2');
      wru.assert('correct loop object', results[1].object === usp);

      wru.assert('correct loop key', results[2].key === 'b');
      wru.assert('correct loop value', results[2].value === '3');
      wru.assert('correct loop object', results[2].object === usp);
    }
  }
].concat(
  /^function|object$/.test(typeof HTMLAnchorElement) && ('searchParams' in HTMLAnchorElement.prototype) ?
  [{
    name: 'HTMLAnchorElement',
    test: function () {
      var a = document.createElement('a');
      var sp = a.searchParams;
      wru.assert('instance exists', sp instanceof URLSearchParams);
      wru.assert('sp is an empty string', sp.toString() === '');
      a.href = '?a=1';
      wru.assert('sp changed', sp.toString() === 'a=1');
      sp.append('other', 'value');
      wru.assert('a changed', a.search === '?a=1&other=value');
    }
  }] : []
));
