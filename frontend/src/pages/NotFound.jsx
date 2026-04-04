// frontend/src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('404');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <p className="text-9xl font-extrabold text-indigo-600 leading-none">404</p>
      <p className="text-5xl mt-4">🔍</p>
      <h1 className="text-2xl font-bold text-gray-800 mt-6">Page introuvable</h1>
      <p className="text-gray-500 mt-2">L'adresse que vous cherchez n'existe pas.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
