(self.webpackChunkhomepage=self.webpackChunkhomepage||[]).push([[351],{7228:function(e){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},2858:function(e){e.exports=function(e){if(Array.isArray(e))return e},e.exports.__esModule=!0,e.exports.default=e.exports},3646:function(e,t,r){var n=r(7228);e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},9713:function(e){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},e.exports.__esModule=!0,e.exports.default=e.exports},6860:function(e){e.exports=function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},3884:function(e){e.exports=function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a=[],i=!0,c=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);i=!0);}catch(u){c=!0,o=u}finally{try{i||null==r.return||r.return()}finally{if(c)throw o}}return a}},e.exports.__esModule=!0,e.exports.default=e.exports},521:function(e){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},8206:function(e){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},3038:function(e,t,r){var n=r(2858),o=r(3884),a=r(379),i=r(521);e.exports=function(e,t){return n(e)||o(e,t)||a(e,t)||i()},e.exports.__esModule=!0,e.exports.default=e.exports},319:function(e,t,r){var n=r(3646),o=r(6860),a=r(379),i=r(8206);e.exports=function(e){return n(e)||o(e)||a(e)||i()},e.exports.__esModule=!0,e.exports.default=e.exports},379:function(e,t,r){var n=r(7228);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports},7091:function(e){"use strict";var t="%[a-f0-9]{2}",r=new RegExp(t,"gi"),n=new RegExp("("+t+")+","gi");function o(e,t){try{return decodeURIComponent(e.join(""))}catch(a){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],o(r),o(n))}function a(e){try{return decodeURIComponent(e)}catch(a){for(var t=e.match(r),n=1;n<t.length;n++)t=(e=o(t,n).join("")).match(r);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var r={"%FE%FF":"��","%FF%FE":"��"},o=n.exec(e);o;){try{r[o[0]]=decodeURIComponent(o[0])}catch(t){var i=a(o[0]);i!==o[0]&&(r[o[0]]=i)}o=n.exec(e)}r["%C2"]="�";for(var c=Object.keys(r),u=0;u<c.length;u++){var l=c[u];e=e.replace(new RegExp(l,"g"),r[l])}return e}(e)}}},8616:function(e){"use strict";e.exports=function(e,t){for(var r={},n=Object.keys(e),o=Array.isArray(t),a=0;a<n.length;a++){var i=n[a],c=e[i];(o?-1!==t.indexOf(i):t(i,c,e))&&(r[i]=c)}return r}},2203:function(e,t,r){"use strict";var n=r(9713),o=r(3038),a=r(319);function i(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return c(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return c(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return i=e.done,e},e:function(e){u=!0,a=e},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw a}}}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var u=r(8936),l=r(7091),s=r(4734),f=r(8616),p=Symbol("encodeFragmentIdentifier");function d(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function m(e,t){return t.encode?t.strict?u(e):encodeURIComponent(e):e}function y(e,t){return t.decode?l(e):e}function h(e){return Array.isArray(e)?e.sort():"object"==typeof e?h(Object.keys(e)).sort((function(e,t){return Number(e)-Number(t)})).map((function(t){return e[t]})):e}function b(e){var t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function g(e){var t=(e=b(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function v(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function E(e,t){d((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);var r=function(e){var t;switch(e.arrayFormat){case"index":return function(e,r,n){t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return function(e,r,n){t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"colon-list-separator":return function(e,r,n){t=/(:list)$/.exec(e),e=e.replace(/:list$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return function(t,r,n){var o="string"==typeof r&&r.includes(e.arrayFormatSeparator),a="string"==typeof r&&!o&&y(r,e).includes(e.arrayFormatSeparator);r=a?y(r,e):r;var i=o||a?r.split(e.arrayFormatSeparator).map((function(t){return y(t,e)})):null===r?r:y(r,e);n[t]=i};case"bracket-separator":return function(t,r,n){var o=/(\[\])$/.test(t);if(t=t.replace(/\[\]$/,""),o){var a=null===r?[]:r.split(e.arrayFormatSeparator).map((function(t){return y(t,e)}));void 0!==n[t]?n[t]=[].concat(n[t],a):n[t]=a}else n[t]=r?y(r,e):r};default:return function(e,t,r){void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;var a,c=i(e.split("&"));try{for(c.s();!(a=c.n()).done;){var u=a.value;if(""!==u){var l=s(t.decode?u.replace(/\+/g," "):u,"="),f=o(l,2),p=f[0],m=f[1];m=void 0===m?null:["comma","separator","bracket-separator"].includes(t.arrayFormat)?m:y(m,t),r(y(p,t),m,n)}}}catch(O){c.e(O)}finally{c.f()}for(var b=0,g=Object.keys(n);b<g.length;b++){var E=g[b],T=n[E];if("object"==typeof T&&null!==T)for(var w=0,A=Object.keys(T);w<A.length;w++){var x=A[w];T[x]=v(T[x],t)}else n[E]=v(T,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce((function(e,t){var r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=h(r):e[t]=r,e}),Object.create(null))}t.extract=g,t.parse=E,t.stringify=function(e,t){if(!e)return"";d((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);for(var r=function(r){return t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r]},n=function(e){switch(e.arrayFormat){case"index":return function(t){return function(r,n){var o=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:[].concat(a(r),null===n?[[m(t,e),"[",o,"]"].join("")]:[[m(t,e),"[",m(o,e),"]=",m(n,e)].join("")])}};case"bracket":return function(t){return function(r,n){return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:[].concat(a(r),null===n?[[m(t,e),"[]"].join("")]:[[m(t,e),"[]=",m(n,e)].join("")])}};case"colon-list-separator":return function(t){return function(r,n){return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:[].concat(a(r),null===n?[[m(t,e),":list="].join("")]:[[m(t,e),":list=",m(n,e)].join("")])}};case"comma":case"separator":case"bracket-separator":var t="bracket-separator"===e.arrayFormat?"[]=":"=";return function(r){return function(n,o){return void 0===o||e.skipNull&&null===o||e.skipEmptyString&&""===o?n:(o=null===o?"":o,0===n.length?[[m(r,e),t,m(o,e)].join("")]:[[n,m(o,e)].join(e.arrayFormatSeparator)])}};default:return function(t){return function(r,n){return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:[].concat(a(r),null===n?[m(t,e)]:[[m(t,e),"=",m(n,e)].join("")])}}}}(t),o={},i=0,c=Object.keys(e);i<c.length;i++){var u=c[i];r(u)||(o[u]=e[u])}var l=Object.keys(o);return!1!==t.sort&&l.sort(t.sort),l.map((function(r){var o=e[r];return void 0===o?"":null===o?m(r,t):Array.isArray(o)?0===o.length&&"bracket-separator"===t.arrayFormat?m(r,t)+"[]":o.reduce(n(r),[]).join("&"):m(r,t)+"="+m(o,t)})).filter((function(e){return e.length>0})).join("&")},t.parseUrl=function(e,t){t=Object.assign({decode:!0},t);var r=s(e,"#"),n=o(r,2),a=n[0],i=n[1];return Object.assign({url:a.split("?")[0]||"",query:E(g(e),t)},t&&t.parseFragmentIdentifier&&i?{fragmentIdentifier:y(i,t)}:{})},t.stringifyUrl=function(e,r){r=Object.assign(n({encode:!0,strict:!0},p,!0),r);var o=b(e.url).split("?")[0]||"",a=t.extract(e.url),i=t.parse(a,{sort:!1}),c=Object.assign(i,e.query),u=t.stringify(c,r);u&&(u="?".concat(u));var l=function(e){var t="",r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);return e.fragmentIdentifier&&(l="#".concat(r[p]?m(e.fragmentIdentifier,r):e.fragmentIdentifier)),"".concat(o).concat(u).concat(l)},t.pick=function(e,r,o){o=Object.assign(n({parseFragmentIdentifier:!0},p,!1),o);var a=t.parseUrl(e,o),i=a.url,c=a.query,u=a.fragmentIdentifier;return t.stringifyUrl({url:i,query:f(c,r),fragmentIdentifier:u},o)},t.exclude=function(e,r,n){var o=Array.isArray(r)?function(e){return!r.includes(e)}:function(e,t){return!r(e,t)};return t.pick(e,o,n)}},2993:function(e){var t="undefined"!=typeof Element,r="function"==typeof Map,n="function"==typeof Set,o="function"==typeof ArrayBuffer&&!!ArrayBuffer.isView;function a(e,i){if(e===i)return!0;if(e&&i&&"object"==typeof e&&"object"==typeof i){if(e.constructor!==i.constructor)return!1;var c,u,l,s;if(Array.isArray(e)){if((c=e.length)!=i.length)return!1;for(u=c;0!=u--;)if(!a(e[u],i[u]))return!1;return!0}if(r&&e instanceof Map&&i instanceof Map){if(e.size!==i.size)return!1;for(s=e.entries();!(u=s.next()).done;)if(!i.has(u.value[0]))return!1;for(s=e.entries();!(u=s.next()).done;)if(!a(u.value[1],i.get(u.value[0])))return!1;return!0}if(n&&e instanceof Set&&i instanceof Set){if(e.size!==i.size)return!1;for(s=e.entries();!(u=s.next()).done;)if(!i.has(u.value[0]))return!1;return!0}if(o&&ArrayBuffer.isView(e)&&ArrayBuffer.isView(i)){if((c=e.length)!=i.length)return!1;for(u=c;0!=u--;)if(e[u]!==i[u])return!1;return!0}if(e.constructor===RegExp)return e.source===i.source&&e.flags===i.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===i.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===i.toString();if((c=(l=Object.keys(e)).length)!==Object.keys(i).length)return!1;for(u=c;0!=u--;)if(!Object.prototype.hasOwnProperty.call(i,l[u]))return!1;if(t&&e instanceof Element)return!1;for(u=c;0!=u--;)if(("_owner"!==l[u]&&"__v"!==l[u]&&"__o"!==l[u]||!e.$$typeof)&&!a(e[l[u]],i[l[u]]))return!1;return!0}return e!=e&&i!=i}e.exports=function(e,t){try{return a(e,t)}catch(r){if((r.message||"").match(/stack|recursion/i))return console.warn("react-fast-compare cannot handle circular refs"),!1;throw r}}},4839:function(e,t,r){"use strict";var n,o=r(7294),a=(n=o)&&"object"==typeof n&&"default"in n?n.default:n;function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var c=!("undefined"==typeof window||!window.document||!window.document.createElement);e.exports=function(e,t,r){if("function"!=typeof e)throw new Error("Expected reducePropsToState to be a function.");if("function"!=typeof t)throw new Error("Expected handleStateChangeOnClient to be a function.");if(void 0!==r&&"function"!=typeof r)throw new Error("Expected mapStateOnServer to either be undefined or a function.");return function(n){if("function"!=typeof n)throw new Error("Expected WrappedComponent to be a React component.");var u,l=[];function s(){u=e(l.map((function(e){return e.props}))),f.canUseDOM?t(u):r&&(u=r(u))}var f=function(e){var t,r;function o(){return e.apply(this,arguments)||this}r=e,(t=o).prototype=Object.create(r.prototype),t.prototype.constructor=t,t.__proto__=r,o.peek=function(){return u},o.rewind=function(){if(o.canUseDOM)throw new Error("You may only call rewind() on the server. Call peek() to read the current state.");var e=u;return u=void 0,l=[],e};var i=o.prototype;return i.UNSAFE_componentWillMount=function(){l.push(this),s()},i.componentDidUpdate=function(){s()},i.componentWillUnmount=function(){var e=l.indexOf(this);l.splice(e,1),s()},i.render=function(){return a.createElement(n,this.props)},o}(o.PureComponent);return i(f,"displayName","SideEffect("+function(e){return e.displayName||e.name||"Component"}(n)+")"),i(f,"canUseDOM",c),f}}},4734:function(e){"use strict";e.exports=function(e,t){if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];var r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}},8936:function(e){"use strict";e.exports=function(e){return encodeURIComponent(e).replace(/[!'()*]/g,(function(e){return"%".concat(e.charCodeAt(0).toString(16).toUpperCase())}))}},5804:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});var n=r(7294),o=r(7208),a=function(e){return n.createElement("div",{className:"heading-module--heading--2iUAG "+e.className},n.createElement("h1",null,e.heading,e.icon?n.createElement("span",{className:"heading-module--icon--Kb+tp",style:(0,o.Z)(e.icon)}):void 0),n.createElement("span",{className:"heading-module--sub_heading---FgTH"},e.sub_heading),n.createElement("hr",null))}},2896:function(e,t,r){"use strict";r.d(t,{Z:function(){return Ee}});var n,o,a,i,c=r(5444),u=r(7294),l=r(5697),s=r.n(l),f=r(4839),p=r.n(f),d=r(2993),m=r.n(d),y=r(6494),h=r.n(y),b="bodyAttributes",g="htmlAttributes",v="titleAttributes",E={BASE:"base",BODY:"body",HEAD:"head",HTML:"html",LINK:"link",META:"meta",NOSCRIPT:"noscript",SCRIPT:"script",STYLE:"style",TITLE:"title"},T=(Object.keys(E).map((function(e){return E[e]})),"charset"),w="cssText",A="href",x="http-equiv",O="innerHTML",S="itemprop",j="name",C="property",k="rel",I="src",N="target",_={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},P="defaultTitle",M="defer",L="encodeSpecialCharacters",F="onChangeClientState",R="titleTemplate",U=Object.keys(_).reduce((function(e,t){return e[_[t]]=t,e}),{}),B=[E.NOSCRIPT,E.SCRIPT,E.STYLE],q="data-react-helmet",D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},H=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},$=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),Y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},K=function(e,t){var r={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n]);return r},z=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},Z=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return!1===t?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")},W=function(e){var t=X(e,E.TITLE),r=X(e,R);if(r&&t)return r.replace(/%s/g,(function(){return Array.isArray(t)?t.join(""):t}));var n=X(e,P);return t||n||void 0},V=function(e){return X(e,F)||function(){}},G=function(e,t){return t.filter((function(t){return void 0!==t[e]})).map((function(t){return t[e]})).reduce((function(e,t){return Y({},e,t)}),{})},J=function(e,t){return t.filter((function(e){return void 0!==e[E.BASE]})).map((function(e){return e[E.BASE]})).reverse().reduce((function(t,r){if(!t.length)for(var n=Object.keys(r),o=0;o<n.length;o++){var a=n[o].toLowerCase();if(-1!==e.indexOf(a)&&r[a])return t.concat(r)}return t}),[])},Q=function(e,t,r){var n={};return r.filter((function(t){return!!Array.isArray(t[e])||(void 0!==t[e]&&oe("Helmet: "+e+' should be of type "Array". Instead found type "'+D(t[e])+'"'),!1)})).map((function(t){return t[e]})).reverse().reduce((function(e,r){var o={};r.filter((function(e){for(var r=void 0,a=Object.keys(e),i=0;i<a.length;i++){var c=a[i],u=c.toLowerCase();-1===t.indexOf(u)||r===k&&"canonical"===e[r].toLowerCase()||u===k&&"stylesheet"===e[u].toLowerCase()||(r=u),-1===t.indexOf(c)||c!==O&&c!==w&&c!==S||(r=c)}if(!r||!e[r])return!1;var l=e[r].toLowerCase();return n[r]||(n[r]={}),o[r]||(o[r]={}),!n[r][l]&&(o[r][l]=!0,!0)})).reverse().forEach((function(t){return e.push(t)}));for(var a=Object.keys(o),i=0;i<a.length;i++){var c=a[i],u=h()({},n[c],o[c]);n[c]=u}return e}),[]).reverse()},X=function(e,t){for(var r=e.length-1;r>=0;r--){var n=e[r];if(n.hasOwnProperty(t))return n[t]}return null},ee=(n=Date.now(),function(e){var t=Date.now();t-n>16?(n=t,e(t)):setTimeout((function(){ee(e)}),0)}),te=function(e){return clearTimeout(e)},re="undefined"!=typeof window?window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||ee:r.g.requestAnimationFrame||ee,ne="undefined"!=typeof window?window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||te:r.g.cancelAnimationFrame||te,oe=function(e){return console&&"function"==typeof console.warn&&console.warn(e)},ae=null,ie=function(e,t){var r=e.baseTag,n=e.bodyAttributes,o=e.htmlAttributes,a=e.linkTags,i=e.metaTags,c=e.noscriptTags,u=e.onChangeClientState,l=e.scriptTags,s=e.styleTags,f=e.title,p=e.titleAttributes;le(E.BODY,n),le(E.HTML,o),ue(f,p);var d={baseTag:se(E.BASE,r),linkTags:se(E.LINK,a),metaTags:se(E.META,i),noscriptTags:se(E.NOSCRIPT,c),scriptTags:se(E.SCRIPT,l),styleTags:se(E.STYLE,s)},m={},y={};Object.keys(d).forEach((function(e){var t=d[e],r=t.newTags,n=t.oldTags;r.length&&(m[e]=r),n.length&&(y[e]=d[e].oldTags)})),t&&t(),u(e,m,y)},ce=function(e){return Array.isArray(e)?e.join(""):e},ue=function(e,t){void 0!==e&&document.title!==e&&(document.title=ce(e)),le(E.TITLE,t)},le=function(e,t){var r=document.getElementsByTagName(e)[0];if(r){for(var n=r.getAttribute(q),o=n?n.split(","):[],a=[].concat(o),i=Object.keys(t),c=0;c<i.length;c++){var u=i[c],l=t[u]||"";r.getAttribute(u)!==l&&r.setAttribute(u,l),-1===o.indexOf(u)&&o.push(u);var s=a.indexOf(u);-1!==s&&a.splice(s,1)}for(var f=a.length-1;f>=0;f--)r.removeAttribute(a[f]);o.length===a.length?r.removeAttribute(q):r.getAttribute(q)!==i.join(",")&&r.setAttribute(q,i.join(","))}},se=function(e,t){var r=document.head||document.querySelector(E.HEAD),n=r.querySelectorAll(e+"["+"data-react-helmet]"),o=Array.prototype.slice.call(n),a=[],i=void 0;return t&&t.length&&t.forEach((function(t){var r=document.createElement(e);for(var n in t)if(t.hasOwnProperty(n))if(n===O)r.innerHTML=t.innerHTML;else if(n===w)r.styleSheet?r.styleSheet.cssText=t.cssText:r.appendChild(document.createTextNode(t.cssText));else{var c=void 0===t[n]?"":t[n];r.setAttribute(n,c)}r.setAttribute(q,"true"),o.some((function(e,t){return i=t,r.isEqualNode(e)}))?o.splice(i,1):a.push(r)})),o.forEach((function(e){return e.parentNode.removeChild(e)})),a.forEach((function(e){return r.appendChild(e)})),{oldTags:o,newTags:a}},fe=function(e){return Object.keys(e).reduce((function(t,r){var n=void 0!==e[r]?r+'="'+e[r]+'"':""+r;return t?t+" "+n:n}),"")},pe=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,r){return t[_[r]||r]=e[r],t}),t)},de=function(e,t,r){switch(e){case E.TITLE:return{toComponent:function(){return e=t.title,r=t.titleAttributes,(n={key:e})[q]=!0,o=pe(r,n),[u.createElement(E.TITLE,o,e)];var e,r,n,o},toString:function(){return function(e,t,r,n){var o=fe(r),a=ce(t);return o?"<"+e+' data-react-helmet="true" '+o+">"+Z(a,n)+"</"+e+">":"<"+e+' data-react-helmet="true">'+Z(a,n)+"</"+e+">"}(e,t.title,t.titleAttributes,r)}};case b:case g:return{toComponent:function(){return pe(t)},toString:function(){return fe(t)}};default:return{toComponent:function(){return function(e,t){return t.map((function(t,r){var n,o=((n={key:r})[q]=!0,n);return Object.keys(t).forEach((function(e){var r=_[e]||e;if(r===O||r===w){var n=t.innerHTML||t.cssText;o.dangerouslySetInnerHTML={__html:n}}else o[r]=t[e]})),u.createElement(e,o)}))}(e,t)},toString:function(){return function(e,t,r){return t.reduce((function(t,n){var o=Object.keys(n).filter((function(e){return!(e===O||e===w)})).reduce((function(e,t){var o=void 0===n[t]?t:t+'="'+Z(n[t],r)+'"';return e?e+" "+o:o}),""),a=n.innerHTML||n.cssText||"",i=-1===B.indexOf(e);return t+"<"+e+' data-react-helmet="true" '+o+(i?"/>":">"+a+"</"+e+">")}),"")}(e,t,r)}}}},me=function(e){var t=e.baseTag,r=e.bodyAttributes,n=e.encode,o=e.htmlAttributes,a=e.linkTags,i=e.metaTags,c=e.noscriptTags,u=e.scriptTags,l=e.styleTags,s=e.title,f=void 0===s?"":s,p=e.titleAttributes;return{base:de(E.BASE,t,n),bodyAttributes:de(b,r,n),htmlAttributes:de(g,o,n),link:de(E.LINK,a,n),meta:de(E.META,i,n),noscript:de(E.NOSCRIPT,c,n),script:de(E.SCRIPT,u,n),style:de(E.STYLE,l,n),title:de(E.TITLE,{title:f,titleAttributes:p},n)}},ye=p()((function(e){return{baseTag:J([A,N],e),bodyAttributes:G(b,e),defer:X(e,M),encode:X(e,L),htmlAttributes:G(g,e),linkTags:Q(E.LINK,[k,A],e),metaTags:Q(E.META,[j,T,x,C,S],e),noscriptTags:Q(E.NOSCRIPT,[O],e),onChangeClientState:V(e),scriptTags:Q(E.SCRIPT,[I,O],e),styleTags:Q(E.STYLE,[w],e),title:W(e),titleAttributes:G(v,e)}}),(function(e){ae&&ne(ae),e.defer?ae=re((function(){ie(e,(function(){ae=null}))})):(ie(e),ae=null)}),me)((function(){return null})),he=(o=ye,i=a=function(e){function t(){return H(this,t),z(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.shouldComponentUpdate=function(e){return!m()(this.props,e)},t.prototype.mapNestedChildrenToProps=function(e,t){if(!t)return null;switch(e.type){case E.SCRIPT:case E.NOSCRIPT:return{innerHTML:t};case E.STYLE:return{cssText:t}}throw new Error("<"+e.type+" /> elements are self-closing and can not contain children. Refer to our API for more information.")},t.prototype.flattenArrayTypeChildren=function(e){var t,r=e.child,n=e.arrayTypeChildren,o=e.newChildProps,a=e.nestedChildren;return Y({},n,((t={})[r.type]=[].concat(n[r.type]||[],[Y({},o,this.mapNestedChildrenToProps(r,a))]),t))},t.prototype.mapObjectTypeChildren=function(e){var t,r,n=e.child,o=e.newProps,a=e.newChildProps,i=e.nestedChildren;switch(n.type){case E.TITLE:return Y({},o,((t={})[n.type]=i,t.titleAttributes=Y({},a),t));case E.BODY:return Y({},o,{bodyAttributes:Y({},a)});case E.HTML:return Y({},o,{htmlAttributes:Y({},a)})}return Y({},o,((r={})[n.type]=Y({},a),r))},t.prototype.mapArrayTypeChildrenToProps=function(e,t){var r=Y({},t);return Object.keys(e).forEach((function(t){var n;r=Y({},r,((n={})[t]=e[t],n))})),r},t.prototype.warnOnInvalidChildren=function(e,t){return!0},t.prototype.mapChildrenToProps=function(e,t){var r=this,n={};return u.Children.forEach(e,(function(e){if(e&&e.props){var o=e.props,a=o.children,i=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,r){return t[U[r]||r]=e[r],t}),t)}(K(o,["children"]));switch(r.warnOnInvalidChildren(e,a),e.type){case E.LINK:case E.META:case E.NOSCRIPT:case E.SCRIPT:case E.STYLE:n=r.flattenArrayTypeChildren({child:e,arrayTypeChildren:n,newChildProps:i,nestedChildren:a});break;default:t=r.mapObjectTypeChildren({child:e,newProps:t,newChildProps:i,nestedChildren:a})}}})),t=this.mapArrayTypeChildrenToProps(n,t)},t.prototype.render=function(){var e=this.props,t=e.children,r=K(e,["children"]),n=Y({},r);return t&&(n=this.mapChildrenToProps(t,n)),u.createElement(o,n)},$(t,null,[{key:"canUseDOM",set:function(e){o.canUseDOM=e}}]),t}(u.Component),a.propTypes={base:s().object,bodyAttributes:s().object,children:s().oneOfType([s().arrayOf(s().node),s().node]),defaultTitle:s().string,defer:s().bool,encodeSpecialCharacters:s().bool,htmlAttributes:s().object,link:s().arrayOf(s().object),meta:s().arrayOf(s().object),noscript:s().arrayOf(s().object),onChangeClientState:s().func,script:s().arrayOf(s().object),style:s().arrayOf(s().object),title:s().string,titleAttributes:s().object,titleTemplate:s().string},a.defaultProps={defer:!0,encodeSpecialCharacters:!0},a.peek=o.peek,a.rewind=function(){var e=o.rewind();return e||(e=me({baseTag:[],bodyAttributes:{},encodeSpecialCharacters:!0,htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}})),e},i);he.renderStatic=he.rewind;var be=r(1499),ge=r(5804),ve="layout-module--link--8S4u4",Ee=(0,be.E)((function(e){var t,r,n,o,a=(0,c.K2)("1751226025"),i=null===(t=a.site)||void 0===t||null===(r=t.siteMetadata)||void 0===r?void 0:r.source,l=null===(n=a.site)||void 0===n||null===(o=n.siteMetadata)||void 0===o?void 0:o.address,s=e.heading?e.heading+"—Christopher Besch":"Christopher Besch—Software Developer",f=e.description,p=e.banner;return u.createElement("div",null,u.createElement(he,{htmlAttributes:{lang:"en"}},u.createElement("meta",{charSet:"utf-8"}),u.createElement("meta",{property:"og:url",content:e.location.href}),u.createElement("meta",{property:"og:title",content:s}),f?u.createElement("meta",{property:"og:description",content:f}):void 0,p?u.createElement("meta",{property:"og:image",content:p}):void 0,u.createElement("meta",{name:"twitter:card",content:p?"summary_large_image":"summary"}),u.createElement("meta",{name:"twitter:site",content:"@besch_chris"}),u.createElement("meta",{name:"twitter:creator",content:"@besch_chris"}),u.createElement("meta",{name:"author",content:"Christopher Besch"}),u.createElement("meta",{name:"description",content:s}),u.createElement("title",null,s),u.createElement("link",{rel:"canonical",href:l}),u.createElement("link",{rel:"shortcut icon",href:"/favicon.png"})),u.createElement("nav",{className:"layout-module--nav--ma0SR"},u.createElement("div",{className:"layout-module--logo--9Ozid"},u.createElement("h1",null,"Christopher Besch"),u.createElement("h2",null,"Software Developer")),u.createElement("div",null,u.createElement("input",{type:"checkbox",id:"nav_toggle"}),u.createElement("label",{htmlFor:"nav_toggle",className:"layout-module--hamburger--h7E0E"},"☰"),u.createElement("ul",{className:"layout-module--nav_menu--uoKLm"},u.createElement("li",null,u.createElement(c.rU,{to:"/"},"Home")),u.createElement("li",null,u.createElement(c.rU,{to:"/projects"},"Projects")),u.createElement("li",null,u.createElement(c.rU,{to:"/about"},"About")),u.createElement("li",null,u.createElement(c.rU,{to:"/articles"},"Articles"))))),u.createElement("div",{className:"layout-module--content--u4In+"},e.heading?u.createElement(ge.Z,{heading:e.heading,icon:e.icon,sub_heading:e.sub_heading}):void 0,e.children),u.createElement("footer",{className:"layout-module--footer--4b3+4"},u.createElement("ul",null,u.createElement("li",{className:ve},u.createElement(c.rU,{to:"/about"},"Contact")),u.createElement("li",{className:ve},u.createElement("a",{href:i,target:"_blank"},"Source")),u.createElement("li",{className:ve},u.createElement(c.rU,{to:"/privacy"},"Privacy")),u.createElement("li",null,u.createElement("p",null,"© 2022")),u.createElement("li",{className:"layout-module--emoji--Mxypj"},u.createElement("p",null,"🔗")))))}))},7208:function(e,t,r){"use strict";function n(e){return{maskImage:'url("'+e+'")',WebkitMaskImage:'url("'+e+'")'}}r.d(t,{Z:function(){return n}})},1499:function(e,t,r){"use strict";r.d(t,{E:function(){return i}});var n=r(7294),o=r(9499),a=r(2203),i=function(e){return function(t){return n.createElement(o.Location,null,(function(r){var o=r.location,i=r.navigate;return n.createElement(e,Object.assign({},t,{location:o,navigate:i,search:o.search?a.parse(o.search):{}}))}))}}}}]);
//# sourceMappingURL=commons-0a1f09ee3782f44c0ebd.js.map