import { Icon } from './Icons';
import { site, formatPhone, whatsappUrl, telUrl, mailUrl } from '@/lib/site';
import { content } from '@/lib/content';

export default function Contact() {
  return (
    <section className="contact" id="contato" aria-labelledby="contato-title">
      <div className="wrap">
        <h2 className="big" id="contato-title">
          {content.contact.title.map((l, i) => <span className="big-line" data-dir={i % 2 ? 1 : -1} key={l}>{l}</span>)}
        </h2>
        <div className="contact-grid">
          <div className="c-item" data-reveal="fade"><span className="c-ic"><Icon name="chat" /></span><h3>WhatsApp</h3><a href={whatsappUrl()} rel="noopener">{formatPhone(site.whatsapp)}</a></div>
          <div className="c-item" data-reveal="fade"><span className="c-ic"><Icon name="phone" /></span><h3>Telefone</h3><a href={telUrl()}>{formatPhone(site.phone)}</a></div>
          <div className="c-item" data-reveal="fade"><span className="c-ic"><Icon name="mail" /></span><h3>E-mail</h3><a href={mailUrl()}>{site.email}</a></div>
          <div className="c-item" data-reveal="fade"><span className="c-ic"><Icon name="pin" /></span><h3>Endereço</h3><p>{site.address}<br />{site.hoursWeek}<br />{site.hoursSat}</p></div>
        </div>
        {site.social.length > 0 && (
          <div className="social" data-reveal="fade">
            <h3>Redes sociais</h3>
            <ul role="list">
              {site.social.map(s => <li key={s.label}><a href={s.url} rel="noopener">{s.label}<Icon name="link" /></a></li>)}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
