import { load, trackPageview } from 'fathom-client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useAnalytics = () => {
  const router = useRouter();

  if (!process.env.NEXT_PUBLIC_FATHOM_SITE_ID) {
    throw new Error('NEXT_PUBLIC_FATHOM_SITE_ID is not set');
  }

  useEffect(() => {
    load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID, {
      url: 'https://cdn.usefathom.com/script.js',
      includedDomains: ['validathor.oesterkilde.dk'],
    });

    const onRouteChangeComplete = () => {
      trackPageview();
    };

    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);
};
