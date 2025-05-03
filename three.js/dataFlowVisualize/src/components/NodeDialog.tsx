import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
} from "./catalyst/dialog";
import { Button } from "./catalyst/button";
import { Node } from "../types/nodes";
import {
  Database,
  Server,
  Globe,
  MessageSquare,
  Users,
  HeadsetIcon,
  Building2,
  Bot,
  FileText,
} from "lucide-react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

interface NodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node;
}

const getNodeDescription = (type: Node["type"]) => {
  switch (type) {
    case "database":
      return "A central data repository storing structured information";
    case "service":
      return "An active system providing specific functionality";
    case "api":
      return "External interface for data exchange and integration";
    case "salesforce":
      return "CRM platform integration point for customer data";
    case "hubspot":
      return "Marketing and sales automation integration";
    case "zendesk":
      return "Customer support and ticket management system";
    case "dynamics":
      return "Microsoft business applications platform";
    case "aigizmo":
      return "AI-powered automation and analysis system";
    case "excel":
      return "Structured data in spreadsheet format";
    case "pdf":
      return "Document containing formatted text and images";
    case "doc":
      return "Word document containing formatted text";
    default:
      return "System component";
  }
};

const getNodeMetrics = (type: Node["type"]) => {
  switch (type) {
    case "database":
      return { uptime: "99.9%", connections: "150+", latency: "45ms" };
    case "service":
      return { status: "Active", requests: "2.5k/min", response: "120ms" };
    case "api":
      return { calls: "1.2M/day", success: "99.5%", avgTime: "85ms" };
    case "salesforce":
      return { records: "50k+", synced: "5 min ago", active: "Yes" };
    case "hubspot":
      return { contacts: "25k", campaigns: "12", engagement: "78%" };
    case "zendesk":
      return { tickets: "156", resolution: "94%", response: "2h" };
    case "dynamics":
      return { modules: "8", users: "120", processes: "45" };
    case "aigizmo":
      return { models: "5", accuracy: "92%", processed: "10k" };
    case "excel":
      return { sheets: "12", rows: "5.2k", lastUpdate: "2h ago" };
    case "pdf":
      return { pages: "24", size: "2.8MB", generated: "today" };
    case "doc":
      return { pages: "15", words: "2.5k", modified: "3h ago" };
    default:
      return { status: "Active" };
  }
};

const NodeIcon = ({ type }: { type: Node["type"] }) => {
  switch (type) {
    case "database":
      return <Database className="w-6 h-6 text-blue-400" />;
    case "service":
      return <Server className="w-6 h-6 text-green-400" />;
    case "api":
      return <Globe className="w-6 h-6 text-purple-400" />;
    case "salesforce":
      return <MessageSquare className="w-6 h-6 text-blue-500" />;
    case "hubspot":
      return <Users className="w-6 h-6 text-orange-500" />;
    case "zendesk":
      return <HeadsetIcon className="w-6 h-6 text-green-500" />;
    case "dynamics":
      return <Building2 className="w-6 h-6 text-indigo-500" />;
    case "aigizmo":
      return <Bot className="w-6 h-6 text-cyan-400" />;
    case "excel":
      return <FaFileExcel className="w-6 h-6 text-yellow-500" />;
    case "pdf":
      return <FaFilePdf className="w-6 h-6 text-red-500" />;
    case "doc":
      return <FileText className="w-6 h-6 text-blue-500" />;
    default:
      return null;
  }
};

export function NodeDialog({ isOpen, onClose, node }: NodeDialogProps) {
  const description = getNodeDescription(node.type);
  const metrics = getNodeMetrics(node.type);
  const pdfUrl =
    node.type === "pdf" && node.fileName ? '' : null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <NodeIcon type={node.type} />
          <DialogTitle className="text-xl font-semibold">
            {node.label}
          </DialogTitle>
        </div>

        <DialogBody>
          {!pdfUrl && (
            <DialogDescription className="mb-4 text-gray-600 dark:text-gray-300">
              {description}
            </DialogDescription>
          )}

          {pdfUrl && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Preview
              </h3>
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-[400px] rounded-lg border border-gray-200 mb-4"
              />
            </div>
          )}

          {!pdfUrl && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                System Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {key}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogBody>

        <DialogActions className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
