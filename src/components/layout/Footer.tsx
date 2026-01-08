export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-3">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 text-xs text-slate-500 text-right">
        © {new Date().getFullYear()} Duális képzési rendszer
      </div>
    </footer>
  );
}
