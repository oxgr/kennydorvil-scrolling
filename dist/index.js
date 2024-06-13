(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))u(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&u(l)}).observe(document,{childList:!0,subtree:!0});function i(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function u(t){if(t.ep)return;t.ep=!0;const o=i(t);fetch(t.href,o)}})();const e={ROOT_MARGIN_TOP_DESKTOP:5,ROOT_MARGIN_BOT_DESKTOP:20,ROOT_MARGIN_TOP_MOBILE:20,ROOT_MARGIN_BOT_MOBILE:25,MOBILE_WIDTH_CUTOFF_PX:640,MOBILE_TOP_PADDING_VH:40,INTERSECTION_RATE:100,BLUR_STRENGTH_MAX:20,MECH_ROTATE_MAX:.2,MECH_PERSPECTIVE_AMT:40,MECH_SCALE_AMT:.5,OPACITY_MIN:0,CAPTION_FADEIN_THRESHOLD:.8,DEBUG:!1},C=P();function P(r){return{enabled:!1,element:null,obj:{},add:()=>{},print:()=>{}}}function b(r){r.style.filter="none",r.style.transform="none"}function h(r,n){return r.documentElement.clientWidth<e.MOBILE_WIDTH_CUTOFF_PX}function L(r){const n=h(r),i=n?e.ROOT_MARGIN_TOP_MOBILE:e.ROOT_MARGIN_TOP_DESKTOP,u=n?e.ROOT_MARGIN_BOT_MOBILE:e.ROOT_MARGIN_BOT_DESKTOP,t=Array(e.INTERSECTION_RATE).fill(0).map((O,s)=>s/e.INTERSECTION_RATE),o={root:null,rootMargin:`-${i}% 0% -${u}% 0% `,threshold:t};return new IntersectionObserver(l,o);function l(O){O.forEach(s=>{const _=s.intersectionRatio,d=s.rootBounds.top,A=s.boundingClientRect.top<d,M=p(_),R=m(_,A),f=s.target.shadowRoot.querySelector(".media");f.style.filter=M,f.style.transform=R;const T=s.target.querySelector(".caption");T&&(_>e.CAPTION_FADEIN_THRESHOLD?T.classList.add("captionVisible"):T.classList.remove("captionVisible")),C.add("outline",s.target);return;function I(c){return`${c*(1-e.OPACITY_MIN)+e.OPACITY_MIN}`}function p(c){return`blur(${e.BLUR_STRENGTH_MAX-Math.round(c*e.BLUR_STRENGTH_MAX)}px) brightness(${I(c)*100}%)`}function m(c,a){if(c==1)return"";const N=e.MECH_PERSPECTIVE_AMT,E=e.MECH_ROTATE_MAX-c*e.MECH_ROTATE_MAX,g=a?E:-E,S=1-e.MECH_SCALE_AMT+c*e.MECH_SCALE_AMT;return`perspective(${N}vw) rotateX(${g}turn) scale(${S})  `}})}}B();function B(){console.log("Scrolling effects by @oxgr"),document.querySelector("#scrollingEffects");const r=document.querySelectorAll(".linked"),n=L(document);r.forEach(i=>{n.observe(i),b(i)})}
