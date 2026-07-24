import { useEffect } from 'react';

export default function SiteInitializer() {
  useEffect(() => {
    async function init() {
      const [Lenis, gsapModule, ScrollTriggerModule] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      const lenis = new Lenis.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      const gsap = gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      const sections = document.querySelectorAll('.section-reveal');
      sections.forEach((section) => {
        const children = section.querySelectorAll('.reveal-child');
        children.forEach((child) => {
          gsap.set(child, { opacity: 0, y: 60 });
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          onEnter: () => {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
            });
          },
          once: true,
        });
      });
    }

    init();
  }, []);

  return null;
}
