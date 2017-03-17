'use strict';

function URLSearchParams(query) {
  var
    index, key, value,
    pairs, i, length,
    dict = Object.create(null)
  ;
  this[secret] = dict;
  if (!query) return;
  if (typeof query === 'string') {
    if (query.charAt(0) === '?') {
      query = query.slice(1);
    }
    for (
      pairs = query.split('&'),
      i = 0,
      length = pairs.length; i < length; i++
    ) {
      value = pairs[i];
      index = value.indexOf('=');
      if (-1 < index) {
        appendTo(
          dict,
          decode(value.slice(0, index)),
          decode(value.slice(index + 1))
        );
      } else if (value.length){
        appendTo(
          dict,
          decode(value),
          ''
        );
      }
    }
  } else {
    if (isArray(query)) {
      for (
        i = 0,
        length = query.length; i < length; i++
      ) {
        value = query[i];
        appendTo(dict, value[0], value[1]);
      }
    } else {
      for (key in query) {
         appendTo(dict, key, query[key]);
      }
    }
  }
}

var
  isArray = Array.isArray,
  URLSearchParamsProto = URLSearchParams.prototype,
  find = /[!'\(\)~]|%20|%00/g,
  plus = /\+/g,
  replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  },
  replacer = function (match) {
    return replace[match];
  },
  iterable = isIterable(),
  secret = '__URLSearchParams__:' + Math.random()
;

function appendTo(dict, name, value) {
  if (name in dict) {
    dict[name].push('' + value);
  } else {
    dict[name] = isArray(value) ? value : ['' + value];
  }
}

function decode(str) {
  return decodeURIComponent(str.replace(plus, ' '));
}

function encode(str) {
  return encodeURIComponent(str).replace(find, replacer);
}

function isIterable() {
  try {
    return !!Symbol.iterator;
  } catch(error) {
    return false;
  }
}

URLSearchParamsProto.append = function append(name, value) {
  appendTo(this[secret], name, value);
};

URLSearchParamsProto.delete = function del(name) {
  delete this[secret][name];
};

URLSearchParamsProto.get = function get(name) {
  var dict = this[secret];
  return name in dict ? dict[name][0] : null;
};

URLSearchParamsProto.getAll = function getAll(name) {
  var dict = this[secret];
  return name in dict ? dict[name].slice(0) : [];
};

URLSearchParamsProto.has = function has(name) {
  return name in this[secret];
};

URLSearchParamsProto.set = function set(name, value) {
  this[secret][name] = ['' + value];
};

URLSearchParamsProto.forEach = function forEach(callback, thisArg) {
  var dict = this[secret];
  Object.getOwnPropertyNames(dict).forEach(function(name) {
    dict[name].forEach(function(value) {
      callback.call(thisArg, value, name, this);
    }, this);
  }, this);
};

URLSearchParamsProto.keys = function keys() {
  var items = [];
  this.forEach(function(value, name) { items.push(name); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

URLSearchParamsProto.values = function values() {
  var items = [];
  this.forEach(function(value) { items.push(value); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

URLSearchParamsProto.entries = function entries() {
  var items = [];
  this.forEach(function(value, name) { items.push([name, value]); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

if (iterable) {
  URLSearchParamsProto[Symbol.iterator] = URLSearchParamsProto.entries;
}

/*
URLSearchParamsProto.toBody = function() {
  return new Blob(
    [this.toString()],
    {type: 'application/x-www-form-urlencoded'}
  );
};
*/

URLSearchParamsProto.toJSON = function toJSON() {
  return {};
};

URLSearchParamsProto.toString = function toString() {
  var dict = this[secret], query = [], i, key, name, value;
  for (key in dict) {
    name = encode(key);
    for (
      i = 0,
      value = dict[key];
      i < value.length; i++
    ) {
      query.push(name + '=' + encode(value[i]));
    }
  }
  return query.join('&');
};
