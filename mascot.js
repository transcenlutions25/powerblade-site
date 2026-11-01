/* PowerBlade mascot button: Mr. Ed slashes grass when you hover or tap him.
   Usage: PBMascot.mount({ img: "ninja.webp", label: "Ask Mr. Ed", onOpen: () => {...}, bottom: "150px" }) */
(function () {
  const css = `
  .pbm{position:fixed;right:max(10px,env(safe-area-inset-right,0px));bottom:var(--pbm-bottom,96px);z-index:18;width:96px;height:96px;padding:0;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .pbm .disc{position:absolute;inset:14px 6px 0 6px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#3a0d0d,#0d0d0d 72%);box-shadow:0 10px 24px rgba(0,0,0,.45),0 0 0 3px #fcb816;overflow:hidden}
  .pbm .disc:after{content:"";position:absolute;inset:auto 0 0;height:34%;background:repeating-linear-gradient(100deg,#2c5027 0 9px,#36612f 9px 18px)}
  .pbm img{position:absolute;left:50%;bottom:4px;width:118px;height:auto;transform:translateX(-50%);transform-origin:50% 85%;filter:drop-shadow(0 6px 8px rgba(0,0,0,.5));pointer-events:none;z-index:2}
  .pbm .tag{position:absolute;right:88px;bottom:22px;white-space:nowrap;background:#fff;color:#192a3d;font:700 15px/1 system-ui,Arial;padding:9px 12px;border-radius:12px;box-shadow:0 6px 16px rgba(0,0,0,.25);opacity:0;transform:translateX(8px);transition:.2s;pointer-events:none}
  .pbm:hover .tag,.pbm:focus-visible .tag,.pbm.hello .tag{opacity:1;transform:none}
  .pbm svg.slash{position:absolute;left:-40px;top:-30px;width:180px;height:160px;z-index:3;pointer-events:none;overflow:visible}
  .pbm svg.slash path{fill:none;stroke:#fff;stroke-width:7;stroke-linecap:round;stroke-dasharray:260;stroke-dashoffset:260;opacity:0;filter:drop-shadow(0 0 6px #fcb816)}
  .pbm .clip{position:absolute;left:46px;top:58px;width:5px;height:16px;border-radius:3px;z-index:4;pointer-events:none}
  .pbm:focus-visible{outline:4px solid #fcb816;outline-offset:4px;border-radius:50%}
  @media (prefers-reduced-motion:no-preference){
    .pbm img{animation:pbm-breathe 3.4s ease-in-out infinite}
    .pbm.chop img{animation:pbm-chop .62s cubic-bezier(.3,.7,.3,1) 1}
    .pbm.chop svg.slash path{animation:pbm-slash .42s ease-out .16s 1}
  }
  @keyframes pbm-breathe{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.03)}}
  @keyframes pbm-chop{0%{transform:translateX(-50%) rotate(0)}22%{transform:translateX(-58%) rotate(-14deg) scale(1.04)}48%{transform:translateX(-36%) rotate(16deg) scale(1.12)}70%{transform:translateX(-46%) rotate(-3deg) scale(1.05)}100%{transform:translateX(-50%) rotate(0)}}
  @keyframes pbm-slash{0%{stroke-dashoffset:260;opacity:1}70%{opacity:1}100%{stroke-dashoffset:0;opacity:0}}`;
  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  function burst(btn) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const greens = ["#3f8f2e", "#5fae3f", "#6cc04a", "#2f7a26", "#8fd36b"];
    for (let i = 0; i < 16; i++) {
      const c = document.createElement("span"); c.className = "clip";
      c.style.background = greens[i % greens.length];
      btn.appendChild(c);
      const ang = (-160 + Math.random() * 140) * Math.PI / 180, dist = 50 + Math.random() * 70;
      const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist, rot = Math.random() * 720 - 360;
      c.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) rotate(${rot / 2}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${dx * 1.2}px,${dy + 80}px) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 400, delay: 180, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" }).onfinish = () => c.remove();
    }
  }
  function chop(btn) { btn.classList.remove("chop"); void btn.offsetWidth; btn.classList.add("chop"); burst(btn); }

  window.PBMascot = {
    mount({ img, label = "Ask Mr. Ed", onOpen, bottom }) {
      const b = document.createElement("button");
      b.className = "pbm"; b.type = "button"; b.setAttribute("aria-label", label);
      if (bottom) b.style.setProperty("--pbm-bottom", bottom);
      b.innerHTML = `<span class="disc"></span><img alt="" src="${img}"><svg class="slash" viewBox="0 0 180 160" aria-hidden="true"><path d="M20 120 Q90 10 170 40"/></svg><span class="tag">${label}</span>`;
      const im = b.querySelector("img");
      im.onerror = () => { im.remove(); b.querySelector(".disc").insertAdjacentHTML("beforeend", '<b style="position:absolute;inset:0;display:grid;place-items:center;color:#fcb816;font:800 italic 28px system-ui;z-index:2">Ed</b>'); };
      let last = 0;
      b.addEventListener("pointerenter", e => { if (e.pointerType === "mouse" && Date.now() - last > 900) { last = Date.now(); chop(b); } });
      b.addEventListener("click", () => { chop(b); setTimeout(() => onOpen && onOpen(), 380); });
      document.body.appendChild(b);
      setTimeout(() => { b.classList.add("hello"); chop(b); setTimeout(() => b.classList.remove("hello"), 3500); }, 1500);
      return b;
    },
    chop
  };
})();
