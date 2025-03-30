"use strict";(self.webpackChunkhomepage=self.webpackChunkhomepage||[]).push([[245],{2068:function(e,t,n){n.r(t),n.d(t,{Head:function(){return g},default:function(){return _}});var o={};n.r(o),n.d(o,{$p:function(){return m},Pn:function(){return d},BH:function(){return u},eo:function(){return p}});var c=n(6540),i=n(4810),a=n(5365),l=n(1042),r=n(9208),s=n(5360),m="home-module--banner_content--0744e",d="home-module--banner_image--04759",u="home-module--language--fd6fd",p="home-module--languages--4ea3a",v=n(8378),f=n(4530);var _=e=>{let{data:t}=e;t.projects.edges.map(r.Z).filter((e=>e.priority<=f.XJ)),t.articles.edges.map(s.m).slice(0,4);return c.createElement(a.A,{banner_image:t.photo,banner_image_style:d,banner_content:c.createElement("div",{className:m},c.createElement("h1",null,"Welcome to Chris' Place!"),c.createElement("p",null,"What are you here for?"),c.createElement("div",{className:p},c.createElement(i.N_,{to:"/projects/cpp",className:u},c.createElement(v.A,{className:o.icon,icon:"/icons/c-plusplus.svg",icon_mono:"/icons/c-plusplus_mono.svg",alt:"C++"})),c.createElement(i.N_,{to:"/projects/rust",className:u},c.createElement(v.A,{className:o.icon,icon:"/icons/rust.svg",alt:"Rust"})),c.createElement(i.N_,{to:"/projects/typescript",className:u},c.createElement(v.A,{className:o.icon,icon:"/icons/typescript-icon.svg",icon_mono:"/icons/typescript-icon_mono.svg",alt:"TypeScript"})),c.createElement(i.N_,{to:"/projects/python",className:u},c.createElement(v.A,{className:o.icon,icon:"/icons/python.svg",alt:"Python"}))))},"hi")};const g=()=>c.createElement(l.A,null)},4530:function(e,t,n){n.d(t,{B2:function(){return l},DO:function(){return a},XJ:function(){return o},ZC:function(){return c},z0:function(){return i}});const o=1,c=2,i=30,a=40,l=50},5360:function(e,t,n){n.d(t,{A:function(){return l},m:function(){return a}});var o=n(6540),c=n(4810),i=n(2532);function a(e){var t,n,o,c,a;return{id:e.node.id,date:null===(t=e.node.frontmatter)||void 0===t?void 0:t.date,description:null===(n=e.node.frontmatter)||void 0===n?void 0:n.description,slug:null===(o=e.node.frontmatter)||void 0===o?void 0:o.slug,title:null===(c=e.node.frontmatter)||void 0===c?void 0:c.title,thumb:(0,i.c)(null===(a=e.node.frontmatter)||void 0===a?void 0:a.thumb)}}var l=e=>o.createElement("div",{className:e.className},e.articles.map((e=>o.createElement(c.N_,{to:`/articles/${e.slug}`,key:e.id,className:"article_list-module--article--c6401"},o.createElement("div",{className:"article_list-module--image--065e9"},o.createElement(i.G,{image:e.thumb,alt:"thumbnail"})),o.createElement("div",{className:"article_list-module--body--3e20f"},o.createElement("div",null,o.createElement("h2",{className:"article_list-module--heading--a4285"},e.title),o.createElement("hr",null),o.createElement("div",null,e.description.split("\n").map(((e,t)=>o.createElement("p",{key:t},e))))),o.createElement("p",{className:"article_list-module--date--19031"},e.date))))))},7865:function(e,t,n){n.d(t,{e:function(){return o}});const o=new Map([["python",{id:"python",name:"Python",icon:"/icons/python.svg",icon_mono:"/icons/python.svg"}],["cpp",{id:"cpp",name:"C++",icon:"/icons/c-plusplus.svg",icon_mono:"/icons/c-plusplus_mono.svg"}],["typescript",{id:"typescript",name:"TypeScript",icon:"/icons/typescript-icon.svg",icon_mono:"/icons/typescript-icon_mono.svg"}],["java",{id:"java",name:"Java",icon:"/icons/java.svg",icon_mono:"/icons/java.svg"}],["rust",{id:"rust",name:"Rust",icon:"/icons/rust.svg",icon_mono:"/icons/rust.svg"}],["c",{id:"c",name:"C",icon:"/icons/c.svg",icon_mono:"/icons/c.svg"}]])},8378:function(e,t,n){n.d(t,{A:function(){return i}});var o=n(6540),c=n(2867);var i=e=>{const t=e.icon,n=e.alt?e.alt:"icon",i=e.icon_mono?e.icon_mono:t;return o.createElement("div",{className:`hover_icon-module--icon_wrapper--987b2 ${e.className}`},o.createElement("img",{className:`hover_icon-module--icon--32e2a ${e.icon_class}`,src:t,alt:n}),o.createElement("div",{className:`hover_icon-module--icon_mono--d29ed ${e.icon_mono_class}`,style:(0,c.A)(i)}))}},9208:function(e,t,n){n.d(t,{A:function(){return r},Z:function(){return l}});var o=n(2532),c=n(6540),i=n(7865),a=n(8378);function l(e){var t,n,c,a,l,r,s,m,d;return{id:e.node.id,date:null===(t=e.node.frontmatter)||void 0===t?void 0:t.date,languages:null===(n=e.node.frontmatter)||void 0===n?void 0:n.languages.map((e=>i.e.get(e))),priority:parseInt(null===(c=e.node.frontmatter)||void 0===c?void 0:c.priority),dependencies:null===(a=e.node.frontmatter)||void 0===a?void 0:a.dependencies,description:null===(l=e.node.frontmatter)||void 0===l?void 0:l.description,slug:null===(r=e.node.frontmatter)||void 0===r?void 0:r.slug,link:null===(s=e.node.frontmatter)||void 0===s?void 0:s.link,title:null===(m=e.node.frontmatter)||void 0===m?void 0:m.title,thumb:(0,o.c)(null===(d=e.node.frontmatter)||void 0===d?void 0:d.thumb)}}var r=e=>{const t=e.count;let n={"--full-width":100/t+"%","--half-width":100/Math.ceil(t/2)+"%","--quarter-width":100/Math.ceil(t/4)+"%"};return c.createElement("div",{className:`project_list-module--projects--af962 ${e.className}`},e.projects.map((e=>c.createElement("a",{href:e.link,target:"_blank",key:e.id,className:"project_list-module--project--b34f6",style:n},c.createElement("div",{className:"project_list-module--content--5f844"},c.createElement(o.G,{className:"project_list-module--image--b05ea",image:e.thumb,alt:"thumbnail"}),c.createElement("div",{className:"project_list-module--title--5f73d"},c.createElement("h2",{className:"project_list-module--heading--5ad99"},e.title),e.languages.map((t=>c.createElement(a.A,{className:"project_list-module--language_icon--5e033",key:`${e.id}${t.id}`,icon:t.icon,icon_mono:t.icon_mono,alt:t.id,icon_class:"project_list-module--icon--69fe8",icon_mono_class:"project_list-module--icon_mono--7fdf0"})))),c.createElement("hr",null),c.createElement("div",{className:"project_list-module--text--25836"},c.createElement("p",null,e.description)))))))}}}]);
//# sourceMappingURL=component---src-pages-index-tsx-4cd7aa630dfba37c8552.js.map