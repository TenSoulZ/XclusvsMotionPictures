
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/gallery', changefreq: 'weekly', priority: 0.8 },
    { url: '/videos', changefreq: 'weekly', priority: 0.8 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
    { url: '/services', changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/blog', changefreq: 'weekly', priority: 0.8 },
    { url: '/live', changefreq: 'weekly', priority: 0.7 },
    { url: '/faq', changefreq: 'monthly', priority: 0.6 },
    { url: '/disclaimer', changefreq: 'yearly', priority: 0.3 },
    { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms-and-conditions', changefreq: 'yearly', priority: 0.3 },
];

const BASE_URL = 'https://xclusvsmotionpictures.com';

const generateSitemap = async () => {
    let blogPages = [];

    try {
        // Fetch published blog posts from local or remote API
        // For build time, we assume the backend is running or we have access to the DB.
        // If not, we might need a different strategy.
        // Here we attempt a fetch if the API is reachable.
        
        const response = await fetch(`${BASE_URL.replace('xmp-frontend', 'xmp-backend')}/api/blog/`);
        if (response.ok) {
            const data = await response.json();
            const posts = data.results || data;
            
            blogPages = posts.map(post => ({
                url: `/blog/${post.slug}`,
                changefreq: 'monthly',
                priority: 0.6,
                lastmod: post.updated_at || new Date().toISOString()
            }));
            
            console.log(`Found ${blogPages.length} blog posts for sitemap.`);
        }
    } catch (error) {
        console.warn("Could not fetch dynamic blog routes for sitemap generation. Using static pages only.", error);
    }

    const allPages = [...pages, ...blogPages];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${allPages.map(page => `
                <url>
                    <loc>${BASE_URL}${page.url}</loc>
                    <lastmod>${page.lastmod || new Date().toISOString()}</lastmod>
                    <changefreq>${page.changefreq}</changefreq>
                    <priority>${page.priority}</priority>
                </url>
            `).join('')}
        </urlset>
    `;

    fs.writeFileSync(path.resolve(__dirname, 'public', 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
};

generateSitemap();
