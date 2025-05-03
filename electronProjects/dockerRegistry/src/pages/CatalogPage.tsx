import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import { getRepositories } from '../services/registryService';
import { useRegistry } from '../contexts/RegistryContext';
import { Box, Package, RefreshCw, Grid, List, Settings, Search } from 'lucide-react';
import EmptyState from '../components/shared/EmptyState';
import RegistryManagementModal from '../components/modals/RegistryManagementModal';
import Input from '../components/shared/Input';

const CatalogPage: React.FC = () => {
  const { activeRegistry } = useRegistry();
  const navigate = useNavigate();
  
  const [repositories, setRepositories] = useState<string[]>([]);
  const [filteredRepositories, setFilteredRepositories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!activeRegistry) {
      navigate('/');
      return;
    }

    fetchRepositories();
  }, [activeRegistry, navigate]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = repositories.filter(repo => 
        repo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRepositories(filtered);
    } else {
      setFilteredRepositories(repositories);
    }
  }, [searchQuery, repositories]);

  const fetchRepositories = async () => {
    if (!activeRegistry) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getRepositories(activeRegistry);
      console.log("response code",response)
      setRepositories(response.repositories || []);
      setFilteredRepositories(response.repositories || []);
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to load repositories. Please check your registry connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepositoryClick = (repository: string) => {
    navigate(`/repository/${encodeURIComponent(repository)}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-semibold text-white">Repository Catalog</h1>
              {activeRegistry && (
                <>
                  <p className="text-sm text-gray-400">
                    Connected to: <span className="text-blue-400">{activeRegistry.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    URL: <span className="text-blue-500">{activeRegistry.url}</span>
                  </p>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex">
                <Button
                  variant={viewType === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('grid')}
                  icon={<Grid size={18} />}
                  aria-label="Grid view"
                />
                <Button
                  variant={viewType === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('list')}
                  icon={<List size={18} />}
                  aria-label="List view"
                />
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchRepositories}
                icon={<RefreshCw size={18} />}
                isLoading={isLoading}
              >
                Refresh
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsManageModalOpen(true)}
                icon={<Settings size={18} />}
              >
                Manage
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                Change Registry
              </Button>
            </div>
          </div>
          
          {repositories.length > 0 && (
            <div className="mt-4">
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} />}
                fullWidth
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 text-white p-4 rounded-lg mt-4">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p className="text-gray-300">{error}</p>
            <Button onClick={fetchRepositories} className="mt-4" variant="secondary">
              Retry
            </Button>
          </div>
        ) : filteredRepositories.length === 0 ? (
          searchQuery ? (
            <EmptyState 
              title="No matching repositories"
              description={`No repositories match the search "${searchQuery}"`}
              actionText="Clear Search"
              onAction={() => setSearchQuery('')}
              icon={<Search size={48} />}
            />
          ) : (
            <EmptyState 
              title="No repositories found"
              description="This registry doesn't have any repositories or you don't have permission to view them."
              actionText="Go to Landing Page"
              onAction={() => navigate('/')}
              icon={<Package size={48} />}
            />
          )
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">
                {searchQuery ? `Search Results (${filteredRepositories.length})` : `All Repositories (${repositories.length})`}
              </h2>
            </div>
            
            {viewType === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRepositories.map(repository => (
                  <Card
                    key={repository}
                    hoverable
                    onClick={() => handleRepositoryClick(repository)}
                    className="transition-transform duration-200"
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 flex items-center justify-center bg-indigo-900 rounded-lg mr-3">
                        <Box className="h-6 w-6 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{repository.split('/').pop()}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {repository.includes('/') ? repository : <span className="italic text-gray-500"></span>}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
                <div className="border-b border-gray-700 divide-y divide-gray-700">
                  {filteredRepositories.map(repository => (
                    <div
                      key={repository}
                      className="p-4 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => handleRepositoryClick(repository)}
                    >
                      <div className="flex items-center">
                        <Box className="h-5 w-5 text-indigo-400 mr-3" />
                        <div>
                          <h3 className="font-medium text-white">{repository.split('/').pop()}</h3>
                          <p className="text-sm text-gray-400">
                            {repository.includes('/') ? repository : <span className="italic text-gray-500"></span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <RegistryManagementModal 
        isOpen={isManageModalOpen} 
        onClose={() => setIsManageModalOpen(false)} 
      />
    </div>
  );
};

export default CatalogPage;