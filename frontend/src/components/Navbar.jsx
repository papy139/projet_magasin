import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center gap-6">
      <Link to="/" className="font-bold text-lg">
        E-commerce
      </Link>
      <Link to="/" className="hover:underline">
        Catalogue
      </Link>
      <Link to="/historique" className="hover:underline">
        Mes commandes
      </Link>
      <Link to="/admin" className="hover:underline">
        Admin
      </Link>
      <Link to="/panier" className="ml-auto hover:underline">
        Panier{" "}
        {itemCount > 0 && (
          <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-sm font-bold ml-1">
            {itemCount}
          </span>
        )}
      </Link>
    </nav>
  );
}
