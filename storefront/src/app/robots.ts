import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/checkout/',
        '/account/',
        '/cart/',
        '/wishlist/',
        '/complete-profile/',
      ],
    },
    sitemap: 'https://www.kevix.in/sitemap.xml',
  };
}
