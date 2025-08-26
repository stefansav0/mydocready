/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mydocready.com',  // Replace with your actual domain
  generateRobotsTxt: true,            // Generate robots.txt file
  changefreq: 'daily',                // How frequently pages are likely to change
  priority: 0.7,                     // Priority for pages (0.0 to 1.0)
  sitemapSize: 5000,                 // Max URLs per sitemap file
  exclude: ['/admin/**', '/secret'],  // Paths you want to exclude from sitemap
  // Optional: additionalPaths if you have custom URLs outside of Next.js routes
  // additionalPaths: async (config) => [
  //   await config.transform(config, '/custom-page'),
  // ],
};
