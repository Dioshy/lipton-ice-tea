/* footer: runs when the page is parsed; `root` is this section's element. */
(() => {
  const root = document.querySelector('[data-ws="footer"]');
  if (!root) return;

// Posters slap onto the wall one at a time: scale 1.12 → 1, the hard back-out
// overshoots the tilt by ~2° and settles. 180ms each, 90ms apart.
// Scrolling back up peels them off in reverse.
// Note: the "plugin:notification|is_permission_granted not allowed by ACL" rejection
// does not come from this section (nothing here uses promises or notifications);
// it is raised by the host app's Tauri permissions and has to be fixed there.
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap || !window.ScrollTrigger) return;

const STEP = 0.09;

function slapGroup(trigger, posters, start) {
  const tl = gsap.timeline({ paused: true });

  posters.forEach((el, i) => {
    const r = parseFloat(el.style.getPropertyValue("--r")) || 0;
    const last = el.hasAttribute("data-last");
    const kick = r >= 0 ? 6 : -6; // starts the tilt further over, so the ease overshoots back past it

    gsap.set(el, { opacity: 0, scale: last ? 1.22 : 1.12, rotation: r + kick });
    const at = i * STEP;
    tl.to(el, { opacity: 1, duration: 0.04, ease: "none" }, at)
      .to(el, { scale: 1, rotation: r, duration: last ? 0.24 : 0.18, ease: last ? "back.out(5)" : "back.out(4)" }, at);
  });

  ScrollTrigger.create({
    trigger,
    start,
    onEnter: () => tl.timeScale(1).play(),
    onLeaveBack: () => tl.timeScale(1.4).reverse()
  });
}

// the column wall builds first, then the wordmark slaps over all of it
const wrap = root.querySelector(".k-wrap");
slapGroup(wrap, wrap.querySelectorAll("[data-slap]"), "top 78%");

const word = root.querySelector(".word");
slapGroup(word, word.querySelectorAll("[data-slap]"), "top 92%");

})();
