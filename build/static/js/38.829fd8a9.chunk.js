(this["webpackJsonprmstudio_2.0"]=this["webpackJsonprmstudio_2.0"]||[]).push([[38],{1338:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return l}));var c=n(45),o=n(32),r=n(1),a=n(47),s=n(132),i=n(56),d=n(8);function l(e){var t,n,l=e.route,u=Object(a.d)((function(e){return e.tasksReducer.selectedTask})),j=Object(a.d)((function(e){return e.tasksReducer.selectedHoveringTask})),b=Object(a.d)((function(e){return e.positionsReducer.positions})),O=Object(a.d)((function(e){return e.stationsReducer.stations})),v=Object(a.d)((function(e){return e.tasksReducer.tasks})),f=Object(a.c)(),w=null;w=l||(j||u);var h=Object(r.useMemo)((function(){return!!w&&void 0!==Object.values(v).find((function(e){return w.load===e.unload&&!!w.unload&&w.unload===e.load}))}),[w,v]),x=Object(r.useRef)();x.current=w;var m=null===(t=w)||void 0===t?void 0:t.load,k=(null===(n=w)||void 0===n||n.unload,Object(r.useState)({x:0,y:0})),g=(Object(o.a)(k,1)[0],Object(r.useState)(0)),p=Object(o.a)(g,2),y=p[0],M=p[1],E=Object(r.useState)(0),L=Object(o.a)(E,2),_=L[0],S=L[1],R=Object(r.useState)(null),B=Object(o.a)(R,2),G=B[0],J=B[1],N=Object(r.useState)(null),T=Object(o.a)(N,2),W=T[0],q=T[1],A=Object(r.useState)((function(){return function(e){J(e.clientX),q(e.clientY)}})),D=Object(o.a)(A,1)[0],F=Object(r.useState)((function(){return function(e){"Escape"==e.key&&f(Object(s.k)(x.current._id,{load:null}))}})),H=Object(o.a)(F,1)[0];if(Object(r.useEffect)((function(){var e,t;if(w?(e=Object(i.d)(w),t=Object(i.j)(w)):(e=Object(i.d)(j),t=Object(i.j)(j)),null!==w||null!==j){if(null!==e){var n=b[e]?b[e]:O[e];n&&(M(n.x),S(n.y))}if(null!==t){var c=b[t]?b[t]:O[t];c&&(J(c.x),q(c.y))}}})),Object(r.useEffect)((function(){var e=Object(i.d)(w),t=Object(i.j)(w);return window.addEventListener("mousedown",D,!1),null!==w&&null!==e&&null===t?(J(y),q(_),window.addEventListener("mousemove",D,!1),window.addEventListener("keydown",H)):(window.removeEventListener("mousemove",D,!1),window.removeEventListener("keydown",H)),function(){window.removeEventListener("mousedown",D,!1),window.removeEventListener("mousemove",D,!1),window.removeEventListener("keydown",H)}}),[w]),null!==w&&null!=m){var I=G||y,P=W||_,X=Math.sqrt(Math.pow(I-y,2)+Math.pow(P-_,2)),Y=Math.atan2(P-_,I-y),z=180*Y/Math.PI,C=Object(c.a)(Array(Math.ceil(X/(10*e.d3.scale))).keys()),K=(null===j||void 0===j?void 0:j._id)===(null===l||void 0===l?void 0:l._id)?"rgba(56, 235, 135, 0.95)":"rgba(255, 182, 46, 0.95)",Q=(null===j||void 0===j?void 0:j._id)===(null===l||void 0===l?void 0:l._id)?"rgba(184, 255, 215, 0.7)":"rgba(255, 236, 201, 0.7)",U=(null===j||void 0===j?void 0:j._id)===(null===l||void 0===l?void 0:l._id)?"rgba(56, 235, 135, 0.95)":"rgba(255, 182, 47, 0.95)";return Object(d.jsx)(d.Fragment,{children:Object(d.jsxs)("g",{children:[Object(d.jsx)("defs",{children:Object(d.jsxs)("filter",{id:"glow",children:[Object(d.jsx)("feGaussianBlur",{stdDeviation:"1",result:"coloredBlur"}),Object(d.jsxs)("feMerge",{children:[Object(d.jsx)("feMergeNode",{in:"coloredBlur"}),Object(d.jsx)("feMergeNode",{in:"SourceGraphic"})]})]})}),Object(d.jsx)("line",{x1:"".concat(y),y1:"".concat(_),x2:"".concat(G||y),y2:"".concat(W||_),strokeWidth:"".concat(8*e.d3.scale),stroke:K,strokeLinecap:"round"}),Object(d.jsx)("line",{x1:"".concat(y),y1:"".concat(_),x2:"".concat(G||y),y2:"".concat(W||_),strokeWidth:"".concat(6*e.d3.scale),stroke:Q,strokeLinecap:"round"}),C.map((function(t){return Object(d.jsx)("g",{transform:"translate(".concat(y+t*e.d3.scale*10*Math.cos(Y)," ").concat(_+t*e.d3.scale*10*Math.sin(Y),")"),children:Object(d.jsx)("g",{viewBox:"-50 -50 50 50",transform:"rotate(".concat(z,") scale(").concat(.05*e.d3.scale,")"),children:Object(d.jsx)("polygon",{points:"-40,-50 -40,50 40,0",fill:U})})},"arrow-".concat(t))})),h&&C.slice(1).map((function(t){return Object(d.jsx)("g",{transform:"translate(".concat(y+(t-.5)*e.d3.scale*10*Math.cos(Y)," ").concat(_+(t-.5)*e.d3.scale*10*Math.sin(Y),")"),children:Object(d.jsx)("g",{viewBox:"-50 -50 50 50",transform:"rotate(".concat(z+180,") scale(").concat(.05*e.d3.scale,")"),children:Object(d.jsx)("polygon",{points:"-40,-50 -40,50 40,0",fill:U})})},"arrow-".concat(t))}))]})})}return null}}}]);
//# sourceMappingURL=38.829fd8a9.chunk.js.map