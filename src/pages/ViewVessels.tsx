
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import VesselTimeline from '@/components/VesselTimeline';
import { getAllVessels, deleteVessel } from '@/services/vesselService';
import { Vessel } from '@/types/vessel';

const ViewVessels: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load vessels on initial render
    loadVessels();
  }, []);
  
  const loadVessels = () => {
    const data = getAllVessels();
    setVessels(data);
  };
  
  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };
  
  const handleDelete = (id: string) => {
    deleteVessel(id);
    loadVessels();
  };
  
  return (
    <Layout>
      <div className="container">
        <VesselTimeline 
          vessels={vessels} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </Layout>
  );
};

export default ViewVessels;
