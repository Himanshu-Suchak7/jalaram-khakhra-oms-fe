export default function manifest() {
  return {
    name: 'Jalaram Khakhra OMS',
    short_name: 'Jalaram',
    description: 'Order Management System for Jalaram Khakhra',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/jalaram-bapa-image.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/jalaram-bapa-image.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/jalaram-bapa-image.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
