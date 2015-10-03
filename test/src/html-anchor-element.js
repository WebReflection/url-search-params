
var
  HTMLAE = HTMLAnchorElement,
  HTMLAEProto = HTMLAE.prototype,
  dP = Object.defineProperty,
  gOPD = Object.getOwnPropertyDescriptor,
  searchParams = gOPD(HTMLAEProto, 'searchParams'),
  href = gOPD(HTMLAEProto, 'href'),
  search = gOPD(HTMLAEProto, 'search'),
  polluteSearchParams = (function () {
    /*jshint validthis:true */
    function append(name, value) {
      URLSearchParamsProto.append.call(this, name, value);
      name = this.toString();
      search.set.call(this._a, name ? ('?' + name) : '');
    }
    function del(name) {
      URLSearchParamsProto.delete.call(this, name);
      name = this.toString();
      search.set.call(this._a, name ? ('?' + name) : '');
    }
    function set(name, value) {
      URLSearchParamsProto.set.call(this, name, value);
      name = this.toString();
      search.set.call(this._a, name ? ('?' + name) : '');
    }
    return function (sp, a) {
      sp.append = append;
      sp.delete = del;
      sp.set = set;
      return dP(sp, '_a', {
        configurable: true,
        writable: true,
        value: a
      });
    };
  }()),
  createSearchParams = function (a, sp) {
    dP(
      a, '_searchParams', {
        configurable: true,
        writable: true,
        value: polluteSearchParams(sp, a)
      }
    );
    return sp;
  },
  updateSearchParams = function (sp) {
    var append = sp.append;
    sp.append = URLSearchParamsProto.append;
    URLSearchParams.call(sp, sp._a.search.slice(1));
    sp.append = append;
  },
  verifySearchParams = function (obj) {
    if (!(obj instanceof HTMLAE)) throw new TypeError(
      "'searchParams' accessed on an object that " +
      "does not implement interface HTMLAnchorElement."
    );
  }
;

if (!searchParams && search) {
  Object.defineProperties(
    HTMLAEProto,
    {
      href: {
        get: function () {
          return href.get.call(this);
        },
        set: function (value) {
          var sp = this._searchParams;
          href.set.call(this, value);
          if (sp) updateSearchParams(sp);
        }
      },
      search: {
        get: function () {
          return search.get.call(this);
        },
        set: function (value) {
          var sp = this._searchParams;
          search.set.call(this, value);
          if (sp) updateSearchParams(sp);
        }
      },
      searchParams: {
        get: function () {
          verifySearchParams(this);
          return this._searchParams || createSearchParams(
            this,
            new URLSearchParams(this.search.slice(1))
          );
        },
        set: function (sp) {
          verifySearchParams(this);
          createSearchParams(this, sp);
        }
      }
    }
  );
}


/*

function spUpdate(a) {
  var
    search = this.toString(),
    password = a.password,
    username = a.username
  ;
  a.href = ''.concat(
    a.protocol, '//',
    username,
    password ? (':' + password) : '',
    username ? '@' : '',
    a.host,
    a.pathname,
    search ? ('?' + search) : '',
    a.hash
  );
}

*/
