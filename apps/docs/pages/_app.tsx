import type { AppProps } from 'next/app';

import { useAnalytics } from '../lib/analytics';

import '../styles.css'
 
export default function MyApp({ Component, pageProps }: AppProps) {
  useAnalytics();
  return <Component {...pageProps} />
}
