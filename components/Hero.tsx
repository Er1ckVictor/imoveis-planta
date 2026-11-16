'use client';

import { useEffect } from 'react';
import { Icon } from './Icons';
import { scrollToSection } from './Nav';
import { content } from '@/lib/content';
import { asset } from '@/lib/asset';

const BEATS = content.hero.scenes;
const H = content.hero;

export default function Hero() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import('@/lib/hero').then(({ initHero }) => {
      if (!cancelled) cleanup = initHero();
    });
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToSection(id); };

  return (
    <>
      <div className="letterbox" aria-hidden="true">
        <div className="bar top" /><div className="bar bottom" />
        <div className="mark">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="6" width="52" height="52" pathLength={1} />
            <path d="M6 34 H34 V6 M34 46 V58 M46 34 H58" pathLength={1} />
          </svg>
        </div>
      </div>

      <section className="hero" aria-labelledby="hero-title">
        <div className="stage">
          <canvas id="gl" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="frame-fallback" src={asset('/assets/room-bg.jpg')} alt="" />

          <div className="copy">
            <h1 className="headline" id="hero-title">
              {H.title.map(l => <span className="mask" key={l}><span className="wd">{l}</span></span>)}
            </h1>
            <p className="lede">{H.text}</p>
            <div className="actions">
              <a className="btn btn-ink" href="#imoveis" onClick={go('imoveis')}><Icon name="search" />{H.ctaPrimary}</a>
              <a className="btn btn-line" href="#orcamento" onClick={go('orcamento')}><Icon name="chart" />{H.ctaSecondary}</a>
            </div>
          </div>

          <div className="beats" aria-live="off">
            <div className="scrim" />
            {BEATS.map((b, i) => (
              <div className="beat" data-beat={i} key={b.title}>
                <div className="beat-index" aria-hidden="true">{BEATS.map((_, k) => <i key={k} className={k === i ? 'on' : undefined} />)}</div>
                <h2><span className="mask"><span className="wd">{b.title}</span></span></h2>
                <p>{b.lines.map(l => <span className="mask" key={l}><span>{l}</span></span>)}</p>
              </div>
            ))}
          </div>

          <div className="final">
            <div>
              <h2><span className="mask"><span className="wd">{H.finalTitle}</span></span></h2>
              <p><span className="mask"><span>{H.finalText}</span></span></p>
            </div>
            <div className="actions">
              <a className="btn btn-ink" href="#orcamento" onClick={go('orcamento')}><Icon name="calendar" />{H.finalCta}</a>
              <a className="btn btn-line" href="#contato" onClick={go('contato')}><Icon name="chat" />{H.finalCta2}</a>
            </div>
          </div>

          <span className="cue"><i aria-hidden="true" />{H.scrollHint}</span>
        </div>
      </section>
    </>
  );
}
