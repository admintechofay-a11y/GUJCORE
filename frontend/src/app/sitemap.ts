import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.gujcorr.org';
  const lastModified = new Date();

  const routes = [
    '',
    '/about',
    '/technical-sessions',
    '/call-for-papers',
    '/registration',
    '/sponsorship',
    '/souvenir',
    '/committee',
    '/advisory',
    '/supporters',
    '/venue',
    '/contact',
    '/schedule',
    '/speakers',
    '/exhibition',
    '/awards',
    '/invoice',
    '/faq',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/call-for-papers' || route === '/registration' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/registration' || route === '/call-for-papers' ? 0.9 : 0.8,
  }));
}
