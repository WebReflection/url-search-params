url-search-params
=================

[![build status](https://secure.travis-ci.org/WebReflection/url-search-params.svg)](http://travis-ci.org/WebReflection/url-search-params) [![CDNJS version](https://img.shields.io/cdnjs/v/url-search-params.svg)](https://cdnjs.com/libraries/url-search-params) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate)

This is a polyfill for the [URLSearchParams API](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).

It is possible to simply include [build/url-search-params.js](build/url-search-params.js) or grab it via npm.

```
npm install url-search-params
```

The function is exported directly.
```js
var URLSearchParams = require('url-search-params');
```

MIT Style License

### iOS 10 + other platforms bug

In case you'd like to replace the broken global native constructor, you can check some well known issue before including this polyfill on your project/page.

```html
<script>
try { if (new URLSearchParams('q=%2B').get('q') !== '+') throw {}; }
catch (error) {
  window.URLSearchParams = void 0;
  document.write('<script src="/js/url-search-params.js"><'+'/script>');
}
</script>
```

#### About HTMLAnchorElement.prototype.searchParams
This property is already implemented in Firefox and polyfilled here only for browsers that exposes getters and setters
through the `HTMLAnchorElement.prototype`.

In order to know if such property is supported, you **must** do the check as such:
```
if ('searchParams' in HTMLAnchorElement.prototype) {
  // polyfill for <a> links supported
}
```
If you do this check instead:
```js
if (HTMLAnchorElement.prototype.searchParams) {
  // throws a TypeError
}
```
this polyfill will reflect native behavior, throwing a type error due access to a property in a non instance of `HTMLAnchorElement`.

Nothing new to learn here, [just a reminder](http://webreflection.blogspot.co.uk/2011/08/please-stop-reassigning-for-no-reason.html).
