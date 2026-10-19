// components/Footer.jsx

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row">
      <p>© {new Date().getFullYear()} Hirely. Built for learning — not a live platform.</p>
      <p className="font-display font-semibold text-ink">Connect. Hire. Build.</p>
    </div>
  </footer>
);

export default Footer;
