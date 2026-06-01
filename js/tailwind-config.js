/* Shared Tailwind Play CDN config — loaded after the CDN script on every page */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        'primary-deep': '#047857',
        'primary-deeper': '#065F46',
        secondary: '#10B981',
        accent: '#EA580C',
        'accent-soft': '#FB923C',
        bg: '#ECFDF5',
        card: '#FFFFFF',
        ink: '#0F172A',
        'ink-soft': '#334155',
        muted: '#F0F8F6',
        'muted-ink': '#64748B',
        border: '#E1F2ED',
        earth: '#8B5E34'
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body: ['Raleway', 'system-ui', 'sans-serif']
      },
      borderRadius: { organic: '24px', 'organic-lg': '32px' },
      boxShadow: {
        soft: '0 8px 32px rgba(5, 150, 105, 0.10)',
        'soft-lg': '0 18px 50px rgba(5, 150, 105, 0.14)'
      }
    }
  }
};
