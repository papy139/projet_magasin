import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-primary" : "text-gray-600 hover:text-primary"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary shrink-0">
          Super Boutique
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Catalogue
          </NavLink>
          <NavLink to="/historique" className={navLinkClass}>
            Mes commandes
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </div>

        {/* Panier + hamburger */}
        <div className="flex items-center gap-4 ml-auto">
          <Link
            to="/panier"
            className="relative flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Panier</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger mobile */}
          <button
            className="md:hidden p-1 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          <NavLink
            to="/"
            end
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Catalogue
          </NavLink>
          <NavLink
            to="/historique"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Mes commandes
          </NavLink>
          <NavLink
            to="/admin"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </NavLink>
        </div>
      )}
    </nav>
  );
}
