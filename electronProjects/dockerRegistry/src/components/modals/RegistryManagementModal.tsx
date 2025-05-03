import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../shared/Button';
import { useRegistry } from '../../contexts/RegistryContext';
import { Edit, Trash2, Check } from 'lucide-react';
import RegistryModal from './RegistryModal';
import { Registry } from '../../types/registry';

interface RegistryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistryManagementModal: React.FC<RegistryManagementModalProps> = ({ isOpen, onClose }) => {
  const { registries, removeRegistry, setActiveRegistry, activeRegistry } = useRegistry();
  const [registryToEdit, setRegistryToEdit] = useState<Registry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [registryToDelete, setRegistryToDelete] = useState<Registry | null>(null);

  const handleEditRegistry = (registry: Registry) => {
    setRegistryToEdit(registry);
    setIsEditModalOpen(true);
  };

  const handleDeleteRegistry = (registry: Registry) => {
    setRegistryToDelete(registry);
  };

  const confirmDelete = () => {
    if (registryToDelete) {
      removeRegistry(registryToDelete.id);
      setRegistryToDelete(null);
    }
  };

  const handleSelectRegistry = (registryId: string) => {
    setActiveRegistry(registryId);
    onClose();
  };

  const footer = (
    <div className="flex justify-between items-center">
      <Button 
        variant="danger" 
        onClick={() => setRegistryToDelete(null)}
        disabled={!registryToDelete}
        size="sm"
        icon={<Trash2 size={16} />}
      >
        {registryToDelete ? 'Cancel Delete' : 'Select to Delete'}
      </Button>
      
      <div className="flex gap-2">
        {registryToDelete && (
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            size="sm"
            icon={<Trash2 size={16} />}
          >
            Confirm Delete
          </Button>
        )}
        <Button onClick={() => setIsAddModalOpen(true)} size="sm">
          Add Registry
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Registry Management"
        size="lg"
        footer={footer}
      >
        <div className="space-y-2">
          {registries.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Registries Available</h3>
              <p className="text-gray-400 mb-4">Add a registry to get started</p>
            </div>
          ) : (
            registries.map(registry => (
              <div 
                key={registry.id} 
                className={`
                  flex justify-between items-center p-4 rounded-lg
                  ${registryToDelete?.id === registry.id ? 'bg-red-900 bg-opacity-30 border border-red-700' : 'bg-gray-800'}
                  ${activeRegistry?.id === registry.id ? 'border-l-4 border-blue-500' : ''}
                  cursor-pointer hover:bg-gray-700 transition-colors
                `}
              >
                <div 
                  className="flex-1 mr-4" 
                  onClick={() => handleSelectRegistry(registry.id)}
                >
                  <div className="flex items-center">
                    <h3 className="font-medium text-white">{registry.name}</h3>
                    {registry.isDefault && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-900 text-blue-300">
                        Default
                      </span>
                    )}
                    {activeRegistry?.id === registry.id && !registryToDelete && (
                      <span className="ml-2 flex items-center text-xs text-blue-400">
                        <Check size={14} className="mr-1" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{registry.url}</p>
                </div>
                
                <div className="flex space-x-1">
                  {registryToDelete?.id === registry.id ? (
                    <span className="text-sm text-red-400">Click "Confirm Delete" to remove</span>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditRegistry(registry)}
                        icon={<Edit size={16} />}
                        aria-label="Edit registry"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteRegistry(registry)}
                        icon={<Trash2 size={16} />}
                        aria-label="Delete registry"
                      />
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
      
      {isEditModalOpen && registryToEdit && (
        <RegistryModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          registry={registryToEdit}
        />
      )}
      
      <RegistryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default RegistryManagementModal;