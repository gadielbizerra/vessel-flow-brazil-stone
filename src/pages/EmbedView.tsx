
import React, { useState, useEffect } from 'react';
import VesselTimeline from '@/components/VesselTimeline';
import { getAllVessels } from '@/services/vesselService';
import { Vessel } from '@/types/vessel';

const EmbedView: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadVessels = async () => {
      setLoading(true);
      const data = await getAllVessels();
      setVessels(data);
      setLoading(false);
    };
    
    loadVessels();
  }, []);
  
  if (loading) {
    return (
      <div className="p-4 h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }
  
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
