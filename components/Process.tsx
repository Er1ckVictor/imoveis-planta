import { Icon, type IconName } from './Icons';
import { content } from '@/lib/content';

const STEPS: { n: string; icon: IconName; title: string; text: string }[] = [
  { n: '01', icon: 'chat', title: 'Conversa', text: 'Entendemos o que você procura, quanto quer investir e o prazo.' },
  { n: '02', icon: 'search', title: 'Visitas', text: 'Montamos uma seleção e agendamos as visitas nos horários que funcionam para você.' },
  { n: '03', icon: 'doc', title: 'Proposta', text: 'Negociamos valor e condições e revisamos toda a documentação.' },
  { n: '04', icon: 'key', title: 'Chaves', text: 'Acompanhamos a assinatura, o registro e a entrega das chaves.' },
];

export default function Process() {
  return (
    <section className="process" aria-labelledby="processo-title">
      <div className="wrap">
        <h2 className="sec-title" id="processo-title" data-reveal="words">{content.process.title}</h2>
        <p className="sec-lede" data-reveal="fade">{content.process.text}</p>
        <div className="steps">
          <span className="steps-line" aria-hidden="true"><i /></span>
          <ol role="list">
            {STEPS.map(s => (
              <li className="step" key={s.n}>
                <span className="step-n">{s.n}</span>
                <span className="step-ic"><Icon name={s.icon} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
