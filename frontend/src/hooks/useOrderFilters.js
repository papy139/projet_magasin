// frontend/src/hooks/useOrderFilters.js
import { useState, useMemo } from 'react';

export function useOrderFilters(orders) {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'confirmed'
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc'); // commandes récentes en premier par défaut

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSortKey('created_at');
    setSortDir('desc');
  };

  const filtered = useMemo(() => {
    let result = orders.filter((o) => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (filterDateFrom) {
        const from = new Date(filterDateFrom);
        from.setHours(0, 0, 0, 0);
        if (new Date(o.created_at) < from) return false;
      }
      if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(o.created_at) > to) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === 'id') {
        av = Number(av);
        bv = Number(bv);
      } else if (sortKey === 'created_at') {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else {
        av = String(av ?? '').toLowerCase();
        bv = String(bv ?? '').toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, filterStatus, filterDateFrom, filterDateTo, sortKey, sortDir]);

  return {
    filterStatus, setFilterStatus,
    filterDateFrom, setFilterDateFrom,
    filterDateTo, setFilterDateTo,
    sortKey, sortDir, toggleSort,
    resetFilters,
    filtered,
  };
}
