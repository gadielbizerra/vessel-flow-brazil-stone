
import { Vessel, VesselFormData } from '@/types/vessel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Get all vessels
export const getAllVessels = async (): Promise<Vessel[]> => {
  const { data, error } = await supabase
    .from('vessels')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching vessels:', error);
    return [];
  }

  return data || [];
};

// Add a new vessel
export const addVessel = async (vesselData: VesselFormData): Promise<Vessel | null> => {
  const newVessel = {
    name: vesselData.name,
    loading_port: {
      name: vesselData.loadingPortName,
      eta: vesselData.loadingPortEta,
      etd: vesselData.loadingPortEtd,
    },
    discharge_port: {
      name: vesselData.dischargePortName,
      eta: vesselData.dischargePortEta,
      etd: vesselData.dischargePortEtd,
    },
  };

  const { data, error } = await supabase
    .from('vessels')
    .insert([newVessel])
    .select()
    .single();

  if (error) {
    console.error('Error adding vessel:', error);
    return null;
  }

  return data;
};

// Update a vessel
export const updateVessel = async (id: string, vesselData: VesselFormData): Promise<Vessel | null> => {
  const updatedVessel = {
    name: vesselData.name,
    loading_port: {
      name: vesselData.loadingPortName,
      eta: vesselData.loadingPortEta,
      etd: vesselData.loadingPortEtd,
    },
    discharge_port: {
      name: vesselData.dischargePortName,
      eta: vesselData.dischargePortEta,
      etd: vesselData.dischargePortEtd,
    },
  };

  const { data, error } = await supabase
    .from('vessels')
    .update(updatedVessel)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vessel:', error);
    return null;
  }

  return data;
};

// Delete a vessel
export const deleteVessel = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('vessels')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vessel:', error);
    return false;
  }

  return true;
};

// Get a specific vessel by ID
export const getVesselById = async (id: string): Promise<Vessel | null> => {
  const { data, error } = await supabase
    .from('vessels')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vessel:', error);
    return null;
  }

  return data;
};
