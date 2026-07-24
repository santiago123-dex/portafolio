import { useEffect } from 'react';

export default function SiteInitializer() {
  useEffect(() => {
    async function init() {
      const [gsapModule, ScrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      const gsap = gsapModule.default;
      const ScrollTrigger = ScrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const sections = document.querySelectorAll('.section-reveal');
      sections.forEach((section) => {
        const children = section.querySelectorAll('.reveal-child');

        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(
              children,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: 'power2.out',
              },
            );
          },
          once: true,
        });
      });
    }

    init();
  }, []);

  return null;
}
