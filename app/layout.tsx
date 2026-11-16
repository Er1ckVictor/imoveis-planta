import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import './globals.css';
import { IconSprite } from '@/components/Icons';
import { site, formatPhone } from '@/lib/site';
import { content } from '@/lib/content';

const description = content.seo.description;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: content.seo.title || `${site.name} | Compra, venda e locação de imóveis`, template: `%s | ${site.name}` },
  description,
  openGraph: { type: 'website', locale: 'pt_BR', siteName: site.name, title: site.name, description, images: [`${site.url}/assets/room-bg.jpg`] },
  alternates: { canonical: `${site.url}/` },
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: site.name,
    url: site.url,
    image: `${site.url}/assets/room-bg.jpg`,
    telephone: formatPhone(site.phone),
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: site.city, addressRegion: site.state, addressCountry: 'BR' },
    sameAs: site.social.map(s => s.url),
  };
  return (
    <html lang="pt-BR">
      <body className="is-intro">
        <noscript>
          <style>{`.letterbox{display:none!important}body{overflow:auto!important}`}</style>
        </noscript>
        <IconSprite />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
