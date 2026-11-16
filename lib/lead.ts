/** Regras e mensagem do formulário de orçamento */
export const SERVICOS = ['Comprar', 'Vender', 'Alugar', 'Avaliar meu imóvel'] as const;
export const TIPOS = ['Apartamento', 'Casa', 'Casa em condomínio', 'Cobertura', 'Sala comercial', 'Terreno'] as const;

export type Lead = {
  servico: string; tipo: string; bairro: string; nome: string; tel: string; email: string; msg: string;
};

export const onlyDigits = (v: string) => v.replace(/\D/g, '');

export function validateLead(l: Partial<Lead>) {
  const errors: Partial<Record<'nome' | 'tel' | 'email', string>> = {};
  if ((l.nome ?? '').trim().length < 2) errors.nome = 'Informe seu nome para o corretor saber com quem fala.';
  if (![10, 11].includes(onlyDigits(l.tel ?? '').length)) errors.tel = 'Informe o WhatsApp com DDD, por exemplo (11) 90000-0000.';
  const email = (l.email ?? '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Confira o e-mail: falta o @ ou o domínio.';
  return errors;
}

export function leadMessage(l: Lead) {
  return [
    `Olá! Meu nome é ${l.nome.trim()}.`,
    `Quero: ${l.servico}.`,
    `Tipo de imóvel: ${l.tipo}.`,
    l.bairro.trim() && `Região: ${l.bairro.trim()}.`,
    `WhatsApp: ${l.tel}.`,
    l.email.trim() && `E-mail: ${l.email.trim()}.`,
    l.msg.trim() && `\n${l.msg.trim()}`,
  ].filter(Boolean).join('\n');
}
