'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from './Icons';
import { LISTINGS, type Listing } from '@/data/listings';
import { scrollToSection } from './Nav';
import { content } from '@/lib/content';
import { asset } from '@/lib/asset';

gsap.registerPlugin(ScrollTrigger);

type Mode = Listing['mode'];
const pad2 = (n: number) => String(n).padStart(2, '0');
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function Listings() {
  const [mode, setMode] = useState<Mode>('venda');
  const [swapping, setSwapping] = useState(false);
  const [active, setActive] = useState(0);
  const [isDesk, setIsDesk] = useState<boolean | null>(null);
  const items = useMemo(() => LISTINGS.filter(l => l.mode === mode), [mode]);
  const secRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const activeRef = useRef(0);
  const modeLabel = mode === 'venda' ? 'À venda' : 'Para alugar';

  // desktop x celular
  useEffect(() => {
    const mq = matchMedia('(min-width: 901px)');
    const on = () => setIsDesk(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const select = (i: number) => { if (i !== activeRef.current) { activeRef.current = i; setActive(i); } };
  const setBars = (segP: number) => {
    secRef.current?.querySelectorAll<HTMLElement>('.ls-index .bar i').forEach((b, k) => {
      b.style.transform = `scaleX(${k === 0 ? 1 : clamp01(segP - (k - 1))})`;
    });
  };

  // Desktop: seção fixa; cada passo da rolagem troca o imóvel
  useEffect(() => {
    if (isDesk === null || !secRef.current) return;
    const sec = secRef.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeRef.current = 0; setActive(0);
    const ctx = gsap.context(() => {
      if (!isDesk) { setBars(0); return; }
      const figs = gsap.utils.toArray<HTMLElement>('.ls-fig', sec);
      const its = gsap.utils.toArray<HTMLElement>('.ls-item', sec);
      const lines = (it: HTMLElement) => it.querySelectorAll('.m > span');
      const blocks = (it: HTMLElement) => it.querySelectorAll('.ls-specs, .ls-actions');
      const n = items.length;
      figs.forEach((f, i) => { gsap.set(f, { yPercent: i ? 100 : 0 }); gsap.set(f.querySelector('img'), { yPercent: i ? -60 : 0, scale: i ? 1.12 : 1 }); });
      its.forEach((it, i) => { gsap.set(lines(it), { yPercent: i ? 110 : 0, opacity: i ? 0 : 1 }); gsap.set(blocks(it), { y: i ? 20 : 0, opacity: i ? 0 : 1 }); });
      gsap.set(rollRef.current!.firstElementChild, { yPercent: 0 });
      setBars(0);
      if (reduce || n < 2) return;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sec, pin: true, start: 'top top', end: () => '+=' + (n - 1) * innerHeight * 0.9,
          scrub: 0.6, invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), inertia: false, directional: false, duration: { min: 0.2, max: 0.3 }, delay: 0.1, ease: 'power2.inOut' },
          onUpdate: self => { const p = self.progress * (n - 1); setBars(p); select(Math.round(p)); },
        },
      });
      for (let i = 1; i < n; i++) {
        const t = i - 1, prev = its[i - 1], cur = its[i];
        tl.to(figs[i], { yPercent: 0, duration: 1, ease: 'power2.inOut' }, t)
          .to(figs[i].querySelector('img'), { yPercent: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, t)
          .to(figs[i - 1].querySelector('img'), { yPercent: -18, scale: 1.04, duration: 1, ease: 'power2.inOut' }, t)
          .to(lines(prev), { yPercent: -110, opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.03 }, t)
          .to(blocks(prev), { y: -14, opacity: 0, duration: 0.25, ease: 'power2.in', stagger: 0.02 }, t)
          .to(lines(cur), { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.04 }, t + 0.45)
          .to(blocks(cur), { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', stagger: 0.03 }, t + 0.55)
          .to(rollRef.current!.firstElementChild, { yPercent: (-100 * i) / n, duration: 0.4, ease: 'power2.inOut' }, t + 0.3);
      }
      tlRef.current = tl;
      gsap.from('.ls-media', { y: 24, opacity: 0, duration: 0.3, ease: 'power2.out', scrollTrigger: { trigger: '.ls-stage', start: 'top 80%', once: true } });
    }, sec);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => { ctx.revert(); tlRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesk, items]);

  // movimento reduzido no desktop: troca instantânea pelo índice
  useEffect(() => {
    if (!isDesk || tlRef.current || !secRef.current) return;
    const sec = secRef.current;
    sec.querySelectorAll<HTMLElement>('.ls-fig').forEach((f, k) => gsap.set(f, { yPercent: k <= active ? 0 : 100 }));
    sec.querySelectorAll<HTMLElement>('.ls-item').forEach((it, k) => gsap.set(it.querySelectorAll('.m > span, .ls-specs, .ls-actions'), { yPercent: 0, y: 0, opacity: k === active ? 1 : 0 }));
    if (rollRef.current?.firstElementChild) gsap.set(rollRef.current.firstElementChild, { yPercent: (-100 * active) / items.length });
    setBars(active);
  }, [active, isDesk, items.length]);

  // Celular: carrossel com deslize; cartão em foco inteiro, vizinhos recuam
  const syncMobile = () => {
    const el = infoRef.current; if (!el || isDesk) return;
    const w = el.scrollWidth - el.clientWidth;
    const segP = (w > 0 ? el.scrollLeft / w : 0) * (items.length - 1);
    setBars(segP); select(Math.round(segP));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    el.querySelectorAll<HTMLElement>('.ls-item').forEach(it => {
      const c = it.offsetLeft - el.offsetLeft + it.offsetWidth / 2;
      const d = Math.min(1, Math.abs(c - mid) / it.offsetWidth);
      it.style.transform = `scale(${1 - d * 0.06})`;
      it.style.opacity = String(1 - d * 0.45);
    });
  };
  useEffect(() => {
    const el = infoRef.current;
    if (isDesk !== false || !el) return;
    el.scrollLeft = 0;
    requestAnimationFrame(syncMobile);
    return () => el.querySelectorAll<HTMLElement>('.ls-item').forEach(it => { it.style.transform = ''; it.style.opacity = ''; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesk, items]);

  const goMobile = (i: number) => {
    const el = infoRef.current; if (!el) return;
    const it = el.querySelectorAll<HTMLElement>('.ls-item')[Math.max(0, Math.min(items.length - 1, i))]; if (!it) return;
    el.scrollTo({ left: it.offsetLeft - el.offsetLeft - (el.clientWidth - it.offsetWidth) / 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const goTo = (i: number) => {
    if (!isDesk) return goMobile(i);
    const st = tlRef.current?.scrollTrigger;
    if (!st) return select(i);
    window.scrollTo({ top: st.start + (st.end - st.start) * (i / (items.length - 1)) + 1, behavior: 'smooth' });
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    const st = tlRef.current?.scrollTrigger;
    const wasIn = !!st?.isActive, top = st?.start;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSwapping(true);
    setTimeout(() => {
      setMode(next);
      requestAnimationFrame(() => {
        if (wasIn && top != null) window.scrollTo({ top: top + 1 });
        requestAnimationFrame(() => setSwapping(false));
      });
    }, reduce ? 0 : 150);
  };

  const onSegKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next: Mode = mode === 'venda' ? 'aluguel' : 'venda';
    (e.currentTarget.querySelector(`[data-mode="${next}"]`) as HTMLElement)?.focus();
    switchMode(next);
  };

  return (
    <section ref={secRef} className={`listings${swapping ? ' is-swapping' : ''}`} id="imoveis" aria-labelledby="imoveis-title">
      <div className="ls-pin">
        <header className="ls-head wrap">
          <h2 className="sec-title" id="imoveis-title" data-reveal="words">{content.listings.title}</h2>
          <div className="ls-tools">
            <div className="seg" role="tablist" aria-label="Tipo de negócio" data-on={mode === 'venda' ? '0' : '1'} onKeyDown={onSegKey}>
              <button role="tab" aria-selected={mode === 'venda'} tabIndex={mode === 'venda' ? 0 : -1} data-mode="venda" onClick={() => switchMode('venda')}>Comprar</button>
              <button role="tab" aria-selected={mode === 'aluguel'} tabIndex={mode === 'aluguel' ? 0 : -1} data-mode="aluguel" onClick={() => switchMode('aluguel')}>Alugar</button>
              <span className="seg-thumb" aria-hidden="true" />
            </div>
            <a className="link" href="#orcamento" onClick={e => { e.preventDefault(); scrollToSection('orcamento'); }}>Ver todos</a>
          </div>
        </header>

        <div className="ls-stage wrap" key={mode}>
          <div className="ls-media">
            <div className="ls-figs">
              {items.map((l, i) => (
                <figure className="ls-fig" style={{ zIndex: i + 1 }} key={l.img}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(l.img)} alt={l.alt} loading={i ? 'lazy' : 'eager'} />
                </figure>
              ))}
            </div>
            <div className="ls-badge" aria-hidden="true">
              <span className="ls-mode">{modeLabel}</span>
              <span className="ls-count">
                <span className="ls-roll" ref={rollRef}><span>{items.map((_, i) => <i key={i}>{pad2(i + 1)}</i>)}</span></span>
                <span className="ls-of">/ {pad2(items.length)}</span>
              </span>
            </div>
          </div>

          <div className="ls-info" ref={infoRef} aria-live="polite" onScroll={syncMobile}>
            {items.map((l, i) => {
              const hidden = !!isDesk && i !== active;
              return (
                <article className="ls-item" key={l.img} aria-label={`${l.type}, ${l.bairro}`} aria-hidden={hidden || undefined} inert={hidden || undefined}>
                  <a className="ls-thumb" href="#orcamento" tabIndex={-1} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(l.img)} alt="" loading="lazy" />
                    <span className="ls-chip ls-chip-mode">{modeLabel}</span>
                    <span className="ls-chip ls-chip-n">{i + 1}/{items.length}</span>
                  </a>
                  <p className="ls-where m"><span><Icon name="pin" />{l.bairro}</span></p>
                  <h3 className="ls-type m"><span>{l.type}</span></h3>
                  <p className="ls-price m"><span>{l.price}{l.suffix && <> <small>{l.suffix}</small></>}</span></p>
                  <dl className="ls-specs">
                    <div><dt><Icon name="area" />Área</dt><dd>{l.area} m²</dd></div>
                    <div><dt><Icon name={l.rooms == null ? 'layers' : 'bed'} />{l.rooms == null ? 'Planta' : 'Quartos'}</dt><dd>{l.rooms == null ? 'Livre' : l.rooms}</dd></div>
                    <div><dt><Icon name="bath" />Banheiros</dt><dd>{l.baths}</dd></div>
                    <div><dt><Icon name="car" />Vagas</dt><dd>{l.cars}</dd></div>
                  </dl>
                  <p className="ls-desc m"><span>{l.desc}</span></p>
                  <div className="ls-actions">
                    <a className="btn btn-ink" href="#orcamento" onClick={e => { e.preventDefault(); scrollToSection('orcamento'); }}><Icon name="calendar" />Agendar visita</a>
                    <a className="link link-ic" href="#orcamento" onClick={e => { e.preventDefault(); scrollToSection('orcamento'); }}>Ver detalhes<Icon name="arrow" /></a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <ol className="ls-index wrap" role="list" aria-label="Lista de imóveis">
          {items.map((l, i) => (
            <li key={l.img} className={i === active ? 'on' : undefined}>
              <button type="button" aria-label={`Ver ${l.type}, ${l.bairro}`} aria-current={i === active || undefined} onClick={() => goTo(i)}>
                <span className="bar"><i /></span>
                <span className="nm">{l.type}, {l.bairro}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="ls-mnav wrap">
          <span className="ls-mcount"><b>{pad2(active + 1)}</b> de <span>{pad2(items.length)}</span></span>
          <div className="ls-mbtns">
            <button type="button" className="ls-prev" aria-label="Imóvel anterior" disabled={active === 0} onClick={() => goMobile(active - 1)}><Icon name="chev-l" /></button>
            <button type="button" className="ls-next" aria-label="Próximo imóvel" disabled={active === items.length - 1} onClick={() => goMobile(active + 1)}><Icon name="chev-r" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
