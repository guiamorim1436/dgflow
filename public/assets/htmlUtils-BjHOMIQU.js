function n(t){if(!t)return"";const e=new DOMParser().parseFromString(t,"text/html");return e.body.querySelectorAll("br").forEach(r=>{r.replaceWith(e.createTextNode(`
`))}),e.body.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6, blockquote, tr, pre").forEach(r=>{r.appendChild(e.createTextNode(`
`))}),(e.body.textContent||"").replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}function l(t){return n(t).replace(/\s*\n+\s*/g," ").trim()}export{l as a,n as s};
