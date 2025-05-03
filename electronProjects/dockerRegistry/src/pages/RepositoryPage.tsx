import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/shared/Button';
import Card from '../components/shared/Card';
import { getTags, getManifest } from '../services/registryService';
import { useRegistry } from '../contexts/RegistryContext';
import { Tag as TagIcon, ChevronLeft, RefreshCw, Grid, List, Clock, Search, HardDrive } from 'lucide-react';
import EmptyState from '../components/shared/EmptyState';
import TagDetailsModal from '../components/modals/TagDetailsModal';
import Input from '../components/shared/Input';
import { formatSize, formatDate } from '../utils/formatters';

interface TagItem {
  name: string;
  digest?: string;
  size?: string;
  created?: string;
}

const RepositoryPage: React.FC = () => {
  const { repository } = useParams<{ repository: string }>();
  const { activeRegistry } = useRegistry();
  const navigate = useNavigate();

  const [tags, setTags] = useState<TagItem[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const decodedRepository = repository ? decodeURIComponent(repository) : '';

  useEffect(() => {
    if (!activeRegistry || !repository) {
      navigate('/catalog');
      return;
    }
    fetchTags();
  }, [activeRegistry, repository, navigate]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tags);
    }
  }, [searchQuery, tags]);

  const fetchTags = async () => {
    if (!activeRegistry || !decodedRepository) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getTags(activeRegistry, decodedRepository);
      const tagNames = response?.tags ?? [];

      const tagList = await Promise.all(
        tagNames.map(async (tagName) => {
          try {
            const manifest = await getManifest(activeRegistry, decodedRepository, tagName);
            return {
              name: tagName,
              digest: manifest.config?.digest || 'N/A',
              size: formatSize(manifest.size || 0),
              created: formatDate(manifest.created),
            };
          } catch (manifestError) {
            console.error(`Error fetching manifest for tag ${tagName}:`, manifestError);
            return {
              name: tagName,
              digest: 'N/A',
              size: 'N/A',
              created: 'N/A',
            };
          }
        })
      );

      const sortedTags = tagList.sort((a, b) => a.name.localeCompare(b.name)).reverse();
      setTags(sortedTags);
      setFilteredTags(sortedTags);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load tags. Please check your registry connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openTagDetails = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate('/catalog')}
                  className="p-1"
                  icon={<ChevronLeft size={20} />}
                  aria-label="Back to catalog"
                />
                <Link to="/catalog" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                  Catalog
                </Link>
                <span className="text-gray-600">/</span>
                <h1 className="text-xl font-semibold text-white truncate max-w-md">{decodedRepository}</h1>
              </div>
              {activeRegistry && (
                <p className="text-sm text-gray-400 ml-8">
                  Registry: <span className="text-blue-400">{activeRegistry.name}</span>
                </p>
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
                onClick={fetchTags}
                icon={<RefreshCw size={18} />}
                isLoading={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="mt-4">
              <Input
                placeholder="Search tags..."
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
            <Button onClick={fetchTags} className="mt-4" variant="secondary">
              Retry
            </Button>
          </div>
        ) : filteredTags.length === 0 ? (
          searchQuery ? (
            <EmptyState
              title="No matching tags"
              description={`No tags match the search "${searchQuery}"`}
              actionText="Clear Search"
              onAction={() => setSearchQuery('')}
              icon={<Search size={48} />}
            />
          ) : (
            <EmptyState
              title="No tags found"
              description="This repository doesn't have any tags or you don't have permission to view them."
              actionText="Back to Catalog"
              onAction={() => navigate('/catalog')}
              icon={<TagIcon size={48} />}
            />
          )
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">
                {searchQuery ? `Search Results (${filteredTags.length})` : `Available Tags (${tags.length})`}
              </h2>
            </div>

            {viewType === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTags.map(tag => (
                  <Card
                    key={tag.name}
                    hoverable
                    onClick={() => openTagDetails(tag.name)}
                    className="transition-transform duration-200"
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 flex items-center justify-center bg-green-900 rounded-lg mr-3">
                        <TagIcon className="h-5 w-5 text-green-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{tag.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Digest: {tag.digest?.substring(0, 12)}...
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-1.5">
                          <HardDrive className="h-3 w-3 mr-1" />
                          <span>Size: {tag.size}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mt-1.5">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Created: {tag.created}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
                <div className="border-b border-gray-700 divide-y divide-gray-700">
                  {filteredTags.map(tag => (
                    <div
                      key={tag.name}
                      className="p-4 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => openTagDetails(tag.name)}
                    >
                      <div className="flex items-center">
                        <TagIcon className="h-5 w-5 text-green-400 mr-3" />
                        <div>
                          <h3 className="font-medium text-white">{tag.name}</h3>
                          <p className="text-sm text-gray-400">
                            Digest: {tag.digest?.substring(0, 12)}...
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-1.5">
                            <HardDrive className="h-3 w-3 mr-1" />
                            <span>Size: {tag.size}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mt-1.5">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Created: {tag.created}</span>
                          </div>
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

      {selectedTag && (
        <TagDetailsModal
          isOpen={!!selectedTag}
          onClose={() => setSelectedTag(null)}
          repository={decodedRepository}
          tag={selectedTag}
        />
      )}
    </div>
  );
};

export default RepositoryPage;
