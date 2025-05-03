import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import { useRegistry } from '../contexts/RegistryContext';
import { Database, Plus, Settings } from 'lucide-react';
import RegistryModal from '../components/modals/RegistryModal';
import RegistryManagementModal from '../components/modals/RegistryManagementModal';

const LandingPage: React.FC = () => {
  const { registries, setActiveRegistry } = useRegistry();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleRegistrySelect = (registryId: string) => {
    setActiveRegistry(registryId);
    navigate('/catalog');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Database className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Docker Registry Manager</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-8">
            Connect to and manage your Docker registries from a single intuitive interface.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => setIsAddModalOpen(true)}
              icon={<Plus />}
            >
              Add Registry
            </Button>
            
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => setIsManageModalOpen(true)}
              icon={<Settings />}
            >
              Manage Registries
            </Button>
          </div>
        </div>

        <div className="mt-8">
          {registries.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Saved Registries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registries.map(registry => (
                  <Card 
                    key={registry.id} 
                    hoverable
                    onClick={() => handleRegistrySelect(registry.id)}
                    className="transition-all duration-200"
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 flex items-center justify-center bg-blue-900 rounded-lg mr-3">
                        <Database className="h-5 w-5 text-blue-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="text-md font-medium text-white truncate">
                            {registry.name}
                          </h3>
                          {registry.isDefault && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-blue-900 text-blue-300 whitespace-nowrap">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{registry.url}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-8 text-center p-8 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Registries Found</h3>
              <p className="text-gray-400 mb-4">Add a registry to get started exploring your Docker images.</p>
             
            </div>
          )}
        </div>
      </div>

      <RegistryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <RegistryManagementModal 
        isOpen={isManageModalOpen} 
        onClose={() => setIsManageModalOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;
