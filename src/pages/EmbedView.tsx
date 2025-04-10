
import React, { useState, useEffect } from 'react';
import VesselTimeline from '@/components/VesselTimeline';
import { getAllVessels } from '@/services/vesselService';
import { Vessel } from '@/types/vessel';

const EmbedView: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  
  useEffect(() => {
    // Load vessels from local storage
    const data = getAllVessels();
    setVessels(data);
  }, []);
  
  return (
    <div className="p-4 h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        <VesselTimeline 
          vessels={vessels} 
          onEdit={() => {}} 
          onDelete={() => {}}
        />
      </div>
    </div>
  );
};

export default EmbedView;
