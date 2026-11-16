/**
 * Dados da imobiliária. Edite aqui.
 * Do .env vêm apenas: NEXT_PUBLIC_SITE_URL (SEO) e NEXT_PUBLIC_PHONE (telefone e WhatsApp).
 */
const digits = (v: string) => v.replace(/\D/g, '');
const phone = digits((process.env.NEXT_PUBLIC_PHONE ?? '').trim() || '5511900000000');

export const site = {
  url: ((process.env.NEXT_PUBLIC_SITE_URL ?? '').trim() || 'http://localhost:3000').replace(/\/$/, ''),
  name: 'Planta Imóveis',
  brand: 'planta',
  creci: 'CRECI 00000-J',
  whatsapp: phone,
  phone,
  email: 'contato@plantaimoveis.com.br',
  address: 'Rua Exemplo, 123, Centro',
  city: 'São Paulo',
  state: 'SP',
  hoursWeek: 'Segunda a sexta, 9h às 18h',
  hoursSat: 'Sábado, 9h às 13h',
  // deixe url vazia para esconder o botão
  social: [
    { label: 'Instagram', url: 'https://instagram.com/' },
    { label: 'Facebook', url: 'https://facebook.com/' },
    { label: 'LinkedIn', url: 'https://linkedin.com/' },
    { label: 'YouTube', url: 'https://youtube.com/' },
    { label: 'TikTok', url: '' },
  ].filter(s => s.url),
};

/** (11) 90000-0000 a partir de 5511900000000 */
export function formatPhone(raw: string) {
  let d = digits(raw);
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

/** Link do WhatsApp; sem texto, usa a mensagem padrão de lib/content.ts */
export const whatsappUrl = (text?: string) => {
  const t = text ?? 'Olá! Vim pelo site e gostaria de falar com um corretor.';
  return `https://wa.me/${site.whatsapp}${t ? `?text=${encodeURIComponent(t)}` : ''}`;
};
export const telUrl = () => `tel:+${site.phone}`;
export const mailUrl = () => `mailto:${site.email}`;
