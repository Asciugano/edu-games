"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingAnimations() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      /*
       * ============================================================
       * HERO
       * ============================================================
       */

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      heroTimeline
        .from(".hero-badge", {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 45,
            duration: 0.8,
          },
          "-=0.35",
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 25,
            duration: 0.65,
          },
          "-=0.45",
        )
        .from(
          ".hero-actions",
          {
            opacity: 0,
            y: 20,
            duration: 0.55,
          },
          "-=0.35",
        )
        .from(
          ".hero-benefits",
          {
            opacity: 0,
            y: 15,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          ".hero-visual",
          {
            opacity: 0,
            x: 80,
            rotate: 5,
            scale: 0.92,
            duration: 1,
          },
          "-=0.65",
        )
        .from(
          ".hero-floating-card",
          {
            opacity: 0,
            scale: 0.7,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        );

      /*
       * Floating delle card.
       */

      gsap.to(".hero-floating-card", {
        y: -7,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
      });

      /*
       * ============================================================
       * HELPER
       * ============================================================
       *
       * L'animazione viene creata ogni volta che l'elemento
       * entra nella viewport.
       */

      const replayOnScroll = (
        selector: string,
        options: gsap.TweenVars,
        trigger: string = selector,
      ) => {
        const elements = gsap.utils.toArray<HTMLElement>(selector);

        elements.forEach((element) => {
          gsap.set(element, {
            opacity: 0,
          });

          ScrollTrigger.create({
            trigger: trigger === selector ? element : trigger,
            start: "top 80%",

            onEnter: () => {
              gsap.fromTo(
                element,
                {
                  opacity: 0,
                  y: options.y ?? 0,
                  x: options.x ?? 0,
                  scale: options.scale ?? 1,
                  rotate: options.rotate ?? 0,
                },
                {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1,
                  rotate: 0,
                  duration: options.duration ?? 0.7,
                  ease: options.ease ?? "power3.out",
                },
              );
            },

            onEnterBack: () => {
              gsap.fromTo(
                element,
                {
                  opacity: 0,
                  y: options.y ?? 0,
                  x: options.x ?? 0,
                  scale: options.scale ?? 1,
                  rotate: options.rotate ?? 0,
                },
                {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1,
                  rotate: 0,
                  duration: options.duration ?? 0.7,
                  ease: options.ease ?? "power3.out",
                },
              );
            },

            onLeaveBack: () => {
              gsap.set(element, {
                opacity: 0,
              });
            },
          });
        });
      };

      /*
       * ============================================================
       * INTRO
       * ============================================================
       */

      replayOnScroll(
        ".intro-content",
        {
          y: 45,
          duration: 0.8,
        },
        ".intro-section",
      );

      /*
       * ============================================================
       * FEATURES
       * ============================================================
       */

      const featuresTitle = gsap.utils.toArray<HTMLElement>(".features-title");
      featuresTitle.forEach((title, index) => {
        gsap.from(title, {
          xPercent: -100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.06,
        });

        ScrollTrigger.create({
          trigger: title,

          onEnter: () => {
            gsap.fromTo(
              title,
              {
                xPercent: -100,
                duration: 1.8,
                ease: "expo.out",
                stagger: 0.06,
              },
              {
                xPercent: 0,
                duration: 1.8,
                ease: "back",
                delay: index * 0.12,
                stagger: 0.06,
              },
            );
          },
        });
      });

      const featureCards = gsap.utils.toArray<HTMLElement>(".feature-card");

      featureCards.forEach((card, index) => {
        gsap.set(card, {
          opacity: 0,
          y: 60,
          scale: 0.96,
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",

          onEnter: () => {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 60,
                scale: 0.96,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: index * 0.12,
                ease: "back",
              },
            );
          },

          onEnterBack: () => {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 60,
                scale: 0.96,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: index * 0.12,
                ease: "power3.out",
              },
            );
          },

          onLeaveBack: () => {
            gsap.set(card, {
              opacity: 0,
              y: 60,
              scale: 0.96,
            });
          },
        });
      });

      /*
       * Numeri delle feature.
       */

      replayOnScroll(
        ".feature-number",
        {
          x: 25,
          duration: 0.6,
        },
        ".features-section",
      );

      /*
       * ============================================================
       * GAMES
       * ============================================================
       */

      replayOnScroll(
        ".games-heading",
        {
          y: 40,
          duration: 0.7,
        },
        ".games-section",
      );

      const gameCards = gsap.utils.toArray<HTMLElement>(".game-card");

      gameCards.forEach((card, index) => {
        gsap.set(card, {
          opacity: 0,
          y: 55,
          scale: 0.95,
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",

          onEnter: () => {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 55,
                scale: 0.95,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: index * 0.1,
                ease: "power3.out",
              },
            );
          },

          onEnterBack: () => {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 55,
                scale: 0.95,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: index * 0.1,
                ease: "power3.out",
              },
            );
          },

          onLeaveBack: () => {
            gsap.set(card, {
              opacity: 0,
              y: 55,
              scale: 0.95,
            });
          },
        });
      });

      /*
       * ============================================================
       * PROGRESSION
       * ============================================================
       */

      replayOnScroll(
        ".progression-content",
        {
          x: -60,
          duration: 0.85,
        },
        ".progression-section",
      );

      replayOnScroll(
        ".progression-card",
        {
          x: 70,
          rotate: 3,
          scale: 0.95,
          duration: 0.9,
        },
        ".progression-section",
      );

      /*
       * Progress bar.
       */

      const progressBar = document.querySelector(".progression-bar");

      if (progressBar) {
        gsap.set(progressBar, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        ScrollTrigger.create({
          trigger: ".progression-card",
          start: "top 75%",

          onEnter: () => {
            gsap.fromTo(
              progressBar,
              {
                scaleX: 0,
              },
              {
                scaleX: 1,
                duration: 1.2,
                delay: 0.4,
                ease: "power3.out",
              },
            );
          },

          onEnterBack: () => {
            gsap.fromTo(
              progressBar,
              {
                scaleX: 0,
              },
              {
                scaleX: 1,
                duration: 1.2,
                delay: 0.4,
                ease: "power3.out",
              },
            );
          },

          onLeaveBack: () => {
            gsap.set(progressBar, {
              scaleX: 0,
            });
          },
        });
      }

      /*
       * Stat cards.
       */

      replayOnScroll(
        ".progression-stat",
        {
          y: 20,
          duration: 0.5,
        },
        ".progression-card",
      );

      /*
       * ============================================================
       * CTA
       * ============================================================
       */

      replayOnScroll(
        ".cta-content",
        {
          y: 45,
          scale: 0.97,
          duration: 0.85,
        },
        ".cta-section",
      );

      /*
       * ============================================================
       * REFRESH
       * ============================================================
       *
       * Utile quando font, immagini o layout modificano l'altezza
       * della pagina dopo la creazione dei trigger.
       */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
