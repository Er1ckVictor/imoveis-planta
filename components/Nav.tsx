'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brand } from './Brand';
import { Icon, type IconName } from './Icons';
import { site, formatPhone, whatsappUrl, telUrl, mailUrl } from '@/lib/site';
import { content } from '@/lib/content';

const LINKS: { id: string; label: string; desc: string; icon: IconName }[] = [
  { id: 'imoveis', label: 'Imóveis', desc: 'Casas e apartamentos à venda e para alugar', icon: 'home' },
  { id: 'servicos', label: 'Serviços', desc: 'Compra, venda, locação e documentação', icon: 'grid' },
  { id: 'orcamento', label: 'Orçamento', desc: 'Avaliação gratuita do seu imóvel', icon: 'receipt' },
  { id: 'contato', label: 'Contato', desc: 'Telefone, endereço e horários', icon: 'chat' },
];

gsap.registerPlugin(ScrollTrigger);

/** Rola até a seção, respeitando seções fixadas (pin) do GSAP */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pinned = ScrollTrigger.getAll().find(t => t.pin && t.trigger === target);
  const top = pinned ? pinned.start : target.getBoundingClientRect().top + scrollY;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // mantém o menu no DOM durante a animação de saída
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore) (lastFocus.current && lastFocus.current !== document.body ? lastFocus.current : btnRef.current)?.focus({ preventScroll: true });
  }, []);

  const openMenu = () => {
    lastFocus.current = document.activeElement as HTMLElement;
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  // trava a rolagem, foco inicial e saída animada
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.toggle('menu-open', open);
    if (open) {
      const t = setTimeout(() => menuRef.current?.querySelector<HTMLElement>('.mm-nav a')?.focus({ preventScroll: true }), reduce ? 0 : 100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setMounted(false), reduce ? 0 : 150);
    return () => clearTimeout(t);
  }, [open]);

  // Esc fecha; Tab fica preso dentro do menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !menuRef.current || !btnRef.current) return;
      const f = [...menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'), btnRef.current];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const mq = matchMedia('(min-width: 901px)');
    const onMq = (e: MediaQueryListEvent) => { if (e.matches) close(false); };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { document.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); };
  }, [open, close]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const wasOpen = open;
    if (wasOpen) close(false);
    setTimeout(() => scrollToSection(id), wasOpen ? 160 : 0);
  };

  const social = site.social.filter(s => s.label !== 'TikTok');

  return (
    <>
      <header className="nav">
        <Brand />
        <nav aria-label="Principal">
          <ul>
            {LINKS.map(l => (
              <li key={l.id}><a href={`#${l.id}`} data-sec={l.id} onClick={go(l.id)}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-ink" href="#orcamento" onClick={go('orcamento')}>{content.nav.cta}</a>
        <button
          ref={btnRef}
          className="menu-btn"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="mmenu"
          onClick={() => (open ? close() : openMenu())}
        >
          <span /><span />
        </button>
      </header>

      <div ref={menuRef} className={`mmenu${open ? ' is-open' : ''}`} id="mmenu" role="dialog" aria-modal="true" aria-label="Menu" hidden={!mounted}>
        <nav className="mm-nav" aria-label="Menu principal">
          <ul role="list">
            {LINKS.map((l, i) => (
              <li key={l.id} style={{ '--i': i } as React.CSSProperties}>
                <a href={`#${l.id}`} data-sec={l.id} onClick={go(l.id)}>
                  <span className="mm-ic"><Icon name={l.icon} /></span>
                  <span className="mm-tx"><b>{l.label}</b><small>{l.desc}</small></span>
                  <Icon name="chev-r" className="mm-go" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mm-cta" style={{ '--i': 4 } as React.CSSProperties}>
          <a className="btn btn-ink" href="#orcamento" onClick={go('orcamento')}><Icon name="calendar" />Agendar visita</a>
          <a className="btn btn-line" href={whatsappUrl()} rel="noopener"><Icon name="chat" />WhatsApp</a>
        </div>
        <div className="mm-meta" style={{ '--i': 5 } as React.CSSProperties}>
          <a href={telUrl()}><Icon name="phone" />{formatPhone(site.phone)}</a>
          <a href={mailUrl()}><Icon name="mail" />{site.email}</a>
          <p><Icon name="clock" />{site.hoursWeek}</p>
          {social.length > 0 && (
            <ul className="mm-social" role="list">
              {social.map(s => <li key={s.label}><a href={s.url} rel="noopener">{s.label}</a></li>)}
            </ul>
          )}
          <p className="mm-creci">{site.creci}</p>
        </div>
      </div>
    </>
  );
}
