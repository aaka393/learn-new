import { CgSpinner } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa";

interface AuthLoaderButtonProps {
  isLoading?: boolean;
  text: string;
  className?: string;
}

const AuthLoaderButton: React.FC<AuthLoaderButtonProps> = ({
  isLoading = false,
  text,
  className = ""
}) => {
  return (
    <button
      disabled={isLoading}
      className={`w-full cursor-pointer flex items-center justify-center gap-3 
        bg-blue-600 px-4 py-3 rounded 
        disabled:bg-blue-900 disabled:cursor-not-allowed
        text-white font-medium transition-all
        ${className}`}
    >
     
      <span>{text}</span>
      {isLoading ? (
        <CgSpinner className="animate-spin text-xl text-white" />
      ) : (
        <FaArrowRight className="text-lg" />
      )}

 
    </button>
  );
};

export default AuthLoaderButton;
