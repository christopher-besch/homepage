"use strict";(self.webpackChunkhomepage=self.webpackChunkhomepage||[]).push([[612],{454:function(e){var t="%[a-f0-9]{2}",n=new RegExp("("+t+")|([^%]+?)","gi"),r=new RegExp("("+t+")+","gi");function o(e,t){try{return[decodeURIComponent(e.join(""))]}catch(i){}if(1===e.length)return e;t=t||1;var n=e.slice(0,t),r=e.slice(t);return Array.prototype.concat.call([],o(n),o(r))}function i(e){try{return decodeURIComponent(e)}catch(i){for(var t=e.match(n)||[],r=1;r<t.length;r++)t=(e=o(t,r).join("")).match(n)||[];return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var n={"%FE%FF":"��","%FF%FE":"��"},o=r.exec(e);o;){try{n[o[0]]=decodeURIComponent(o[0])}catch(t){var c=i(o[0]);c!==o[0]&&(n[o[0]]=c)}o=r.exec(e)}n["%C2"]="�";for(var a=Object.keys(n),s=0;s<a.length;s++){var l=a[s];e=e.replace(new RegExp(l,"g"),n[l])}return e}(e)}}},528:function(e){e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const n=e.indexOf(t);return-1===n?[e]:[e.slice(0,n),e.slice(n+t.length)]}},3055:function(e){e.exports=function(e,t){for(var n={},r=Object.keys(e),o=Array.isArray(t),i=0;i<r.length;i++){var c=r[i],a=e[c];(o?-1!==t.indexOf(c):t(c,a,e))&&(n[c]=a)}return n}},3662:function(e,t,n){n.d(t,{T:function(){return c}});var r=n(6540),o=n(6462),i=n(6663);const c=e=>t=>r.createElement(o.Location,null,(n=>{let{location:o,navigate:c}=n;return r.createElement(e,Object.assign({},t,{location:o,navigate:c,search:o.search?i.parse(o.search):{}}))}))},4241:function(e,t,n){n.d(t,{aj:function(){return i},jH:function(){return c},nf:function(){return o},om:function(){return r}});var r="utils-module--block--dae27",o="utils-module--link--f5973",i="utils-module--main_block--4b45a",c="utils-module--spacer--54e98"},4280:function(e){e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`))},4530:function(e,t,n){n.d(t,{B2:function(){return a},DO:function(){return c},XJ:function(){return r},ZC:function(){return o},z0:function(){return i}});const r=0,o=2,i=30,c=40,a=50},6663:function(e,t,n){const r=n(4280),o=n(454),i=n(528),c=n(3055);function a(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function s(e,t){return t.encode?t.strict?r(e):encodeURIComponent(e):e}function l(e,t){return t.decode?o(e):e}function u(e){return Array.isArray(e)?e.sort():"object"==typeof e?u(Object.keys(e)).sort(((e,t)=>Number(e)-Number(t))).map((t=>e[t])):e}function d(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function m(e){const t=(e=d(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function p(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function f(e,t){a((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const n=function(e){let t;switch(e.arrayFormat){case"index":return(e,n,r)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===r[e]&&(r[e]={}),r[e][t[1]]=n):r[e]=n};case"bracket":return(e,n,r)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==r[e]?r[e]=[].concat(r[e],n):r[e]=[n]:r[e]=n};case"comma":case"separator":return(t,n,r)=>{const o="string"==typeof n&&n.includes(e.arrayFormatSeparator),i="string"==typeof n&&!o&&l(n,e).includes(e.arrayFormatSeparator);n=i?l(n,e):n;const c=o||i?n.split(e.arrayFormatSeparator).map((t=>l(t,e))):null===n?n:l(n,e);r[t]=c};default:return(e,t,n)=>{void 0!==n[e]?n[e]=[].concat(n[e],t):n[e]=t}}}(t),r=Object.create(null);if("string"!=typeof e)return r;if(!(e=e.trim().replace(/^[?#&]/,"")))return r;for(const o of e.split("&")){if(""===o)continue;let[e,c]=i(t.decode?o.replace(/\+/g," "):o,"=");c=void 0===c?null:["comma","separator"].includes(t.arrayFormat)?c:l(c,t),n(l(e,t),c,r)}for(const o of Object.keys(r)){const e=r[o];if("object"==typeof e&&null!==e)for(const n of Object.keys(e))e[n]=p(e[n],t);else r[o]=p(e,t)}return!1===t.sort?r:(!0===t.sort?Object.keys(r).sort():Object.keys(r).sort(t.sort)).reduce(((e,t)=>{const n=r[t];return Boolean(n)&&"object"==typeof n&&!Array.isArray(n)?e[t]=u(n):e[t]=n,e}),Object.create(null))}t.extract=m,t.parse=f,t.stringify=(e,t)=>{if(!e)return"";a((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const n=n=>t.skipNull&&null==e[n]||t.skipEmptyString&&""===e[n],r=function(e){switch(e.arrayFormat){case"index":return t=>(n,r)=>{const o=n.length;return void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,[s(t,e),"[",o,"]"].join("")]:[...n,[s(t,e),"[",s(o,e),"]=",s(r,e)].join("")]};case"bracket":return t=>(n,r)=>void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,[s(t,e),"[]"].join("")]:[...n,[s(t,e),"[]=",s(r,e)].join("")];case"comma":case"separator":return t=>(n,r)=>null==r||0===r.length?n:0===n.length?[[s(t,e),"=",s(r,e)].join("")]:[[n,s(r,e)].join(e.arrayFormatSeparator)];default:return t=>(n,r)=>void 0===r||e.skipNull&&null===r||e.skipEmptyString&&""===r?n:null===r?[...n,s(t,e)]:[...n,[s(t,e),"=",s(r,e)].join("")]}}(t),o={};for(const c of Object.keys(e))n(c)||(o[c]=e[c]);const i=Object.keys(o);return!1!==t.sort&&i.sort(t.sort),i.map((n=>{const o=e[n];return void 0===o?"":null===o?s(n,t):Array.isArray(o)?o.reduce(r(n),[]).join("&"):s(n,t)+"="+s(o,t)})).filter((e=>e.length>0)).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[n,r]=i(e,"#");return Object.assign({url:n.split("?")[0]||"",query:f(m(e),t)},t&&t.parseFragmentIdentifier&&r?{fragmentIdentifier:l(r,t)}:{})},t.stringifyUrl=(e,n)=>{n=Object.assign({encode:!0,strict:!0},n);const r=d(e.url).split("?")[0]||"",o=t.extract(e.url),i=t.parse(o,{sort:!1}),c=Object.assign(i,e.query);let a=t.stringify(c,n);a&&(a=`?${a}`);let l=function(e){let t="";const n=e.indexOf("#");return-1!==n&&(t=e.slice(n)),t}(e.url);return e.fragmentIdentifier&&(l=`#${s(e.fragmentIdentifier,n)}`),`${r}${a}${l}`},t.pick=(e,n,r)=>{r=Object.assign({parseFragmentIdentifier:!0},r);const{url:o,query:i,fragmentIdentifier:a}=t.parseUrl(e,r);return t.stringifyUrl({url:o,query:c(i,n),fragmentIdentifier:a},r)},t.exclude=(e,n,r)=>{const o=Array.isArray(n)?e=>!n.includes(e):(e,t)=>!n(e,t);return t.pick(e,o,r)}},7865:function(e,t,n){n.d(t,{e:function(){return r}});const r=new Map([["python",{id:"python",name:"Python",icon:"/icons/python.svg",icon_mono:"/icons/python.svg"}],["cpp",{id:"cpp",name:"C++",icon:"/icons/c-plusplus.svg",icon_mono:"/icons/c-plusplus_mono.svg"}],["typescript",{id:"typescript",name:"TypeScript",icon:"/icons/typescript-icon.svg",icon_mono:"/icons/typescript-icon_mono.svg"}],["java",{id:"java",name:"Java",icon:"/icons/java.svg",icon_mono:"/icons/java.svg"}],["rust",{id:"rust",name:"Rust",icon:"/icons/rust.svg",icon_mono:"/icons/rust.svg"}],["c",{id:"c",name:"C",icon:"/icons/c.svg",icon_mono:"/icons/c.svg"}]])},8378:function(e,t,n){n.d(t,{A:function(){return i}});var r=n(6540),o=n(2867);var i=e=>{const t=e.icon,n=e.alt?e.alt:"icon",i=e.icon_mono?e.icon_mono:t;return r.createElement("div",{className:`hover_icon-module--icon_wrapper--987b2 ${e.className}`},r.createElement("img",{className:`hover_icon-module--icon--32e2a ${e.icon_class}`,src:t,alt:n}),r.createElement("div",{className:`hover_icon-module--icon_mono--d29ed ${e.icon_mono_class}`,style:(0,o.A)(i)}))}},9208:function(e,t,n){n.d(t,{A:function(){return s},Z:function(){return a}});var r=n(2532),o=n(6540),i=n(7865),c=n(8378);function a(e){var t,n,o,c,a,s,l,u,d;return{id:e.node.id,date:null===(t=e.node.frontmatter)||void 0===t?void 0:t.date,languages:null===(n=e.node.frontmatter)||void 0===n?void 0:n.languages.map((e=>i.e.get(e))),priority:parseInt(null===(o=e.node.frontmatter)||void 0===o?void 0:o.priority),dependencies:null===(c=e.node.frontmatter)||void 0===c?void 0:c.dependencies,description:null===(a=e.node.frontmatter)||void 0===a?void 0:a.description,slug:null===(s=e.node.frontmatter)||void 0===s?void 0:s.slug,link:null===(l=e.node.frontmatter)||void 0===l?void 0:l.link,title:null===(u=e.node.frontmatter)||void 0===u?void 0:u.title,thumb:(0,r.c)(null===(d=e.node.frontmatter)||void 0===d?void 0:d.thumb)}}var s=e=>{const t=e.count;let n={"--full-width":100/t+"%","--half-width":100/Math.ceil(t/2)+"%","--quarter-width":100/Math.ceil(t/4)+"%"};return o.createElement("div",{className:`project_list-module--projects--af962 ${e.className}`},e.projects.map((e=>o.createElement("a",{href:e.link,target:"_blank",key:e.id,className:"project_list-module--project--b34f6",style:n},o.createElement("div",{className:"project_list-module--content--5f844"},o.createElement(r.G,{className:"project_list-module--image--b05ea",image:e.thumb,alt:"thumbnail"}),o.createElement("div",{className:"project_list-module--text--25836"},o.createElement("div",{className:"project_list-module--title--5f73d"},o.createElement("h2",{className:"project_list-module--heading--5ad99"},e.title),e.languages.map((t=>o.createElement(c.A,{className:"project_list-module--language_icon--5e033",key:`${e.id}${t.id}`,icon:t.icon,icon_mono:t.icon_mono,alt:t.id,icon_class:"project_list-module--icon--69fe8",icon_mono_class:"project_list-module--icon_mono--7fdf0"})))),o.createElement("hr",null),o.createElement("div",{className:"project_list-module--description--3851a"},o.createElement("p",null,e.description))))))))}}}]);
//# sourceMappingURL=c804ae579c3e2b4740c8c44db44e41913c869de7-1b8139dfcb7dc4425cd6.js.map