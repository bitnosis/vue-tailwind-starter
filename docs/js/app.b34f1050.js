(function(e){function t(t){for(var r,l,s=t[0],u=t[1],i=t[2],f=0,p=[];f<s.length;f++)l=s[f],Object.prototype.hasOwnProperty.call(o,l)&&o[l]&&p.push(o[l][0]),o[l]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);c&&c(t);while(p.length)p.shift()();return a.push.apply(a,i||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,s=1;s<n.length;s++){var u=n[s];0!==o[u]&&(r=!1)}r&&(a.splice(t--,1),e=l(l.s=n[0]))}return e}var r={},o={app:0},a=[];function l(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.m=e,l.c=r,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)l.d(n,r,function(t){return e[t]}.bind(null,r));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="/vue-tailwind-starter/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var i=0;i<s.length;i++)t(s[i]);var c=u;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";n("85ec")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),o=n("a6f4"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"text-gray-900 flex flex-col min-h-screen bg-gray-200",attrs:{id:"app"}},[n("div",{staticClass:"flex-shrink-0 py-12 text-center"},[n("Hello"),n("div",{staticClass:"mt-2"},[n("a",{staticClass:"text-sm font-semibold text-gray-600 hover:underline",attrs:{href:"https://github.com/james2doyle/vue-tailwind-starter"},domProps:{textContent:e._s(e.message)}})])],1)])},l=[],s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"hello-wrapper"},[r("p",{staticClass:"p-2",domProps:{textContent:e._s(e.message)}}),r("div",[r("img",{staticClass:"mx-auto",attrs:{src:n("cf05"),alt:e.alt,width:"50"}})])])},u=[],i={name:"Hello",setup:function(){return{alt:"Logo",message:"Vue + Tailwind Starter"}}},c=i,f=n("2877"),p=Object(f["a"])(c,s,u,!1,null,null,null),d=p.exports,m={name:"App",components:{Hello:d},data:function(){return{message:"Source on GitHub"}}},v=m,b=(n("034f"),Object(f["a"])(v,a,l,!1,null,null,null)),g=b.exports,h=n("8c4f");r["default"].use(h["a"]);var y=[],x=new h["a"]({routes:y}),w=x;r["default"].use(o["a"]),r["default"].config.productionTip=!1,new r["default"]({name:"App",router:w,render:function(e){return e(g)}}).$mount("#app")},"85ec":function(e,t,n){},cf05:function(e,t,n){e.exports=n.p+"img/logo.6b03b6d2.png"}});
//# sourceMappingURL=app.b34f1050.js.map