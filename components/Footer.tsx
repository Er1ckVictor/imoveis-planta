import { Icon } from './Icons';
import { BrandMark } from './Brand';
import { site, formatPhone, whatsappUrl, mailUrl } from '@/lib/site';
import { content } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-cols">
        <div>
          <a className="brand" href="#" aria-label={`${site.name}, início`}><BrandMark />{site.brand}</a>
          <p className="f-note">{content.footer.text}</p>
        </div>
        <nav aria-label="Rodapé">
          <h3>Navegação</h3>
          <ul role="list">
            <li><a href="#imoveis" data-scroll-to="imoveis">Imóveis</a></li>
            <li><a href="#servicos" data-scroll-to="servicos">Serviços</a></li>
            <li><a href="#orcamento" data-scroll-to="orcamento">Orçamento</a></li>
            <li><a href="#contato" data-scroll-to="contato">Contato</a></li>
          </ul>
        </nav>
        <div>
          <h3>Atendimento</h3>
          <ul role="list" className="f-ic">
            <li><a href={whatsappUrl()} rel="noopener"><Icon name="chat" />{formatPhone(site.whatsapp)}</a></li>
            <li><a href={mailUrl()}><Icon name="mail" />{site.email}</a></li>
            <li><Icon name="pin" />{site.address}</li>
          </ul>
        </div>
        <div>
          <h3>Institucional</h3>
          <ul role="list">
            <li>{site.creci}</li>
            <li><a href={content.footer.privacyUrl}>Política de privacidade</a></li>
            <li>Fotos: <a href="https://unsplash.com/license" rel="noopener">Unsplash</a></li>
          </ul>
        </div>
      </div>
      <div className="wordmark" aria-hidden="true"><span>{site.brand}</span></div>
      <div className="wrap f-base">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <a href="#" className="to-top">Voltar ao topo<Icon name="arrow" /></a>
      </div>
    </footer>
  );
}
