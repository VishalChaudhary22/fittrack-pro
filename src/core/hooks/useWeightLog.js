// Extracted from the V1 WeightLogPage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed.

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useScrollRestoration } from './useScrollRestoration';

export function useWeightLog() {
  useScrollRestoration('/weight-log');
  const { user, healthLogs, setHealthLogs, addToast } = useApp();
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState({ weight: '', notes: '' });
  const [confirm, setConfirm] = useState(null);

  const userLogs = useMemo(() =>
    [...healthLogs]
      .filter(l => l.userId === user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [healthLogs, user.id]);

  const startEdit = (log) => { setEditId(log.id); setEditVal({ weight: log.weight, notes: log.notes || '' }); };
  const saveEdit = () => {
    setHealthLogs(p => p.map(l => l.id === editId ? { ...l, weight: parseFloat(editVal.weight), notes: editVal.notes } : l));
    setEditId(null);
    addToast('Weight entry updated', 'success');
  };

  const deleteLog = (id) => {
    setConfirm({
      title: 'Delete Entry?', message: 'This weight log entry will be permanently removed.',
      danger: true, confirmLabel: 'Delete',
      onConfirm: () => {
        setHealthLogs(p => p.filter(l => l.id !== id));
        setConfirm(null);
        addToast('Entry deleted', 'info');
      },
    });
  };

  return { confirm, deleteLog, editId, editVal, isImpWeight, saveEdit, setConfirm, setEditId, setEditVal, startEdit, userLogs };
}
