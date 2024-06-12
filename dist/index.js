(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();const t={ROOT_MARGIN_TOP_DESKTOP:5,ROOT_MARGIN_BOT_DESKTOP:20,ROOT_MARGIN_TOP_MOBILE:25,ROOT_MARGIN_BOT_MOBILE:30,MOBILE_WIDTH_CUTOFF_PX:640,MOBILE_TOP_PADDING_VH:40,INTERSECTION_RATE:100,BLUR_STRENGTH_MAX:20,MECH_ROTATE_MAX:.2,MECH_PERSPECTIVE_AMT:40,MECH_SCALE_AMT:.5,OPACITY_MIN:0,DEBUG:!0},C=B(document.body),u={};S();function S(){console.log("Scrolling effects by @oxgr"),document.querySelector("#scrollingEffects");const o=document.querySelectorAll(".linked");L(document.body);const n=P({isMobile:N(document)});o.forEach(i=>{n.observe(i.shadowRoot.querySelector(".media"))})}function N(o){return o.documentElement.clientWidth<t.MOBILE_WIDTH_CUTOFF_PX}function P({isMobile:o}){const n=o?t.ROOT_MARGIN_TOP_MOBILE:t.ROOT_MARGIN_TOP_DESKTOP,i=o?t.ROOT_MARGIN_BOT_MOBILE:t.ROOT_MARGIN_BOT_DESKTOP,s=Array(t.INTERSECTION_RATE).fill(0).map((d,l)=>l/t.INTERSECTION_RATE),e={root:null,rootMargin:`-${n}% 0% -${i}% 0% `,threshold:s};return new IntersectionObserver(r,e);function r(d){d.forEach(l=>{const a=l.intersectionRatio,M=l.rootBounds.top,g=l.boundingClientRect.top<M,p=b(a),R=y(a,g),T=l.target;T.style.filter=p,T.style.transform=R;const O=l.target.querySelector(".image-caption");if(O&&(O.style.opacity=a*a),l.target.href.includes("02")){console.log(T.style),u.img=T.style[0];const c=JSON.stringify(u,null,2).replaceAll('"',"");C.innerHTML=c}return;function I(c){return`${c*(1-t.OPACITY_MIN)+t.OPACITY_MIN}`}function b(c){return`blur(${t.BLUR_STRENGTH_MAX-Math.round(c*t.BLUR_STRENGTH_MAX)}px) brightness(${I(c)*100}%)`}function y(c,E){if(c==1)return"";const h=t.MECH_PERSPECTIVE_AMT,_=t.MECH_ROTATE_MAX-c*t.MECH_ROTATE_MAX,m=E?_:-_,A=1-t.MECH_SCALE_AMT+c*t.MECH_SCALE_AMT;return u.rotateAmtBase=_,u.rotateAmt=m,u.rotateRatio=c,u.scaleAmt=A,u.initRatio=c,`perspective(${h}vw) rotateX(${m}turn) scale(${A})  `}})}}function f(o,n,{id:i,classList:s}){const e=document.createElement(n);return i&&(e.id=i),s&&e.classList.add(...s),o.append(e),e}function L(o){return f(o,"div",{id:"vignetteEffect",classList:[]})}function B(o){const n=f(o,"div",{id:"debug"}),i=f(n,"button",{id:"debugCheckbox"});i.innerHTML="Show debug";const s=f(n,"pre",{id:"debugText"});return i.addEventListener("click",e=>{e.preventDefault(),s.style.display=s.style.display=="none"?"block":"none"}),s}
