import { Link } from "react-router-dom";
import { useMainContext } from "../../context/MainContext";

const HomePage = () => {
  const { profile } = useMainContext();
  console.log("profile", profile)

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="py-10 px-5 lg:w-1/2 w-[96%] bg-black/90 rounded">
        <h3 className="text-white text-4xl font-bold">Name: {profile?.name}</h3>
        <h3 className="text-white text-4xl font-bold">Email: {profile?.email}</h3>
        <h3 className="text-white text-4xl font-bold">Address: {profile?.address}</h3>
        <h3 className="text-white text-4xl font-bold">Mobile: {profile?.mobile}</h3>

        <div className="py-10">
          <Link
            to="/profile"
            className="px-6 py-2 bg-blue-700 text-white rounded"
          >
            Update
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
