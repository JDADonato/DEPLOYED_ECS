import{r as o,j as e,H as n,d as m}from"./vendor-framework-CkIG79vl.js";import{l as d}from"./ECS_LOGO-P7eydQEe.js";import{e as x,i as h}from"./statusLabels-D2n8ZiOg.js";import{b as r}from"./app-BfpuYOFw.js";import{L as l,D as u,W as f,Y as p,V as b}from"./vendor-ui-B0FFnvG-.js";import"./vendor-http-B8_nURbH.js";import"./vendor-realtime-6HroY-cm.js";/* empty css            */const C=({paymentStatus:a="Pending",syncMessage:c="Payment is still pending PayMongo confirmation."})=>{o.useEffect(()=>{try{const t=JSON.parse(localStorage.getItem("ecs_user"));t&&t.id&&r(`user:${t.id}`)}catch{}r("client:dashboard_data")},[]);const s=h(a),i=x(a);return e.jsxs(e.Fragment,{children:[e.jsx(n,{title:s?"Payment Confirmed":"Payment Pending"}),e.jsxs("main",{className:"min-h-screen bg-white text-slate-950",children:[e.jsxs("section",{className:"mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8",children:[e.jsxs("header",{className:"flex items-center justify-between",children:[e.jsx("img",{src:d,alt:"ECS",className:"h-12 w-auto"}),e.jsxs("div",{className:"flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx("span",{children:"Checkout"})]})]}),e.jsx("div",{className:"flex flex-1 items-center justify-center py-12",children:e.jsxs("div",{className:"w-full max-w-2xl text-center",children:[e.jsx("div",{className:"mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50",children:e.jsx("div",{className:"success-ring flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-200",children:e.jsx(u,{className:"success-check h-11 w-11",strokeWidth:3})})}),e.jsx("p",{className:`mb-3 text-sm font-black uppercase tracking-widest ${s?"text-emerald-600":"text-amber-600"}`,children:s?"Authorization complete":"Awaiting confirmation"}),e.jsx("h1",{className:"text-3xl font-black tracking-normal text-slate-950 sm:text-5xl",children:s?"Payment Authorized Successfully.":"Payment Authorization Received."}),e.jsx("p",{className:"mx-auto mt-5 max-w-xl text-base font-medium leading-7 text-slate-600",children:c}),e.jsxs("div",{className:"mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-3",children:[e.jsxs("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[e.jsx(f,{className:"mx-auto mb-3 h-6 w-6 text-[#720101]"}),e.jsx("p",{className:"text-xs font-black uppercase tracking-widest text-slate-500",children:"Receipt"}),e.jsx("p",{className:"mt-1 text-sm font-bold text-slate-950",children:"Recorded"})]}),e.jsxs("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[e.jsx(p,{className:"mx-auto mb-3 h-6 w-6 text-[#720101]"}),e.jsx("p",{className:"text-xs font-black uppercase tracking-widest text-slate-500",children:"Booking"}),e.jsx("p",{className:"mt-1 text-sm font-bold text-slate-950",children:"Confirmed"})]}),e.jsxs("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[e.jsx(l,{className:"mx-auto mb-3 h-6 w-6 text-[#720101]"}),e.jsx("p",{className:"text-xs font-black uppercase tracking-widest text-slate-500",children:"Status"}),e.jsx("p",{className:"mt-1 text-sm font-bold text-slate-950",children:i.label})]})]}),e.jsxs("button",{type:"button",onClick:()=>m.visit("/dashboard/client"),className:"mt-10 inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[#720101] px-8 text-sm font-black text-white shadow-lg shadow-[#720101]/20 transition-colors hover:bg-[#5c0101]",children:[e.jsx("span",{children:"Return to Dashboard"}),e.jsx(b,{className:"h-5 w-5"})]})]})})]}),e.jsx("style",{children:`
                    .success-ring {
                        animation: success-pop 520ms cubic-bezier(0.2, 0.9, 0.25, 1.25) both;
                    }

                    .success-check {
                        stroke-dasharray: 56;
                        stroke-dashoffset: 56;
                        animation: success-draw 620ms ease-out 220ms forwards;
                    }

                    @keyframes success-pop {
                        0% {
                            opacity: 0;
                            transform: scale(0.72);
                        }
                        70% {
                            opacity: 1;
                            transform: scale(1.08);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }

                    @keyframes success-draw {
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                `})]})]})};export{C as default};
