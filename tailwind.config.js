/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: { orange:'#f97316', amber:'#d97706', teal:'#0891b2', green:'#059669' },
        surface: { DEFAULT:'#ffffff', subtle:'#f8fafc', muted:'#f1f5f9', border:'#e2e8f0', border2:'#cbd5e1' },
        ink: { DEFAULT:'#0f172a', muted:'#475569', faint:'#94a3b8' },
      },
      fontFamily: {
        sans: ['Inter','system-ui','sans-serif'],
        mono: ['JetBrains Mono','monospace'],
        disp: ['Syne','sans-serif'],
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.06)',
        'card-md':'0 4px 24px rgba(0,0,0,0.08),0 1px 4px rgba(0,0,0,0.04)',
        'card-lg':'0 8px 40px rgba(0,0,0,0.10),0 2px 8px rgba(0,0,0,0.05)',
        'brand':  '0 4px 24px rgba(249,115,22,0.18)',
        'teal':   '0 4px 24px rgba(8,145,178,0.18)',
      },
      animation: { 'float':'float 6s ease-in-out infinite' },
      keyframes: { float:{ '0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-12px)'} } },
    },
  },
  plugins: [],
}
