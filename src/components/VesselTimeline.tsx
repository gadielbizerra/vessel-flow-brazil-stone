
import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO, eachDayOfInterval, differenceInDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Vessel } from '@/types/vessel';
import { MapPin, Ship, Calendar, Trash2, Pencil, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VesselTimelineProps {
  vessels: Vessel[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VesselTimeline: React.FC<VesselTimelineProps> = ({ vessels, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  
  // Calculate the date range for the timeline
  const dateRange = useMemo(() => {
    if (!vessels.length) return { startDate: new Date(), endDate: addDays(new Date(), 30), days: 30 };
    
    let minDate = new Date();
    let maxDate = new Date();
    
    vessels.forEach(vessel => {
      const loadingEta = parseISO(vessel.loadingPort.eta);
      const dischargeEtd = parseISO(vessel.dischargePort.etd);
      
      if (loadingEta < minDate) minDate = loadingEta;
      if (dischargeEtd > maxDate) maxDate = dischargeEtd;
    });
    
    // Add padding to show more context
    minDate = addDays(minDate, -3);
    maxDate = addDays(maxDate, 3);
    
    const days = differenceInDays(maxDate, minDate) + 1;
    
    return {
      startDate: minDate,
      endDate: maxDate,
      days
    };
  }, [vessels]);
  
  // Generate array of dates for the timeline header
  const timelineDates = useMemo(() => {
    return eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate
    });
  }, [dateRange]);
  
  // Function to calculate the position and width of vessel segments
  const calculatePosition = (startDate: Date, endDate: Date) => {
    const totalDays = dateRange.days;
    const startDiff = differenceInDays(startDate, dateRange.startDate);
    const duration = differenceInDays(endDate, startDate) + 1;
    
    const startPercent = (startDiff / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;
    
    return {
      left: `${startPercent}%`,
      width: `${widthPercent}%`
    };
  };
  
  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };
  
  const confirmDelete = () => {
    if (!confirmDeleteId) return;
    
    onDelete(confirmDeleteId);
    toast({
      title: "Navio removido",
      description: "O navio foi removido com sucesso.",
    });
    setConfirmDeleteId(null);
  };
  
  const formatDateForDisplay = (dateString: string) => {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  if (vessels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Ship size={64} className="text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Nenhum navio cadastrado</h2>
        <p className="text-muted-foreground mb-6">Adicione navios para visualizar o timeline.</p>
        <Button asChild>
          <a href="/add">Adicionar Navio</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-fade-in">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Linha do Tempo - Movimentações de Navios</h2>
      </div>
      
      <div className="overflow-x-auto">
        {/* Timeline grid */}
        <div className="relative min-w-[800px]">
          {/* Timeline header with dates */}
          <div className="flex border-b sticky top-0 bg-white z-10">
            <div className="w-[200px] min-w-[200px] border-r py-2 px-4 bg-white">
              <span className="font-semibold">Navio</span>
            </div>
            <div className="flex-1 relative">
              {timelineDates.map((date, i) => (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 border-r text-xs py-1 px-2 ${
                    date.getDate() === 1 || i === 0 ? 'font-semibold' : ''
                  }`}
                  style={{
                    left: `${(i / timelineDates.length) * 100}%`,
                    width: `${100 / timelineDates.length}%`
                  }}
                >
                  {format(date, i === 0 || date.getDate() === 1 ? 'MMM dd' : 'dd', { locale: ptBR })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Vessel rows */}
          {vessels.map((vessel) => {
            const loadingStart = parseISO(vessel.loadingPort.eta);
            const loadingEnd = parseISO(vessel.loadingPort.etd);
            const dischargeStart = parseISO(vessel.dischargePort.eta);
            const dischargeEnd = parseISO(vessel.dischargePort.etd);
            
            const loadingPosition = calculatePosition(loadingStart, loadingEnd);
            const dischargePosition = calculatePosition(dischargeStart, dischargeEnd);
            
            return (
              <div key={vessel.id} className="flex border-b relative hover:bg-gray-50">
                {/* Vessel name column */}
                <div className="w-[200px] min-w-[200px] border-r py-4 px-4 flex items-center gap-2">
                  <Ship size={16} className="text-vessel-foreground" />
                  <span className="font-medium truncate">{vessel.name}</span>
                  
                  <div className="ml-auto flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => setSelectedVessel(vessel)}
                          >
                            <Info size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Detalhes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => onEdit(vessel.id)}
                          >
                            <Pencil size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(vessel.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                {/* Timeline segment area */}
                <div className="flex-1 relative h-16">
                  {/* Loading port segment */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="absolute h-8 top-4 rounded-md bg-loading flex items-center px-2 text-xs font-medium text-loading-foreground border border-loading/50 shadow-sm"
                          style={loadingPosition}
                        >
                          <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
                            <MapPin size={12} />
                            <span className="truncate">{vessel.loadingPort.name}</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">{vessel.loadingPort.name} (Carregamento)</p>
                          <div className="grid grid-cols-2 gap-x-2 text-xs">
                            <span>ETA:</span>
                            <span>{formatDateForDisplay(vessel.loadingPort.eta)}</span>
                            <span>ETD:</span>
                            <span>{formatDateForDisplay(vessel.loadingPort.etd)}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Discharge port segment */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="absolute h-8 top-4 rounded-md bg-discharge flex items-center px-2 text-xs font-medium text-discharge-foreground border border-discharge/50 shadow-sm"
                          style={dischargePosition}
                        >
                          <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
                            <MapPin size={12} />
                            <span className="truncate">{vessel.dischargePort.name}</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">{vessel.dischargePort.name} (Descarga)</p>
                          <div className="grid grid-cols-2 gap-x-2 text-xs">
                            <span>ETA:</span>
                            <span>{formatDateForDisplay(vessel.dischargePort.eta)}</span>
                            <span>ETD:</span>
                            <span>{formatDateForDisplay(vessel.dischargePort.etd)}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Vessel details dialog */}
      {selectedVessel && (
        <Dialog open={!!selectedVessel} onOpenChange={(open) => !open && setSelectedVessel(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                <span>{selectedVessel.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="bg-loading-light p-3 rounded-md space-y-2">
                <h3 className="text-loading-foreground font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Porto de Carregamento: {selectedVessel.loadingPort.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>ETA: {formatDateForDisplay(selectedVessel.loadingPort.eta)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>ETD: {formatDateForDisplay(selectedVessel.loadingPort.etd)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-discharge-light p-3 rounded-md space-y-2">
                <h3 className="text-discharge-foreground font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Porto de Descarga: {selectedVessel.dischargePort.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>ETA: {formatDateForDisplay(selectedVessel.dischargePort.eta)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>ETD: {formatDateForDisplay(selectedVessel.dischargePort.etd)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Cadastrado em: {format(parseISO(selectedVessel.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => onEdit(selectedVessel.id)}>
                <Pencil size={16} className="mr-2" />
                Editar
              </Button>
              <Button variant="destructive" onClick={() => {
                handleDeleteClick(selectedVessel.id);
                setSelectedVessel(null);
              }}>
                <Trash2 size={16} className="mr-2" />
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este navio? Esta ação não poderá ser desfeita.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VesselTimeline;
