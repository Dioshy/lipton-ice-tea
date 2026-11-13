/* the-pour: runs when the page is parsed; `root` is this section's element. */
(() => {
  const root = document.querySelector('[data-ws="the-pour"]');
  if (!root) return;

// The pour: one pinned, scrubbed timeline. Heat → pour → ice → peel → cold → the line.
// The CSS above is the finished (cold) state, so no-JS and reduced-motion visitors see it as-is.
// Note: "plugin:notification|is_permission_granted not allowed by ACL" comes from the host app's
// Tauri notification plugin; nothing in this section calls it, so it is fixed in the app's capabilities, not here.
if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap || !window.ScrollTrigger) return;

const q = (s) => root.querySelector(s);
const qa = (s) => root.querySelectorAll(s);
const stage = q(".stage");
const ices = qa(".ice");
const deg = q("[data-deg]");
const reading = { v: 34 };
const slapIn = [q(".k-title"), q(".k-eyebrow")];
const sticker = q(".sticker");

// starting state: a hot glass mid-pour, never empty
gsap.set(q(".stream"), { scaleY: .6, transformOrigin: "50% 0%" });
gsap.set(q(".tea"), { y: 100 });
gsap.set(ices, { y: -340, rotation: (i) => [-40, 30, -22][i], transformOrigin: "50% 50%" });
gsap.set([q(".lemon"), ...qa(".beads circle")], { scale: 0, transformOrigin: "50% 50%" });
gsap.set(q(".chill"), { opacity: 0 });
gsap.set(q(".frost"), { yPercent: 105 });
gsap.set(q(".merc"), { scaleX: .95 });
gsap.set(q(".merc.hot"), { opacity: 1 });
gsap.set([...slapIn, sticker], { opacity: 0, scale: 1.12, rotation: -4, transformOrigin: "20% 80%" });
deg.textContent = reading.v;

// a poster slap: 1.12 → 1, overshooting its tilt by 2° and settling with a hard back-out
const slap = { keyframes: [
  { opacity: 1, scale: 1, rotation: 2, duration: .22, ease: "power4.out" },
  { rotation: 0, duration: .14, ease: "back.out(3)" }
], stagger: .18 };

const tl = gsap.timeline({
  defaults: { ease: "none" },
  scrollTrigger: { trigger: stage, pin: true, start: "top top", end: "+=240%", scrub: .6, anticipatePin: 1 }
});

tl
  // heat: haze drifts while the tea keeps falling
  .to(q(".haze"), { x: -40, duration: 4.6 }, 0)
  .to(q(".stream"), { scaleY: 1, duration: .6, ease: "power2.out" }, .3)
  .to(q(".tea"), { y: 0, duration: 2.6, ease: "power1.inOut" }, .8)
  // ice drops in one cube at a time, each landing with a hard back-out
  .to(ices, { y: 0, rotation: 0, duration: .7, ease: "back.out(2.5)", stagger: .45 }, 2)
  // stream lets go from the top, lemon slaps onto the rim
  .set(q(".stream"), { transformOrigin: "50% 100%" }, 4.2)
  .to(q(".stream"), { scaleY: 0, duration: .5, ease: "power2.in" }, 4.2)
  .to(q(".lemon"), { scale: 1, duration: .5, ease: "back.out(3)" }, 4.4)
  // the turning point: the sun poster is torn off the wall, the thermometer falls
  .to(q(".sun"), { rotation: 22, yPercent: -125, xPercent: -18, duration: 1.2, ease: "power2.inOut" }, 4.6)
  .to(q(".merc"), { scaleX: .15, duration: 1.6, ease: "power2.inOut" }, 4.6)
  .to(q(".merc.hot"), { opacity: 0, duration: .6 }, 5)
  .to(reading, { v: 4, duration: 1.6, ease: "power2.inOut", onUpdate: () => { deg.textContent = Math.round(reading.v); } }, 4.6)
  // cold slaps up over the wall, the glass sweats, the sticker lands
  .to(q(".frost"), { yPercent: 0, duration: .5, ease: "back.out(1.6)" }, 5.4)
  .to(q(".chill"), { opacity: 1, duration: .6 }, 5.4)
  .to(sticker, slap, 5.7)
  .to(qa(".beads circle"), { scale: 1, duration: .3, ease: "back.out(3)", stagger: .08 }, 5.8)
  // the line: two posters slapped on, one after the other
  .to(slapIn, slap, 6.1)
  // hold the cold before the pin releases
  .to({}, { duration: 1.4 });

})();
