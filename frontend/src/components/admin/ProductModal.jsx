import { useEffect, useState } from "react";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  category: "",
  image_url: "",
};

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
    />
  );
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  loading,
  error,
}) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(EMPTY);
  const [customCategory, setCustomCategory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          name: initialData.name || "",
          description: initialData.description || "",
          price: initialData.price != null ? String(initialData.price) : "",
          stock: initialData.stock != null ? String(initialData.stock) : "0",
          category: initialData.category || "",
          image_url: initialData.image_url || "",
        });
        setCustomCategory(
          initialData.category
            ? !categories.includes(initialData.category)
            : false,
        );
      } else {
        setForm(EMPTY);
        setCustomCategory(false);
      }
    }
  }, [isOpen, initialData, categories]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCategorySelect = (e) => {
    if (e.target.value === "__new__") {
      setCustomCategory(true);
      setForm((f) => ({ ...f, category: "" }));
    } else {
      setCustomCategory(false);
      setForm((f) => ({ ...f, category: e.target.value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      category: form.category,
      image_url: form.image_url,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Nom" required>
                <Input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Nom du produit"
                  required
                />
              </Field>
            </div>

            <Field label="Prix (€)" required>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={set("price")}
                placeholder="0.00"
                required
              />
            </Field>

            <Field label="Stock">
              <Input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                placeholder="0"
              />
            </Field>

            <div className="col-span-2">
              <Field label="Catégorie">
                {customCategory ? (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={form.category}
                      onChange={set("category")}
                      placeholder="Nouvelle catégorie..."
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomCategory(false);
                        setForm((f) => ({ ...f, category: "" }));
                      }}
                      className="shrink-0 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <select
                    value={form.category}
                    onChange={handleCategorySelect}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition appearance-none bg-white"
                  >
                    <option value="">Sans catégorie</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__new__">+ Nouvelle catégorie...</option>
                  </select>
                )}
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="URL image">
                <Input
                  type="text"
                  value={form.image_url}
                  onChange={set("image_url")}
                  placeholder="https://..."
                />
              </Field>
              {form.image_url && (
                <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>

            <div className="col-span-2">
              <Field label="Description">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Description du produit..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                />
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  {isEdit ? "Enregistrement..." : "Ajout en cours..."}
                </>
              ) : isEdit ? (
                "Enregistrer"
              ) : (
                "Ajouter le produit"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
