// src/components/modals/TagDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '../shared/Button';
import { useRegistry } from '../../contexts/RegistryContext';
import { getManifest } from '../../services/registryService';
import { formatSize, formatDate, generatePullCommand } from '../../utils/formatters';
import { Copy, Layers, Clock, Calendar, HardDrive } from 'lucide-react';
import { Manifest } from '../../types/registry';

interface TagDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: string;
  tag: string;
}

const TagDetailsModal: React.FC<TagDetailsModalProps> = ({ 
  isOpen, 
  onClose,
  repository,
  tag
}) => {
  const { activeRegistry } = useRegistry();
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !activeRegistry) return;

    const fetchManifest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getManifest(activeRegistry, repository, tag);
        setManifest(data);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          setError(`Manifest not found for tag "${tag}". It may have been deleted or is inaccessible.`);
        } else {
          setError('Failed to load tag details');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManifest();
  }, [isOpen, activeRegistry, repository, tag]);

  const handleCopyPullCommand = () => {
    if (!activeRegistry) return;
    const command = generatePullCommand(activeRegistry.url, repository, tag);
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tag Details: ${repository}:${tag}`}
      size="lg"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">
          <p>{error}</p>
          <Button 
            variant="secondary" 
            className="mt-4" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      ) : manifest ? (
        <div className="space-y-6">
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-400">Pull Command</h4>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleCopyPullCommand}
                icon={<Copy size={16} />}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="bg-gray-800 p-3 rounded font-mono text-sm text-gray-200 overflow-x-auto">
              {activeRegistry && generatePullCommand(activeRegistry.url, repository, tag)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-gray-900 rounded-lg">
              <HardDrive className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <p className="text-xs text-gray-400">Image Size</p>
                <p className="text-white font-medium">{formatSize(manifest.size || 0)}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-900 rounded-lg">
              <Layers className="h-5 w-5 text-purple-400 mr-3" />
              <div>
                <p className="text-xs text-gray-400">Layers</p>
                <p className="text-white font-medium">{manifest.layers.length}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-900 rounded-lg">
              <Calendar className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <p className="text-xs text-gray-400">Created</p>
                <p className="text-white font-medium">{formatDate(manifest.created)}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-900 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <p className="text-xs text-gray-400">Schema Version</p>
                <p className="text-white font-medium">{manifest.schemaVersion}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Layers</h4>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Digest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Size</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {manifest.layers.map((layer, index) => (
                      <tr key={layer.digest}>
                        <td className="px-6 py-4 text-sm text-gray-300">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-300 font-mono">{layer.digest.slice(0, 20)}...</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{formatSize(layer.size)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default TagDetailsModal;
