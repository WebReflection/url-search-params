function URLSearchParams(query) {
  for (var
    name, value, pair,
    pairs = (query || '').split('&'),
    i = 0,
    length = pairs.length; i < length; i++
  ) {
    pair = pairs[i].split('=');
    this.append(
      decodeURIComponent(pair[0]),
      decodeURIComponent(pair[1] || '')
    );
  }
}

URLSearchParams.prototype.append = function append(name, value) {
  this[name] = this.has(name) ?
    [].concat(this[name], '' + value) :
    '' + value;
};

URLSearchParams.prototype.delete = function del(name) {
  delete this[name];
};

URLSearchParams.prototype.get = function get(name) {
  var value = this[name];
  return this.has(name) ?
    (typeof value === 'string' ? value : value[0]) :
    null;
};

URLSearchParams.prototype.getAll = function getAll(name) {
  var value = this[name];
  return this.has(name) ?
    (typeof value === 'string' ? [value] : value) :
    [];
};

URLSearchParams.prototype.has = URLSearchParams.prototype.hasOwnProperty;

URLSearchParams.prototype.set = function set(name, value) {
  this[name] = '' + value;
};

URLSearchParams.prototype.toJSON = function toJSON() {
  return {};
};

URLSearchParams.prototype.toString = function toString() {
  var query = [], i, name, value;
  for (name in this) {
    if (this.has(name)) {
      name = encodeURIComponent(name);
      for (
        i = 0,
        value = [].concat(this[name]);
        i < value.length; i++
      ) {
        query.push(name + '=' + encodeURIComponent(value[i]));
      }
    }
  }
  return query.join('&');
};