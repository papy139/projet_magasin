// frontend/src/hooks/useProductFilters.js
import { useState, useMemo } from 'react';

export function useProductFilters(products) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // 'all' | 'in' | 'out'
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterStock('all');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setSortKey('');
    setSortDir('asc');
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name?.toLowerCase().includes(q) &&
          !p.category?.toLowerCase().includes(q) &&
          !p.description?.toLowerCase().includes(q)
        ) return false;
      }
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterStock === 'in' && p.stock === 0) return false;
      if (filterStock === 'out' && p.stock > 0) return false;
      if (filterMinPrice !== '' && Number(p.price) < Number(filterMinPrice)) return false;
      if (filterMaxPrice !== '' && Number(p.price) > Number(filterMaxPrice)) return false;
      return true;
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        let av = a[sortKey];
        let bv = b[sortKey];
        if (sortKey === 'price' || sortKey === 'stock') {
          av = Number(av);
          bv = Number(bv);
        } else {
          av = String(av ?? '').toLowerCase();
          bv = String(bv ?? '').toLowerCase();
        }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, search, filterCategory, filterStock, filterMinPrice, filterMaxPrice, sortKey, sortDir]);

  return {
    search, setSearch,
    filterCategory, setFilterCategory,
    filterStock, setFilterStock,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
    sortKey, sortDir, toggleSort,
    resetFilters,
    filtered,
  };
}
