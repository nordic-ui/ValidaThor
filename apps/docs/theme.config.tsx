import { useRouter } from 'next/router'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import React from 'react'

const WordMark = () => (
  <span className="logo-wordmark">
    Valida<span>Thor</span> <span className="emoji-fix">⚡️</span>
  </span>
)

const config = {
  logo: <WordMark />,
  project: {
    link: 'https://github.com/kosai106/validathor',
  },
  docsRepositoryBase: 'https://github.com/Kosai106/ValidaThor/tree/main/apps/docs',
  useNextSeoProps() {
    const { asPath } = useRouter()
    return {
      titleTemplate: asPath === '/' ? '%s' : '%s – ValidaThor ⚡️',
    }
  },
  head: () => {
    const { asPath } = useRouter()
    const { frontMatter } = useConfig()
    const url = 'https://validathor.oesterkilde.dk' + asPath

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || 'ValidaThor ⚡️'} />
        <meta
          property="og:image"
          content={frontMatter.image || 'https://validathor.oesterkilde.dk/meta.png'}
        />
        <meta
          property="og:description"
          content={frontMatter.description || 'A super simple validation library.'}
        />
        <meta
          name="description"
          content={frontMatter.description || 'A super simple validation library.'}
        />
      </>
    )
  },

  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
  },
  footer: {
    // Disables the included theme footer
    component: <></>,
  },
  banner: {
    key: 'alpha-banner',
    text: (
      <p>
        <span className="emoji-fix">⚠️</span> This project is still in early alpha. Please report
        bugs on GitHub.
      </p>
    ),
    dismissible: true,
  },

  // search: {
  //   component: (props) => {
  //     console.log(props)
  //     return (<div>Search</div>)
  //   }
  // }

  main({ children }) {
    return <>{children}</>
  },
} satisfies DocsThemeConfig

export default config
