// @ts-check
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AFRL-ARES',
  tagline: 'ARES OS Ecosystem',
  url: 'https://afrl-ares.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'AFRL-ARES',
  projectName: 'afrl-ares.github.io',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'AFRL-ARES',
          src: '/img/BlackARESLogo.png',
          srcDark: '/img/ARESLogo.png'
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