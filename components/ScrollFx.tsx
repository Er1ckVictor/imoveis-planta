'use client';

/*
  Animações das seções guiadas pela rolagem (GSAP + ScrollTrigger):
  títulos em máscaras, entradas suaves, linhas e ícones desenhados nos serviços, progresso das etapas,
  foto com parallax no orçamento, frase grande do contato, marca do rodapé, menu escuro sobre seções
  pretas e destaque da seção atual no menu.
*/
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToSection } from './Nav';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollFx() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $$ = (s: string, r: ParentNode = document) => [...r.querySelectorAll<HTMLElement>(s)];
    const mm = gsap.matchMedia();

    // links internos marcados com data-scroll-to (respeitam seções fixadas)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-scroll-to]');
      if (a) { e.preventDefault(); scrollToSection(a.dataset.scrollTo!); return; }
      const top = (e.target as HTMLElement).closest('.to-top');
      if (top) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
    };
    document.addEventListener('click', onClick);

    const ctx = gsap.context(() => {
      // títulos: palavras sobem de máscaras
      $$('[data-reveal="words"]').forEach(el => {
        const text = el.textContent?.trim() ?? '';
        if (!el.querySelector('.w-mask')) {
          el.setAttribute('aria-label', text);
          el.innerHTML = text.split(/\s+/).map(w => `<span class="w-mask" aria-hidden="true"><span>${w}</span></span>`).join(' ');
        }
        if (!reduce) gsap.from(el.querySelectorAll('.w-mask > span'), { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });

      if (!reduce) {
        $$('[data-reveal="fade"]').forEach(el => gsap.from(el, { y: 24, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

        // serviços: linha e ícone desenhados
        $$('.service').forEach(row => {
          const paths = row.querySelectorAll('[pathLength]');
          gsap.set(row, { '--line': 0 }); gsap.set(paths, { '--draw': 1 });
          gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%', once: true } })
            .to(row, { '--line': 1, duration: 1.1, ease: 'power3.inOut' })
            .from(row.querySelectorAll('h3, p'), { y: 18, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.15)
            .to(paths, { '--draw': 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.12 }, 0.2);
        });

        // orçamento
        const ph = document.querySelector('.quote-photo');
        if (ph) {
          gsap.fromTo(ph, { clipPath: 'inset(30% 0 0 0 round 18px)' }, { clipPath: 'inset(0% 0 0 0 round 18px)', ease: 'power3.out', duration: 1.4, scrollTrigger: { trigger: ph, start: 'top 85%', once: true } });
          gsap.fromTo('.quote-photo img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: ph, start: 'top bottom', end: 'bottom top', scrub: true } });
        }
        gsap.from('.form > :not(.hp)', { y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: '.form', start: 'top 80%', once: true } });

        // contato e rodapé
        $$('.big-line').forEach(l => {
          const dir = Number(l.dataset.dir);
          gsap.fromTo(l, { xPercent: dir * -12, autoAlpha: 0.15 }, { xPercent: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: '.big', start: 'top 95%', end: 'top 35%', scrub: 0.8 } });
        });
        gsap.fromTo('.wordmark span', { yPercent: 60 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
      }

      // como funciona: progresso ligado à rolagem
      const steps = $$('.step');
      const line = document.querySelector<HTMLElement>('.steps-line i');
      mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, c => {
        const vertical = !!c.conditions?.mob;
        ScrollTrigger.create({
          trigger: '.steps', start: vertical ? 'top 70%' : 'top 75%', end: vertical ? 'bottom 55%' : 'bottom 45%',
          onUpdate: self => {
            const p = self.progress;
            if (line) line.style.transform = vertical ? `scaleY(${p})` : `scaleX(${p})`;
            steps.forEach((s, i) => s.classList.toggle('on', p > 0.02 && p >= i / steps.length));
          },
        });
        if (!reduce) gsap.from(steps, { y: 40, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });
      });

      // menu escuro sobre seções pretas
      const navH = () => document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 76;
      $$('.process, .footer').forEach(sec => {
        ScrollTrigger.create({
          trigger: sec, start: () => `top ${navH()}px`, end: () => `bottom ${navH()}px`,
          onToggle: self => document.body.classList.toggle('nav-dark', self.isActive),
        });
      });

      // seção atual destacada no menu
      ['imoveis', 'servicos', 'orcamento', 'contato'].forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 50%', end: 'bottom 50%',
          onToggle: self => $$(`[data-sec="${id}"]`).forEach(a => (self.isActive ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'))),
        });
      });
    });

    ScrollTrigger.sort();
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 300);
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      document.removeEventListener('click', onClick);
      document.body.classList.remove('nav-dark');
      mm.revert(); ctx.revert();
    };
  }, []);

  return null;
}
