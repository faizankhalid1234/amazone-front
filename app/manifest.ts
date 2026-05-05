import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amazone - Online Shopping',
    short_name: 'Amazone',
    description: 'Amazone shopping app with products, cart, checkout and user accounts.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#131921',
    theme_color: '#131921',
    orientation: 'portrait',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
