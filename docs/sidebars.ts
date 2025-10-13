import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Comenzar',
      items: [
        'getting-started',
        'architecture',
      ],
    },
    {
      type: 'category',
      label: '🔐 Autenticación',
      items: [
        'authentication',
      ],
    },
    {
      type: 'category',
      label: '🗄️ Base de Datos',
      items: [
        'database',
      ],
    },
    {
      type: 'category',
      label: '🧪 Testing',
      items: [
        'testing',
      ],
    },
    {
      type: 'category',
      label: '🔗 API Reference',
      items: [
        'api-reference',
      ],
    },
    {
      type: 'category',
      label: '🚀 Deployment',
      items: [
        'deployment',
      ],
    },
  ],
};

export default sidebars;
