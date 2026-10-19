// components/Loader.jsx
// Small inline spinner, e.g. <Loader label="Loading projects..." />

const Loader = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500" />
    <span className="text-sm">{label}</span>
  </div>
);

export default Loader;
