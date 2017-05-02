
if (!('sort' in URLSearchParams.prototype)) {
  URLSearchParams.prototype.sort = function sort() {
    var
      entries = this.entries(),
      entry = entries.next(),
      done = entry.done,
      keys = [],
      values = Object.create(null),
      i, key, value
    ;
    while (!done) {
      value = entry.value;
      key = value[0];
      keys.push(key);
      if (!(key in values)) {
        values[key] = [];
      }
      values[key].push(value[1]);
      entry = entries.next();
      done = entry.done;
    }
    // not the champion in efficiency
    // but these two bits just do the job
    keys.sort();
    for (i = 0; i < keys.length; i++) {
      this.delete(keys[i]);
    }
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      this.append(key, values[key].shift());
    }
  };
}
