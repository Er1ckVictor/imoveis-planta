'use client';

import { useState } from 'react';
import { Icon, type IconName } from './Icons';
import { SERVICOS, TIPOS, validateLead, leadMessage, onlyDigits, type Lead } from '@/lib/lead';
import { whatsappUrl } from '@/lib/site';
import { content } from '@/lib/content';
import { asset } from '@/lib/asset';

const CHIP_ICONS: Record<string, IconName> = { Comprar: 'home', Vender: 'tag', Alugar: 'key', 'Avaliar meu imóvel': 'chart' };
type Field = 'nome' | 'tel' | 'email';
const BENEFIT_ICONS: IconName[] = ['clock', 'chart', 'shield', 'check'];

function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length > 7) return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

export default function Quote() {
  const [lead, setLead] = useState<Lead>({ servico: 'Comprar', tipo: 'Apartamento', bairro: '', nome: '', tel: '', email: '', msg: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState<{ url: string; note?: string } | null>(null);
  const [website, setWebsite] = useState(''); // armadilha para robôs

  const set = (k: keyof Lead) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = k === 'tel' ? maskPhone(e.target.value) : e.target.value;
    const next = { ...lead, [k]: value };
    setLead(next);
    if (k in errors && errors[k as Field]) setErrors(prev => ({ ...prev, [k]: validateLead(next)[k as Field] }));
  };
  const blur = (k: Field) => () => { if (lead[k]) setErrors(prev => ({ ...prev, [k]: validateLead(lead)[k] })); };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (website) return; // robô preencheu o campo invisível
    const errs = validateLead(lead);
    setErrors(errs);
    const first = (['nome', 'tel', 'email'] as Field[]).find(k => errs[k]);
    if (first) { document.getElementById(`f-${first}`)?.focus(); return; }

    // abre o WhatsApp no mesmo clique (navegadores bloqueiam se for depois de uma espera)
    const url = whatsappUrl(leadMessage(lead));
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setDone({ url });
  };

  const fieldProps = (k: Field) => ({
    id: `f-${k}`, name: k, value: lead[k], onChange: set(k), onBlur: blur(k),
    'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `e-${k}` : undefined,
  });

  return (
    <section className="quote" id="orcamento" aria-labelledby="orcamento-title">
      <div className="wrap quote-grid">
        <div className="quote-aside">
          <h2 className="sec-title" id="orcamento-title" data-reveal="words">{content.quote.title}</h2>
          <p className="sec-lede" data-reveal="fade">{content.quote.text}</p>
          <ul className="checks" role="list">
            {content.quote.benefits.map((b, i) => (
              <li data-reveal="fade" key={b}><Icon name={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} />{b}</li>
            ))}
          </ul>
          <figure className="quote-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/assets/imoveis/apartamento-cozinha.jpg')} alt="" width={1400} height={933} loading="lazy" />
          </figure>
        </div>

        <form className="form" noValidate onSubmit={submit}>
          <fieldset className="field">
            <legend>O que você precisa?</legend>
            <div className="chips">
              {SERVICOS.map(s => (
                <label key={s}>
                  <input type="radio" name="servico" value={s} checked={lead.servico === s} onChange={set('servico')} />
                  <span><Icon name={CHIP_ICONS[s]} />{s}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="row">
            <div className="field">
              <label htmlFor="f-tipo">Tipo de imóvel</label>
              <select id="f-tipo" name="tipo" value={lead.tipo} onChange={set('tipo')}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-bairro">Bairro ou cidade</label>
              <span className="inp"><Icon name="pin" /><input id="f-bairro" name="bairro" autoComplete="address-level2" placeholder="Ex.: Pinheiros, São Paulo" value={lead.bairro} onChange={set('bairro')} /></span>
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label htmlFor="f-nome">Nome</label>
              <span className="inp"><Icon name="user" /><input {...fieldProps('nome')} autoComplete="name" required /></span>
              {errors.nome && <p className="err" id="e-nome">{errors.nome}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-tel">WhatsApp</label>
              <span className="inp"><Icon name="chat" /><input {...fieldProps('tel')} inputMode="tel" autoComplete="tel" placeholder="(11) 90000-0000" required /></span>
              {errors.tel && <p className="err" id="e-tel">{errors.tel}</p>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-email">E-mail <span className="opt">(opcional)</span></label>
            <span className="inp"><Icon name="mail" /><input {...fieldProps('email')} type="email" autoComplete="email" /></span>
            {errors.email && <p className="err" id="e-email">{errors.email}</p>}
          </div>
          <div className="field">
            <label htmlFor="f-msg">Mensagem <span className="opt">(opcional)</span></label>
            <textarea id="f-msg" name="msg" rows={3} placeholder="Conte o que é importante para você: número de quartos, faixa de valor, prazo…" value={lead.msg} onChange={set('msg')} />
          </div>
          <div className="hp" aria-hidden="true">
            <label htmlFor="f-website">Não preencha este campo</label>
            <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
          </div>
          <div className="form-foot">
            <button className="btn btn-ink" type="submit"><Icon name="chat" />Enviar pelo WhatsApp</button>
            <p className="form-note">Ao enviar, abrimos o WhatsApp com a sua mensagem pronta.</p>
          </div>
          {done && (
            <p className="form-ok" role="status">
              Sua mensagem está pronta. Se o WhatsApp não abriu, <a href={done.url} target="_blank" rel="noopener">abra a conversa por aqui</a>.
              {done.note && <><br />{done.note}</>}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
