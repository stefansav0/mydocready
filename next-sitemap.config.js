/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.mydocready.com",

  generateRobotsTxt: true,

  sitemapSize: 5000,

  changefreq: "weekly",

  priority: 0.7,

  exclude: [
    "/admin/*",
    "/api/*",
    "/secret",
    "/profile",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/secret",
          "/profile",
          "/signin",
          "/signup",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
  },
};