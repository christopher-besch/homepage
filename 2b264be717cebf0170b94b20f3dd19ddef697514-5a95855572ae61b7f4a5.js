"use strict";(self.webpackChunkhomepage=self.webpackChunkhomepage||[]).push([[809],{72:function(e){var t=function(e,t){if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");t=Object.assign({pascalCase:!1},t);var a;return e=Array.isArray(e)?e.map((function(e){return e.trim()})).filter((function(e){return e.length})).join("-"):e.trim(),0===e.length?"":1===e.length?t.pascalCase?e.toUpperCase():e.toLowerCase():(e!==e.toLowerCase()&&(e=function(e){for(var t=!1,a=!1,n=!1,r=0;r<e.length;r++){var i=e[r];t&&/[a-zA-Z]/.test(i)&&i.toUpperCase()===i?(e=e.slice(0,r)+"-"+e.slice(r),t=!1,n=a,a=!0,r++):a&&n&&/[a-zA-Z]/.test(i)&&i.toLowerCase()===i?(e=e.slice(0,r-1)+"-"+e.slice(r-1),n=a,a=!1,t=!0):(t=i.toLowerCase()===i&&i.toUpperCase()!==i,n=a,a=i.toUpperCase()===i&&i.toLowerCase()!==i)}return e}(e)),e=e.replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,(function(e,t){return t.toUpperCase()})).replace(/\d+(\w|$)/g,(function(e){return e.toUpperCase()})),a=e,t.pascalCase?a.charAt(0).toUpperCase()+a.slice(1):a)};e.exports=t,e.exports.default=t},3723:function(e,t,a){a.d(t,{G:function(){return O},L:function(){return h},M:function(){return C},P:function(){return w},_:function(){return l},a:function(){return o},b:function(){return u},c:function(){return c},g:function(){return d},h:function(){return s}});var n=a(7294),r=(a(72),a(5697)),i=a.n(r);function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e},o.apply(this,arguments)}function l(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)t.indexOf(a=i[n])>=0||(r[a]=e[a]);return r}var s=function(){return"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype};var c=function(e){var t;return function(e){var t,a;return Boolean(null==e||null==(t=e.images)||null==(a=t.fallback)?void 0:a.src)}(e)?e:function(e){return Boolean(null==e?void 0:e.gatsbyImageData)}(e)?e.gatsbyImageData:function(e){return Boolean(null==e?void 0:e.gatsbyImage)}(e)?e.gatsbyImage:null==e||null==(t=e.childImageSharp)?void 0:t.gatsbyImageData};function u(e,t,a,n,r){return void 0===r&&(r={}),o({},a,{loading:n,shouldLoad:e,"data-main-image":"",style:o({},r,{opacity:t?1:0})})}function d(e,t,a,n,r,i,l,s){var c={};i&&(c.backgroundColor=i,"fixed"===a?(c.width=n,c.height=r,c.backgroundColor=i,c.position="relative"):("constrained"===a||"fullWidth"===a)&&(c.position="absolute",c.top=0,c.left=0,c.bottom=0,c.right=0)),l&&(c.objectFit=l),s&&(c.objectPosition=s);var u=o({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:o({opacity:t?0:1,transition:"opacity 500ms linear"},c)});return u}var m,g=["children"],p=function(e){var t=e.layout,a=e.width,r=e.height;return"fullWidth"===t?n.createElement("div",{"aria-hidden":!0,style:{paddingTop:r/a*100+"%"}}):"constrained"===t?n.createElement("div",{style:{maxWidth:a,display:"block"}},n.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:"data:image/svg+xml;charset=utf-8,%3Csvg height='"+r+"' width='"+a+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E",style:{maxWidth:"100%",display:"block",position:"static"}})):null},h=function(e){var t=e.children,a=l(e,g);return n.createElement(n.Fragment,null,n.createElement(p,o({},a)),t,null)},f=["src","srcSet","loading","alt","shouldLoad"],v=["fallback","sources","shouldLoad"],y=function(e){var t=e.src,a=e.srcSet,r=e.loading,i=e.alt,s=void 0===i?"":i,c=e.shouldLoad,u=l(e,f);return n.createElement("img",o({},u,{decoding:"async",loading:r,src:c?t:void 0,"data-src":c?void 0:t,srcSet:c?a:void 0,"data-srcset":c?void 0:a,alt:s}))},E=function(e){var t=e.fallback,a=e.sources,r=void 0===a?[]:a,i=e.shouldLoad,s=void 0===i||i,c=l(e,v),u=c.sizes||(null==t?void 0:t.sizes),d=n.createElement(y,o({},c,t,{sizes:u,shouldLoad:s}));return r.length?n.createElement("picture",null,r.map((function(e){var t=e.media,a=e.srcSet,r=e.type;return n.createElement("source",{key:t+"-"+r+"-"+a,type:r,media:t,srcSet:s?a:void 0,"data-srcset":s?void 0:a,sizes:u})})),d):d};y.propTypes={src:r.string.isRequired,alt:r.string.isRequired,sizes:r.string,srcSet:r.string,shouldLoad:r.bool},E.displayName="Picture",E.propTypes={alt:r.string.isRequired,shouldLoad:r.bool,fallback:r.exact({src:r.string.isRequired,srcSet:r.string,sizes:r.string}),sources:r.arrayOf(r.oneOfType([r.exact({media:r.string.isRequired,type:r.string,sizes:r.string,srcSet:r.string.isRequired}),r.exact({media:r.string,type:r.string.isRequired,sizes:r.string,srcSet:r.string.isRequired})]))};var b=["fallback"],w=function(e){var t=e.fallback,a=l(e,b);return t?n.createElement(E,o({},a,{fallback:{src:t},"aria-hidden":!0,alt:""})):n.createElement("div",o({},a))};w.displayName="Placeholder",w.propTypes={fallback:r.string,sources:null==(m=E.propTypes)?void 0:m.sources,alt:function(e,t,a){return e[t]?new Error("Invalid prop `"+t+"` supplied to `"+a+"`. Validation failed."):null}};var C=function(e){return n.createElement(n.Fragment,null,n.createElement(E,o({},e)),n.createElement("noscript",null,n.createElement(E,o({},e,{shouldLoad:!0}))))};C.displayName="MainImage",C.propTypes=E.propTypes;var k,L,S=function(e,t,a){for(var n=arguments.length,r=new Array(n>3?n-3:0),o=3;o<n;o++)r[o-3]=arguments[o];return e.alt||""===e.alt?i().string.apply(i(),[e,t,a].concat(r)):new Error('The "alt" prop is required in '+a+'. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html')},N={image:i().object.isRequired,alt:S},_=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],I=["style","className"],x=new Set,T=function(e){var t=e.as,r=void 0===t?"div":t,i=e.image,c=e.style,u=e.backgroundColor,d=e.className,m=e.class,g=e.onStartLoad,p=e.onLoad,h=e.onError,f=l(e,_),v=i.width,y=i.height,E=i.layout,b=function(e,t,a){var n={},r="gatsby-image-wrapper";return"fixed"===a?(n.width=e,n.height=t):"constrained"===a&&(r="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:r,"data-gatsby-image-wrapper":"",style:n}}(v,y,E),w=b.style,C=b.className,S=l(b,I),N=(0,n.useRef)(),T=(0,n.useMemo)((function(){return JSON.stringify(i.images)}),[i.images]);m&&(d=m);var O=function(e,t,a){var n="";return"fullWidth"===e&&(n='<div aria-hidden="true" style="padding-top: '+a/t*100+'%;"></div>'),"constrained"===e&&(n='<div style="max-width: '+t+'px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg height=\''+a+"' width='"+t+"' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E%3C/svg%3E\" style=\"max-width: 100%; display: block; position: static;\"></div>"),n}(E,v,y);return(0,n.useEffect)((function(){k||(k=Promise.all([a.e(774),a.e(217)]).then(a.bind(a,9217)).then((function(e){var t=e.renderImageToString,a=e.swapPlaceholderImage;return L=t,{renderImageToString:t,swapPlaceholderImage:a}})));var e,t,n=N.current.querySelector("[data-gatsby-image-ssr]");return n&&s()?(n.complete?(null==g||g({wasCached:!0}),null==p||p({wasCached:!0}),setTimeout((function(){n.removeAttribute("data-gatsby-image-ssr")}),0)):(null==g||g({wasCached:!0}),n.addEventListener("load",(function e(){n.removeEventListener("load",e),null==p||p({wasCached:!0}),setTimeout((function(){n.removeAttribute("data-gatsby-image-ssr")}),0)}))),void x.add(T)):L&&x.has(T)?void 0:(k.then((function(a){var n=a.renderImageToString,r=a.swapPlaceholderImage;N.current&&(N.current.innerHTML=n(o({isLoading:!0,isLoaded:x.has(T),image:i},f)),x.has(T)||(e=requestAnimationFrame((function(){N.current&&(t=r(N.current,T,x,c,g,p,h))}))))})),function(){e&&cancelAnimationFrame(e),t&&t()})}),[i]),(0,n.useLayoutEffect)((function(){x.has(T)&&L&&(N.current.innerHTML=L(o({isLoading:x.has(T),isLoaded:x.has(T),image:i},f)),null==g||g({wasCached:!0}),null==p||p({wasCached:!0}))}),[i]),(0,n.createElement)(r,o({},S,{style:o({},w,c,{backgroundColor:u}),className:C+(d?" "+d:""),ref:N,dangerouslySetInnerHTML:{__html:O},suppressHydrationWarning:!0}))},O=(0,n.memo)((function(e){return e.image?(0,n.createElement)(T,e):null}));O.propTypes=N,O.displayName="GatsbyImage";var A,j=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"],q=function(e,t){for(var a=arguments.length,n=new Array(a>2?a-2:0),r=2;r<a;r++)n[r-2]=arguments[r];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?i().number.apply(i(),[e,t].concat(n)):new Error('"'+t+'" '+e[t]+" may not be passed when layout is fullWidth.")},M=new Set(["fixed","fullWidth","constrained"]),R={src:i().string.isRequired,alt:S,width:q,height:q,sizes:i().string,layout:function(e){if(void 0!==e.layout&&!M.has(e.layout))return new Error("Invalid value "+e.layout+'" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".')}},U=(A=O,function(e){var t=e.src,a=e.__imageData,r=e.__error,i=l(e,j);return r&&console.warn(r),a?n.createElement(A,o({image:a},i)):(console.warn("Image not loaded",t),null)});U.displayName="StaticImage",U.propTypes=R},642:function(e,t,a){a.d(t,{Z:function(){return i}});var n=a(7294),r=a(9863),i=function(e){return n.createElement("div",{className:"heading-module--heading--da250 "+e.className},n.createElement("h1",null,e.heading,e.icon?n.createElement("span",{className:"heading-module--icon--29bfa",style:(0,r.Z)(e.icon)}):void 0),n.createElement("span",{className:"heading-module--sub_heading--fc581"},e.sub_heading),n.createElement("hr",null))}},4643:function(e,t,a){a.d(t,{Z:function(){return l}});var n=a(1082),r=a(7294),i=a(642),o="layout-module--link--f12e2",l=function(e){var t,a,l=null===(t=(0,n.K2)("1995789189").site)||void 0===t||null===(a=t.siteMetadata)||void 0===a?void 0:a.source;return r.createElement("div",null,r.createElement("nav",{className:"layout-module--nav--99ad1"},r.createElement("div",{className:"layout-module--logo--f4ece"},r.createElement("h1",null,"Christopher Besch"),r.createElement("h2",null,"Software Developer")),r.createElement("div",null,r.createElement("input",{type:"checkbox",id:"nav_toggle"}),r.createElement("label",{htmlFor:"nav_toggle",className:"layout-module--hamburger--87b13"},"☰"),r.createElement("ul",{className:"layout-module--nav_menu--ba828"},r.createElement("li",null,r.createElement(n.rU,{to:"/"},"Home")),r.createElement("li",null,r.createElement(n.rU,{to:"/projects"},"Projects")),r.createElement("li",null,r.createElement(n.rU,{to:"/articles"},"Articles")),r.createElement("li",null,r.createElement(n.rU,{to:"/about"},"About"))))),r.createElement("div",{className:"layout-module--content--bb822"},e.heading?r.createElement(i.Z,{heading:e.heading,icon:e.icon,sub_heading:e.sub_heading}):void 0,e.children),r.createElement("footer",{className:"layout-module--footer--e1bdf"},r.createElement("ul",null,r.createElement("li",{className:o},r.createElement(n.rU,{to:"/about"},"Contact")),r.createElement("li",{className:o},r.createElement("a",{href:l,target:"_blank"},"Source")),r.createElement("li",{className:o},r.createElement(n.rU,{to:"/privacy"},"Privacy")),r.createElement("li",null,r.createElement("p",null,"© 2022")),r.createElement("li",{className:"layout-module--emoji--331ca"},r.createElement("p",null,"🔗")))))}},4001:function(e,t,a){var n=a(1082),r=a(7294),i=a(9499);t.Z=function(e){var t,a,o,l,s,c,u=(0,n.K2)("2480137602"),d=e.heading?e.heading+"—Christopher Besch":"Christopher Besch—Software Developer",m=e.description,g=i.globalHistory.location.href,p=null===(t=u.site)||void 0===t||null===(a=t.siteMetadata)||void 0===a?void 0:a.origin,h=""+(null===(o=u.site)||void 0===o||null===(l=o.siteMetadata)||void 0===l?void 0:l.default_origin)+i.globalHistory.location.pathname,f=e.banner?""+p+e.banner:void 0;return r.createElement(r.Fragment,null,r.createElement("meta",{charSet:"utf-8"}),r.createElement("title",null,d),r.createElement("link",{rel:"canonical",href:h}),r.createElement("link",{rel:"shortcut icon",href:"/favicon.png"}),r.createElement("meta",{property:"og:url",content:g}),r.createElement("meta",{property:"og:title",content:d}),m?r.createElement("meta",{property:"og:description",content:m}):void 0,f?r.createElement("meta",{property:"og:image",content:f}):void 0,r.createElement("meta",{name:"twitter:card",content:f?"summary_large_image":"summary"}),r.createElement("meta",{name:"twitter:site",content:"@besch_chris"}),r.createElement("meta",{name:"twitter:creator",content:"@besch_chris"}),f?r.createElement("meta",{property:"twitter:image:src",content:f}):void 0,r.createElement("meta",{name:"author",content:"Christopher Besch"}),r.createElement("meta",{name:"description",content:d}),r.createElement("script",{defer:!0,src:"https://static.cloudflareinsights.com/beacon.min.js","data-cf-beacon":JSON.stringify({token:null===(s=u.site)||void 0===s||null===(c=s.siteMetadata)||void 0===c?void 0:c.cloudflare_token})}),r.createElement("link",{rel:"preload",href:"/fonts/LiberationSans-Regular-webfont.woff",as:"font",type:"font/woff",crossOrigin:"anonymous"}),r.createElement("link",{rel:"preload",href:"/fonts/LiberationMono-Regular-webfont.woff",as:"font",type:"font/woff",crossOrigin:"anonymous"}))}},9863:function(e,t,a){function n(e){return{maskImage:'url("'+e+'")',WebkitMaskImage:'url("'+e+'")'}}a.d(t,{Z:function(){return n}})}}]);
//# sourceMappingURL=2b264be717cebf0170b94b20f3dd19ddef697514-5a95855572ae61b7f4a5.js.map