/* the-heat: runs when the page is parsed; `root` is this section's element. */
(() => {
  const root = document.querySelector('[data-ws="the-heat"]');
  if (!root) return;

// Note: this section never asks for notification permission. The
// "plugin:notification|is_permission_granted not allowed by ACL" rejection comes from the
// host app shell; fix it there (catch that call, or allow the permission in its Tauri capability).

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce && window.gsap && window.ScrollTrigger) {
  const posters = gsap.utils.toArray(root.querySelectorAll("[data-slap]"));
  // which way a poster leans decides which way it swings in
  const lean = el => (parseFloat(getComputedStyle(el).getPropertyValue("--r")) || 0) >= 0 ? 1 : -1;

  // Posters that reach the line together still paste one at a time, 90ms apart.
  let nextSlot = 0;
  const queueDelay = () => {
    const now = performance.now() / 1000;
    const at = Math.max(now, nextSlot);
    nextSlot = at + 0.09;
    return at - now;
  };

  // Slap: 1.12 → 1 with a hard back-out; the swing overshoots its tilt by ~2° and settles.
  const slap = el => gsap.fromTo(el,
    { autoAlpha: 0, scale: 1.12, rotation: -9 * lean(el) },
    { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.18, ease: "back.out(3)", delay: queueDelay(), overwrite: true });
  // Peel: scrolling back up lifts each poster as its top drops below the line, so the lowest go first.
  const peel = el => gsap.to(el,
    { autoAlpha: 0, scale: 1.06, rotation: 5 * lean(el), duration: 0.14, ease: "power2.out", overwrite: true });

  // Each poster has its own trigger, so every one is watched, however far down it sits.
  posters.forEach(el => {
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => slap(el),
      onLeaveBack: () => peel(el)
    });
    // Armed: only now hide a poster, and only if it's still below the line.
    if (st.start > st.scroll()) gsap.set(el, { autoAlpha: 0 });
  });

  // The thermometer climbs as the wall fills: 27° at the top of the section, the full reading at the bottom.
  const deg = root.querySelector("[data-deg]");
  const merc = root.querySelector(".merc");
  const peak = parseInt(deg.textContent, 10) || 34;
  const low = peak - 7;
  ScrollTrigger.create({
    trigger: root,
    start: "top 70%",
    end: "bottom 85%",
    onUpdate: self => {
      deg.textContent = Math.round(low + (peak - low) * self.progress) + "°";
      gsap.set(merc, { scaleY: 0.35 + 0.65 * self.progress });
    }
  });
  gsap.set(merc, { scaleY: 0.35 });
  deg.textContent = low + "°";
}

})();
