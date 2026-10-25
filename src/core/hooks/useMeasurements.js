// Extracted from the V1 MeasurementsPage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed.

import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MEASUREMENT_FIELDS } from '../../data/constants';
import { gId, tod, fmt } from '../../utils/helpers';
import { useScrollRestoration } from './useScrollRestoration';

export function useMeasurements() {
  useScrollRestoration('/measurements');
  const { user, measurements, setMeasurements, addToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});
  const [chartField, setChartField] = useState('chest');

  const userMeasurements = useMemo(() =>
    [...measurements].filter(m => m.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [measurements, user.id]);

  const chartData = useMemo(() =>
    [...userMeasurements].reverse().map(m => ({
      date: fmt(m.date),
      value: m[chartField] || null,
    })).filter(d => d.value !== null),
    [userMeasurements, chartField]);

  const latest = userMeasurements[0] || {};

  const saveMeasurement = () => {
    const entry = { id: gId(), userId: user.id, date: tod(), ...form };
    setMeasurements(p => [...p, entry]);
    setForm({});
    setShowAdd(false);
    addToast('Measurements saved!', 'success');
  };

  return { chartData, chartField, form, latest, measurements, saveMeasurement, setChartField, setForm, setShowAdd, showAdd, userMeasurements };
}
