import React, { useState } from 'react';
import Modal from './Modal';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { Database, Key, Link } from 'lucide-react';
import { Registry } from '../../types/registry';
import { useRegistry } from '../../contexts/RegistryContext';
import { getRepositories } from '../../services/registryService';

interface RegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  registry?: Registry;
}

const RegistryModal: React.FC<RegistryModalProps> = ({ isOpen, onClose, registry }) => {
  const { addRegistry, updateRegistry } = useRegistry();

  const [formData, setFormData] = useState<Omit<Registry, 'id'>>(() => {
    const defaultData = {
      name: registry?.name || '',
      url: registry?.url || '',
      username: '',
      password: '',
      isDefault: registry?.isDefault || false
    };

    if (registry?.url) {
      const credentialsKey = `registry-auth-${registry.url}`;
      const stored = localStorage.getItem(credentialsKey);
      if (stored) {
        try {
          const [username, password] = atob(stored).split(':');
          return { ...defaultData, username, password };
        } catch (e) {
          console.warn('Failed to decode stored credentials');
        }
      }
    }

    return defaultData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Registry name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'Registry URL is required';
    } else if (!/^https?:\/\/.+/i.test(formData.url)) {
      newErrors.url = 'URL must start with http:// or https://';
    }

    if (formData.username && !formData.password) {
      newErrors.password = 'Password is required when username is provided';
    }

    if (formData.password && !formData.username) {
      newErrors.username = 'Username is required when password is provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    setIsSubmitting(true);
  
    try {
      if (formData.username && formData.password && formData.url) {
        const credentialsKey = `registry-auth-${formData.url}`;
        const encoded = btoa(`${formData.username}:${formData.password}`);
        localStorage.setItem(credentialsKey, encoded);
      }
  
      await getRepositories({
        id: registry?.id ?? '', // provide dummy id if not exists, won't be used
        ...formData
      });
  
      if (registry) {
        updateRegistry({
          ...formData,
          id: registry.id
        });
      } else {
        addRegistry(formData);
      }
  
      onClose();
    } catch (error) {
      console.error('Registry validation failed:', error);
      setErrors(prev => ({
        ...prev,
        url: 'Could not connect to registry. Please check URL and credentials.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} isLoading={isSubmitting}>
        {registry ? 'Update Registry' : 'Add Registry'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={registry ? 'Edit Registry' : 'Add New Registry'}
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Registry Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Docker Registry"
          fullWidth
          leftIcon={<Database size={18} />}
          error={errors.name}
          required
          autoFocus
        />

        <Input
          label="Registry URL"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://registry.example.com"
          fullWidth
          leftIcon={<Link size={18} />}
          error={errors.url}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Username (optional)"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            fullWidth
            error={errors.username}
            required={formData.password.length > 0}
          />

          <Input
            label="Password (optional)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            fullWidth
            leftIcon={<Key size={18} />}
            error={errors.password}
            required={formData.username.length > 0}
          />
        </div>

        <div className="flex items-center">
          <input
            id="isDefault"
            name="isDefault"
            type="checkbox"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
          />
          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-300">
            Set as default registry
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default RegistryModal;
