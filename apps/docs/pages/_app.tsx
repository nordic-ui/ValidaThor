import type { AppProps } from 'next/app'
import { useEffect } from 'react'

import { useAnalytics } from '../lib/analytics'

import '../styles.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  useAnalytics()

  useEffect(() => {
    const HEADER_STYLE = 'color: #FFAB70; font-size: 16px; font-family: sans-serif;'
    const MESSAGE_STYLE = 'font-family: sans-serif;'
    const CODE_STYLE = 'color: #79B8FF; font-family: monospace;'

    async function init() {
      try {
        const validathor = await import('@nordic-ui/validathor')
        // @ts-expect-error - Add the library to the window object
        window.v = validathor
        // @ts-expect-error - Add the library to the window object
        window.validathor = validathor
        // Write a console.log message to inform the user that the library is available with an example
        console.log(
          `%c\nYou can now use the library in the browser console.
          \nTry   %cvalidathor.object({ name: validathor.string() }).parse({ name: 'John' })%c
          \nOr   %ctry { validathor.number().parse(true) } catch (err) { console.log('Validation failed:', err.message) }%c`,
          MESSAGE_STYLE,
          CODE_STYLE,
          MESSAGE_STYLE,
          CODE_STYLE,
          MESSAGE_STYLE,
        )
      } catch (err) {
        console.error('Something went wrong:', err)
      }
    }
    console.log(
      `%cValidaThor ⚡️%c\nRun %cinit()%c to make ValidaThor available in the browser console.`,
      HEADER_STYLE,
      MESSAGE_STYLE,
      CODE_STYLE,
      MESSAGE_STYLE,
    )
    // @ts-expect-error - Add the init function to the window
    window.init = init
  }, [])

  return <Component {...pageProps} />
}
