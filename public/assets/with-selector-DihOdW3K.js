import{r as w,cG as R,bu as p}from"./index-G-E061gt.js";var V={exports:{}},j={};/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var s=w,y=R;function z(r,u){return r===u&&(r!==0||1/r===1/u)||r!==r&&u!==u}var D=typeof Object.is=="function"?Object.is:z,M=y.useSyncExternalStore,x=s.useRef,G=s.useEffect,O=s.useMemo,h=s.useDebugValue;j.useSyncExternalStoreWithSelector=function(r,u,v,n,f){var o=x(null);if(o.current===null){var t={hasValue:!1,value:null};o.current=t}else t=o.current;o=O(function(){function m(e){if(!d){if(d=!0,l=e,e=n(e),f!==void 0&&t.hasValue){var a=t.value;if(f(a,e))return c=a}return c=e}if(a=c,D(l,e))return a;var E=n(e);return f!==void 0&&f(a,E)?(l=e,a):(l=e,c=E)}var d=!1,l,c,b=v===void 0?null:v;return[function(){return m(u())},b===null?void 0:function(){return m(b())}]},[u,v,n,f]);var i=M(r,o[0],o[1]);return G(function(){t.hasValue=!0,t.value=i},[i]),h(i),i};V.exports=j;var C=V.exports;const I=p(C);export{I as u,C as w};
