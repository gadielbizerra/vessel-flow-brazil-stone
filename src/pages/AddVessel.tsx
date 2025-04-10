
import React from 'react';
import { useNavigate } from 'react-router-dom';
import VesselForm from '@/components/VesselForm';
import Layout from '@/components/Layout';
import { VesselFormData } from '@/types/vessel';
import { addVessel } from '@/services/vesselService';

const AddVessel: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAddVessel = (data: VesselFormData) => {
    addVessel(data);
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="container max-w-4xl">
        <VesselForm onSubmit={handleAddVessel} />
      </div>
    </Layout>
  );
};

export default AddVessel;
