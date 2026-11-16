/** Imóveis da vitrine. mode: 'venda' | 'aluguel'. rooms: null para imóveis sem quartos (ex.: sala comercial). */
export type Listing = {
  mode: 'venda' | 'aluguel';
  type: string;
  bairro: string;
  price: string;
  suffix?: string;
  area: number;
  rooms: number | null;
  baths: number;
  cars: number;
  img: string;
  alt: string;
  desc: string;
};

export const LISTINGS: Listing[] = [
  { mode: 'venda', type: 'Casa em condomínio', bairro: 'Jardim Europa', price: 'R$ 2.450.000', area: 320, rooms: 4, baths: 5, cars: 4, img: '/assets/imoveis/casa-moderna.jpg', alt: 'Casa moderna de dois andares com fachada iluminada ao entardecer', desc: 'Projeto contemporâneo com pé-direito duplo, fachada em vidro e área gourmet integrada ao jardim.' },
  { mode: 'venda', type: 'Casa com piscina', bairro: 'Alto da Boa Vista', price: 'R$ 1.890.000', area: 280, rooms: 3, baths: 4, cars: 3, img: '/assets/imoveis/casa-piscina.jpg', alt: 'Casa branca com piscina e terraço', desc: 'Três suítes, piscina aquecida e terraço na cobertura com vista para o bairro.' },
  { mode: 'venda', type: 'Apartamento', bairro: 'Centro', price: 'R$ 780.000', area: 92, rooms: 3, baths: 2, cars: 2, img: '/assets/imoveis/apartamento-predio.jpg', alt: 'Prédio residencial moderno com fachada escura', desc: 'Andar alto, varanda com fechamento em vidro e prédio com academia e coworking.' },
  { mode: 'venda', type: 'Casa com vista', bairro: 'Serra Verde', price: 'R$ 1.350.000', area: 240, rooms: 3, baths: 3, cars: 2, img: '/assets/imoveis/casa-campo.jpg', alt: 'Sala com paredes de vidro voltadas para a mata', desc: 'Sala com paredes de vidro de piso a teto voltadas para a mata, lareira e deck.' },
  { mode: 'venda', type: 'Cobertura', bairro: 'Jardins', price: 'R$ 3.200.000', area: 210, rooms: 3, baths: 4, cars: 3, img: '/assets/imoveis/cobertura.jpg', alt: 'Sala de cobertura com sofá modular branco', desc: 'Living amplo com acabamento em pedra, terraço privativo e três vagas cobertas.' },
  { mode: 'aluguel', type: 'Apartamento mobiliado', bairro: 'Pinheiros', price: 'R$ 4.200', suffix: '/mês', area: 68, rooms: 2, baths: 2, cars: 1, img: '/assets/imoveis/apartamento-quarto.jpg', alt: 'Quarto claro com cama de casal e janela ampla', desc: 'Pronto para morar, com móveis planejados, varanda e portaria 24 horas.' },
  { mode: 'aluguel', type: 'Apartamento', bairro: 'Vila Nova', price: 'R$ 3.100', suffix: '/mês', area: 74, rooms: 2, baths: 1, cars: 1, img: '/assets/imoveis/apartamento-cozinha.jpg', alt: 'Cozinha branca com ilha e banquetas', desc: 'Cozinha americana com ilha, área de serviço separada e condomínio com lazer.' },
  { mode: 'aluguel', type: 'Sala comercial', bairro: 'Centro empresarial', price: 'R$ 6.500', suffix: '/mês', area: 120, rooms: null, baths: 2, cars: 2, img: '/assets/imoveis/sala-comercial.jpg', alt: 'Escritório com divisórias de vidro', desc: 'Planta livre com divisórias de vidro, ar-condicionado central e recepção compartilhada.' },
];
