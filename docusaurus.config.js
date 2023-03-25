// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'cookie.sh',
  tagline: 'cookieshake\'s webpage',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://cookie.sh',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cookieshake', // Usually your GitHub org/user name.
  projectName: 'cookie.sh', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  plugins: [
    [
      '@docusaurus/plugin-sitemap',
      {
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/ko/blog/tags/**'],
        filename: 'sitemap.xml',
      },
    ],
    [
      'content-pages',
      {
        id: 'pages',
        path: 'src/pages',
        routeBasePath: '/'
      }
    ],
    [
      'content-blog',
      {
        id: 'ko-blog',
        path: 'docs/ko/blog',
        routeBasePath: 'ko/blog',
        blogSidebarCount: 0
      }
    ],
    [
      'content-docs',
      {
        id: 'ko-wiki',
        path: 'docs/ko/wiki',
        routeBasePath: 'ko/wiki'
      }
    ],
    [
      'content-docs',
      {
        id: 'kotil',
        path: 'docs/ko/til',
        routeBasePath: 'ko/til'
      }
    ]
  ],
  themes: [
    [
      'classic',
      {
        customCss: require.resolve('./src/css/custom.css')
      }
    ]
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true
      },
      image: 'https://avatars.githubusercontent.com/u/19236401',
      navbar: {
        title: 'cookie.sh',
        logo: {
          alt: 'cookieshake\'s logo',
          src: 'https://avatars.githubusercontent.com/u/19236401',
          style: {
            borderRadius: '50%'
          }
        },
        items: [
          {to: '/ko/blog', label: 'Blog', position: 'left'},
          {to: '/ko/wiki', label: 'Wiki', position: 'left'},
          {to: '/ko/til', label: 'TIL', position: 'left'},
          {
            href: 'https://github.com/cookieshake',
            html: '<i class="bi bi-github" style="font-size: 1.5rem;"></i>',
            position: 'right'
          }
        ],
      },
      prism: {
        theme: require('prism-react-renderer/themes/nightOwl'),
        darkTheme: darkCodeTheme,
      },
    }),
  clientModules: [
    require.resolve('./src/modules/test.ts')
  ]
};

module.exports = config;
