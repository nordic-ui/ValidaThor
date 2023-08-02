import { DocsThemeConfig } from 'nextra-theme-docs'
import React from 'react'

const WordMark = () => <span className="logo-wordmark">Valida<span>Thor</span> <span className="emoji-fix">⚡️</span></span>

const config: DocsThemeConfig = {
  logo: <WordMark />,
  project: {
    link: 'https://github.com/kosai106/validathor',
  },
  docsRepositoryBase: 'https://github.com/Kosai106/ValidaThor/tree/main/apps/docs',
  footer: {
    // Disables the included theme footer
    component: <></>
  },
  banner: {
    key: 'alpha-banner',
    text: <p><span className="emoji-fix">⚠️</span> This project is still in early alpha. Please report bugs on GitHub.</p>,
    dismissible: true,
  }
}

export default config
