'use client';

import { MapPin } from 'lucide-react';
import { regions, Region } from '@/lib/regions';

interface RegionSelectorProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

export default function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-200">
      <MapPin size={16} className="text-slate-600 flex-shrink-0" />
      <select
        value={selectedRegion.id}
        onChange={(e) => {
          const region = regions.find(r => r.id === e.target.value);
          if (region) onRegionChange(region);
        }}
        className="text-sm font-medium text-slate-700 bg-transparent border-none outline-none cursor-pointer min-w-0"
      >
        {regions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
}
