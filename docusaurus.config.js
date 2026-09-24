// @ts-check
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AFRL-ARES',
  tagline: 'ARES OS Ecosystem - Autonomous Lab Orchestration',
  url: 'https://afrl-ares.github.io',
  baseUrl: '/',
  
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'AFRL-ARES',
  projectName: 'afrl-ares.github.io',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'jzzRBlf7j5NRPxmlK_hXfdlnISQHsz3c7tov3K8hKdE',
      },
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/ARESLogo.png',

      metadata: [
        {
          name: 'keywords',
          content: 'ARES OS 2.0, PyAres, self-driving lab, smart lab, autonomous experimentation, laboratory automation, AFRL, gRPC',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],

      navbar: {
        logo: {
          alt: 'AFRL-ARES',
          src: '/img/BlackARESLogo.png',
          srcDark: '/img/ARESLogo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'ares/intro', 
            position: 'left',
            label: 'ARES OS 2.0',
          },
          {
            type: 'doc',
            docId: 'pyares/intro',
            label: 'PyAres',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'launcher/intro',
            label: 'ARES Launcher',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'datamodel/intro',
            label: 'Datamodel',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'athena/intro',
            label: 'Educational ARES',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Developed by the Air Force Research Laboratory (AFRL). Licensed under the MIT License. Distribution A. Approved for public release: distribution unlimited. AFRL-2025-5329`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;