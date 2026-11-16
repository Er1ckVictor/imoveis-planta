/**
 * Textos do site. Edite aqui.
 * Use "|" para quebrar linha nos campos com mais de uma linha.
 * Só o SEO vem do .env (NEXT_PUBLIC_SEO_TITLE e NEXT_PUBLIC_SEO_DESCRIPTION).
 */
const lines = (v: string) => v.split('|').map(s => s.trim()).filter(Boolean);

export const content = {
  seo: {
    title: (process.env.NEXT_PUBLIC_SEO_TITLE ?? '').trim(),
    description: (process.env.NEXT_PUBLIC_SEO_DESCRIPTION ?? '').trim() || 'Compra, venda e locação de imóveis residenciais e comerciais, com avaliação gratuita e acompanhamento até a escritura.',
  },
  nav: { cta: 'Pedir orçamento' },
  whatsappMessage: 'Olá! Vim pelo site e gostaria de falar com um corretor.',
  hero: {
    title: lines('A casa certa|começa pela sala.'),
    text: 'Compra, venda e locação de imóveis residenciais e comerciais, com avaliação gratuita e acompanhamento até a escritura.',
    ctaPrimary: 'Ver imóveis',
    ctaSecondary: 'Avaliar meu imóvel',
    scrollHint: 'Role para entrar',
    scenes: [
      { title: 'Comprar', lines: lines('Casas e apartamentos com a documentação|conferida antes de entrar no site.') },
      { title: 'Vender', lines: lines('Avaliação gratuita, fotos profissionais|e divulgação nos principais portais.') },
      { title: 'Alugar', lines: lines('Contrato digital, vistoria com fotos|e opções de garantia sem fiador.') },
    ],
    finalTitle: 'Venha conhecer de perto.',
    finalText: 'Um corretor acompanha você em cada visita, sem custo.',
    finalCta: 'Agendar visita',
    finalCta2: 'Falar no WhatsApp',
  },
  listings: { title: 'Imóveis escolhidos a dedo' },
  services: {
    title: 'Tudo o que o seu imóvel precisa, em um só lugar',
    text: 'Da primeira visita à entrega das chaves, uma equipe cuida de cada etapa para você não precisar correr atrás de nada.',
  },
  process: {
    title: 'Como funciona',
    text: 'Quatro etapas, com um corretor responsável do início ao fim.',
  },
  quote: {
    title: 'Peça um orçamento sem compromisso',
    text: 'Preencha os dados e a sua mensagem abre pronta no WhatsApp de um corretor.',
    benefits: lines('Resposta no mesmo dia útil|Avaliação do seu imóvel sem custo|Seus dados não são compartilhados'),
  },
  contact: { title: lines('Vamos encontrar|o seu próximo endereço.') },
  footer: {
    text: 'Compra, venda e locação de imóveis residenciais e comerciais.',
    privacyUrl: '#',
  },
};
