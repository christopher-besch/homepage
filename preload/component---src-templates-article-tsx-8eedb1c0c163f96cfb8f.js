(self.webpackChunkhomepage=self.webpackChunkhomepage||[]).push([[235],{9100:function(e,t,r){var n=r(9489),o=r(7067);function a(t,r,u){return o()?(e.exports=a=Reflect.construct,e.exports.__esModule=!0,e.exports.default=e.exports):(e.exports=a=function(e,t,r){var o=[null];o.push.apply(o,t);var a=new(Function.bind.apply(e,o));return r&&n(a,r.prototype),a},e.exports.__esModule=!0,e.exports.default=e.exports),a.apply(null,arguments)}e.exports=a,e.exports.__esModule=!0,e.exports.default=e.exports},7067:function(e){e.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}},e.exports.__esModule=!0,e.exports.default=e.exports},7490:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return u}});var n=r(7294),o=r(8536),a=r(8125),u=function(e){var t,r,u,c,l,i,d,s,p,f,v,m=null===(t=e.data.mdx)||void 0===t||null===(r=t.frontmatter)||void 0===r?void 0:r.version,x=null===(u=e.data.mdx)||void 0===u?void 0:u.body,y=null===(c=e.data.mdx)||void 0===c||null===(l=c.frontmatter)||void 0===l?void 0:l.title,b=/^0\./.test(m)?"Draft v"+m:void 0,h=null===(i=e.data.mdx)||void 0===i||null===(d=i.frontmatter)||void 0===d?void 0:d.description,O=null===(s=e.data.mdx)||void 0===s||null===(p=s.frontmatter)||void 0===p?void 0:p.banner,j=O&&"undefined"!=O?O:void 0,g=null===(f=e.data.mdx)||void 0===f||null===(v=f.frontmatter)||void 0===v?void 0:v.date;return n.createElement(o.Z,{heading:y,sub_heading:b,description:h,banner:j},n.createElement("div",{className:"article-module--metadata--ZlRP4"},n.createElement("span",{className:"article-module--author--lZLsU"},"Written by Christopher Besch, published on "),g),n.createElement("div",{className:"markdown-module--markdown_body--61IIy"},n.createElement(a.MDXRenderer,null,x)))}},8125:function(e,t,r){var n=r(6899);e.exports={MDXRenderer:n}},6899:function(e,t,r){var n=r(9100),o=r(319),a=r(9713),u=r(7316),c=["scope","children"];function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var d=r(7294),s=r(4983).mdx,p=r(5862).useMDXScope;e.exports=function(e){var t=e.scope,r=e.children,a=u(e,c),l=p(t),f=d.useMemo((function(){if(!r)return null;var e=i({React:d,mdx:s},l),t=Object.keys(e),a=t.map((function(t){return e[t]}));return n(Function,["_fn"].concat(o(t),[""+r])).apply(void 0,[{}].concat(o(a)))}),[r,t]);return d.createElement(f,i({},a))}}}]);
//# sourceMappingURL=component---src-templates-article-tsx-8eedb1c0c163f96cfb8f.js.map