(this["webpackJsonprmstudio_2.0"]=this["webpackJsonprmstudio_2.0"]||[]).push([[35,38],{1338:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return d}));var c=n(45),r=n(32),o=n(1),s=n(47),a=n(132),u=n(56),i=n(8);function d(e){var t,n,d=e.route,l=Object(s.d)((function(e){return e.tasksReducer.selectedTask})),j=Object(s.d)((function(e){return e.tasksReducer.selectedHoveringTask})),b=Object(s.d)((function(e){return e.positionsReducer.positions})),O=Object(s.d)((function(e){return e.stationsReducer.stations})),f=Object(s.d)((function(e){return e.tasksReducer.tasks})),v=Object(s.c)(),w=null;w=d||(j||l);var x=Object(o.useMemo)((function(){return!!w&&void 0!==Object.values(f).find((function(e){return w.load===e.unload&&!!w.unload&&w.unload===e.load}))}),[w,f]),h=Object(o.useRef)();h.current=w;var k=null===(t=w)||void 0===t?void 0:t.load,m=(null===(n=w)||void 0===n||n.unload,Object(o.useState)({x:0,y:0})),g=(Object(r.a)(m,1)[0],Object(o.useState)(0)),p=Object(r.a)(g,2),y=p[0],M=p[1],R=Object(o.useState)(0),_=Object(r.a)(R,2),E=_[0],L=_[1],S=Object(o.useState)(null),B=Object(r.a)(S,2),T=B[0],P=B[1],F=Object(o.useState)(null),G=Object(r.a)(F,2),J=G[0],N=G[1],W=Object(o.useState)((function(){return function(e){P(e.clientX),N(e.clientY)}})),q=Object(r.a)(W,1)[0],A=Object(o.useState)((function(){return function(e){"Escape"==e.key&&v(Object(a.k)(h.current._id,{load:null}))}})),D=Object(r.a)(A,1)[0];if(Object(o.useEffect)((function(){var e,t;if(w?(e=Object(u.d)(w),t=Object(u.j)(w)):(e=Object(u.d)(j),t=Object(u.j)(j)),null!==w||null!==j){if(null!==e){var n=b[e]?b[e]:O[e];n&&(M(n.x),L(n.y))}if(null!==t){var c=b[t]?b[t]:O[t];c&&(P(c.x),N(c.y))}}})),Object(o.useEffect)((function(){var e=Object(u.d)(w),t=Object(u.j)(w);return window.addEventListener("mousedown",q,!1),null!==w&&null!==e&&null===t?(P(y),N(E),window.addEventListener("mousemove",q,!1),window.addEventListener("keydown",D)):(window.removeEventListener("mousemove",q,!1),window.removeEventListener("keydown",D)),function(){window.removeEventListener("mousedown",q,!1),window.removeEventListener("mousemove",q,!1),window.removeEventListener("keydown",D)}}),[w]),null!==w&&null!=k){var H=T||y,I=J||E,V=Math.sqrt(Math.pow(H-y,2)+Math.pow(I-E,2)),X=Math.atan2(I-E,H-y),Y=180*X/Math.PI,z=Object(c.a)(Array(Math.ceil(V/(10*e.d3.scale))).keys()),C=(null===j||void 0===j?void 0:j._id)===(null===d||void 0===d?void 0:d._id)?"rgba(56, 235, 135, 0.95)":"rgba(255, 182, 46, 0.95)",K=(null===j||void 0===j?void 0:j._id)===(null===d||void 0===d?void 0:d._id)?"rgba(184, 255, 215, 0.7)":"rgba(255, 236, 201, 0.7)",Q=(null===j||void 0===j?void 0:j._id)===(null===d||void 0===d?void 0:d._id)?"rgba(56, 235, 135, 0.95)":"rgba(255, 182, 47, 0.95)";return Object(i.jsx)(i.Fragment,{children:Object(i.jsxs)("g",{children:[Object(i.jsx)("defs",{children:Object(i.jsxs)("filter",{id:"glow",children:[Object(i.jsx)("feGaussianBlur",{stdDeviation:"1",result:"coloredBlur"}),Object(i.jsxs)("feMerge",{children:[Object(i.jsx)("feMergeNode",{in:"coloredBlur"}),Object(i.jsx)("feMergeNode",{in:"SourceGraphic"})]})]})}),Object(i.jsx)("line",{x1:"".concat(y),y1:"".concat(E),x2:"".concat(T||y),y2:"".concat(J||E),strokeWidth:"".concat(8*e.d3.scale),stroke:C,strokeLinecap:"round"}),Object(i.jsx)("line",{x1:"".concat(y),y1:"".concat(E),x2:"".concat(T||y),y2:"".concat(J||E),strokeWidth:"".concat(6*e.d3.scale),stroke:K,strokeLinecap:"round"}),z.map((function(t){return Object(i.jsx)("g",{transform:"translate(".concat(y+t*e.d3.scale*10*Math.cos(X)," ").concat(E+t*e.d3.scale*10*Math.sin(X),")"),children:Object(i.jsx)("g",{viewBox:"-50 -50 50 50",transform:"rotate(".concat(Y,") scale(").concat(.05*e.d3.scale,")"),children:Object(i.jsx)("polygon",{points:"-40,-50 -40,50 40,0",fill:Q})})},"arrow-".concat(t))})),x&&z.slice(1).map((function(t){return Object(i.jsx)("g",{transform:"translate(".concat(y+(t-.5)*e.d3.scale*10*Math.cos(X)," ").concat(E+(t-.5)*e.d3.scale*10*Math.sin(X),")"),children:Object(i.jsx)("g",{viewBox:"-50 -50 50 50",transform:"rotate(".concat(Y+180,") scale(").concat(.05*e.d3.scale,")"),children:Object(i.jsx)("polygon",{points:"-40,-50 -40,50 40,0",fill:Q})})},"arrow-".concat(t))}))]})})}return null}},1963:function(e,t,n){"use strict";n.r(t);n(1);var c=n(47),r=n(1338),o=n(54),s=n(8);t.default=function(e){var t=e.d3,n=Object(c.d)((function(e){return e.processesReducer.selectedProcess})),a=Object(c.d)((function(e){return e.tasksReducer.tasks})),u=Object(c.d)((function(e){return e.tasksReducer.editingTask})),i=Object(c.d)((function(e){return e.tasksReducer.selectedTask})),d=Object(c.d)((function(e){return e.processesReducer.editingProcess})),l=Object(c.d)((function(e){return e.processesReducer.editingValues}));return Object(s.jsx)(s.Fragment,{children:(d&&l?l:n).routes.filter((function(e){var t=(Object(o.b)(e)?e:a[e])||{},n=t.load,c=t.unload,r=t._id,s=(i||{})._id;return r!==s&&!((!u||u&&s!==r)&&(null===n||null===c))})).map((function(e,n){return Object(o.b)(e)?Object(s.jsx)(r.default,{d3:t,route:e},e._id):Object(s.jsx)(r.default,{d3:t,route:a[e]},e)}))})}}}]);
//# sourceMappingURL=35.3cd8693f.chunk.js.map