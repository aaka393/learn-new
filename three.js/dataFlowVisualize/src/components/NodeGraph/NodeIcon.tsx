import { Database, Server, Globe, MessageSquare, Users, HeadsetIcon, Building2, Bot } from 'lucide-react';
import { Node } from '../../types/nodes';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';

interface NodeIconProps {
  type: Node['type'];
}

export function NodeIcon({ type }: NodeIconProps) {
  switch (type) {
    case 'database':
      return <Database className="w-6 h-6 text-blue-400" />;
    case 'service':
      return <Server className="w-6 h-6 text-green-400" />;
    case 'api':
      return <Globe className="w-6 h-6 text-purple-400" />;
    case 'salesforce':
      return <MessageSquare className="w-6 h-6 text-blue-500" />;
    case 'hubspot':
      return <Users className="w-6 h-6 text-orange-500" />;
    case 'zendesk':
      return <HeadsetIcon className="w-6 h-6 text-green-500" />;
    case 'dynamics':
      return <Building2 className="w-6 h-6 text-indigo-500" />;
    case 'aigizmo':
      return <Bot className="w-6 h-6 text-cyan-400" />;
    case 'excel':
      return <FaFileExcel className="w-6 h-6 text-yellow-500" />;
    case 'pdf':
      return <FaFilePdf className="w-6 h-6 text-red-500" />;
  }
}
