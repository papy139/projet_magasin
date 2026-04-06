import { Link } from "react-router-dom";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xl font-bold text-accent">Super Boutique</span>
            <p className="text-green-200 text-sm mt-1">
              Votre boutique en ligne, simple et rapide.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-green-200">
            <Link to="/" className="hover:text-white transition-colors">
              Catalogue
            </Link>
            <Link to="/historique" className="hover:text-white transition-colors">
              Mes commandes
            </Link>
          </div>
        </div>
        <div className="border-t border-primary-light/20 mt-8 pt-6 text-center text-xs text-green-300/50">
          © {CURRENT_YEAR} Super Boutique — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
