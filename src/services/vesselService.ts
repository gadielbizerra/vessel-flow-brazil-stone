
import { Vessel, VesselFormData } from '@/types/vessel';

// This is a simple in-memory storage for vessels
// In a real app, you'd use localStorage, Firebase, Supabase, etc.
const STORAGE_KEY = 'vesselview_vessels';

// Load vessels from localStorage
const loadVessels = (): Vessel[] => {
  try {
    const storedVessels = localStorage.getItem(STORAGE_KEY);
    return storedVessels ? JSON.parse(storedVessels) : [];
  } catch (error) {
    console.error('Failed to load vessels from storage', error);
    return [];
  }
};

// Save vessels to localStorage
const saveVessels = (vessels: Vessel[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vessels));
  } catch (error) {
    console.error('Failed to save vessels to storage', error);
  }
};

// Get all vessels
export const getAllVessels = (): Vessel[] => {
  return loadVessels();
};

// Add a new vessel
export const addVessel = (vesselData: VesselFormData): Vessel => {
  const vessels = loadVessels();
  
  const newVessel: Vessel = {
    id: crypto.randomUUID(),
    name: vesselData.name,
    loadingPort: {
      name: vesselData.loadingPortName,
      eta: vesselData.loadingPortEta,
      etd: vesselData.loadingPortEtd,
    },
    dischargePort: {
      name: vesselData.dischargePortName,
      eta: vesselData.dischargePortEta,
      etd: vesselData.dischargePortEtd,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  vessels.push(newVessel);
  saveVessels(vessels);
  
  return newVessel;
};

// Update a vessel
export const updateVessel = (id: string, vesselData: VesselFormData): Vessel | null => {
  const vessels = loadVessels();
  const index = vessels.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  const updatedVessel: Vessel = {
    ...vessels[index],
    name: vesselData.name,
    loadingPort: {
      name: vesselData.loadingPortName,
      eta: vesselData.loadingPortEta,
      etd: vesselData.loadingPortEtd,
    },
    dischargePort: {
      name: vesselData.dischargePortName,
      eta: vesselData.dischargePortEta,
      etd: vesselData.dischargePortEtd,
    },
    updatedAt: new Date().toISOString(),
  };
  
  vessels[index] = updatedVessel;
  saveVessels(vessels);
  
  return updatedVessel;
};

// Delete a vessel
export const deleteVessel = (id: string): boolean => {
  const vessels = loadVessels();
  const filteredVessels = vessels.filter(v => v.id !== id);
  
  if (filteredVessels.length === vessels.length) return false;
  
  saveVessels(filteredVessels);
  return true;
};

// Get a specific vessel by ID
export const getVesselById = (id: string): Vessel | null => {
  const vessels = loadVessels();
  const vessel = vessels.find(v => v.id === id);
  return vessel || null;
};
