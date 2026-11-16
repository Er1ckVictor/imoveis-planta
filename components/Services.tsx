import { Icon } from './Icons';
import { content } from '@/lib/content';

const SERVICES: { title: string; text: string; paths: string[] }[] = [
  { title: 'Compra assistida', text: 'Selecionamos imóveis pelo seu perfil, agendamos as visitas e conferimos a documentação antes da proposta.', paths: ['M6 22 L24 8 L42 22', 'M11 18 V41 H37 V18', 'M20 41 V29 H28 V41'] },
  { title: 'Venda com avaliação gratuita', text: 'Avaliamos o preço de mercado, fazemos fotos profissionais e anunciamos nos principais portais.', paths: ['M8 40 V20 L24 8 L40 20 V40 Z', 'M18 26 h12 M18 32 h8', 'M30 34 l3 3 l6 -7'] },
  { title: 'Locação e administração', text: 'Análise de inquilino, contrato digital, vistoria com fotos e repasse mensal do aluguel.', paths: ['M8 24 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', 'M24 24 H42 V30 M36 24 V29'] },
  { title: 'Lançamentos na planta', text: 'Acompanhamos a negociação com a construtora e as condições de pagamento durante a obra.', paths: ['M6 6 H42 V42 H6 Z', 'M6 26 H20 M28 26 H42 M24 6 V18', 'M20 26 A8 8 0 0 1 28 18'] },
  { title: 'Documentação e escritura', text: 'Certidões, contratos e registro em cartório revisados pela nossa assessoria jurídica.', paths: ['M12 6 H30 L38 14 V42 H12 Z', 'M30 6 V14 H38', 'M18 24 H32 M18 30 H32 M18 36 H26'] },
  { title: 'Financiamento', text: 'Simulamos com os principais bancos e cuidamos da aprovação do crédito junto com você.', paths: ['M9 12 H39 A3 3 0 0 1 42 15 V33 A3 3 0 0 1 39 36 H9 A3 3 0 0 1 6 33 V15 A3 3 0 0 1 9 12 Z', 'M6 20 H42', 'M12 29 H22'] },
];

export default function Services() {
  return (
    <section className="services" id="servicos" aria-labelledby="servicos-title">
      <div className="wrap services-grid">
        <div className="services-aside">
          <h2 className="sec-title" id="servicos-title" data-reveal="words">{content.services.title}</h2>
          <p className="sec-lede" data-reveal="fade">{content.services.text}</p>
          <a className="btn btn-ink" href="#orcamento" data-reveal="fade" data-scroll-to="orcamento"><Icon name="receipt" />{content.nav.cta}</a>
        </div>
        <ul className="service-list" role="list">
          {SERVICES.map(s => (
            <li className="service" key={s.title}>
              <svg className="ic" viewBox="0 0 48 48" aria-hidden="true">
                {s.paths.map(d => <path key={d} d={d} pathLength={1} />)}
              </svg>
              <div><h3>{s.title}</h3><p>{s.text}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
