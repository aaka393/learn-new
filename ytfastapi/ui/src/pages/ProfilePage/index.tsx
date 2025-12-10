import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLoaderButton from '../../components/AuthLoaderButton';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { axiosClient } from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../../context/MainContext';

interface ProfileValues {
  name: string;
  address: string;
  mobile: string;
}

const ProfilePage = () => {

  const [loading, setLoading] = useState(false);
  const { fetchProfile, profile } = useMainContext()
  const navigate = useNavigate()
  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    address: yup.string().optional(),
    mobile: yup.string().optional()
  });

  const initialValues: ProfileValues = {
    name: profile?.name || '',
    address: profile?.address || '',
    mobile: profile?.mobile || ''
  };

  const onSubmitHandler = async (
    values: ProfileValues  ) => {
    try {
      setLoading(true);
     
      const response = await axiosClient.put("/auth/profile", values)
      const data = await response.data
      toast.success(data.msg)
      await fetchProfile()
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.detail || err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(String(err));
      }
    } finally {
      setLoading(false);
    }
    }

  return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}   // ✅ ADDED
        onSubmit={onSubmitHandler}
      >
        <Form className="w-[96%] mx-auto py-10 px-8 bg-black/80 lg:w-1/2 border border-gray-500 rounded-2xl shadow">         

          {/* Name */}
          <div className="mb-3">
            <label className="text-white block mb-2">
              name <span className="text-red-500">*</span>
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Enter your Name"
              className="w-full p-2 rounded bg-white/10 border border-gray-400 text-white"
            />
            <ErrorMessage name="name" className="text-red-500 text-sm" component="p" />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label className="text-white block mb-2">
              address <span className="text-red-500">*</span>
            </label>
            <Field as ="textarea" rows={3}
              id="address"
              name="address"
              type="text"
              placeholder="Enter your Address"
              className="w-full p-2 rounded bg-white/10 border border-gray-400 text-white"
            />
            <ErrorMessage name="address" className="text-red-500 text-sm" component="p" />
          </div>

          {/* Mobile */}
          <div className="mb-3">
            <label className="text-white block mb-2">
              mobile <span className="text-red-500">*</span>
            </label>
            <Field
              id="mobile"
              name="mobile"
              type="text"
              placeholder="Enter your Mobile"
              className="w-full p-2 rounded bg-white/10 border border-gray-400 text-white"
            />
            <ErrorMessage name="name" className="text-red-500 text-sm" component="p" />
          </div>

          {/* BUTTON */}
          <div className="mt-5 mb-5">
            <AuthLoaderButton isLoading={loading} text="Update" />
          </div>

        </Form>
      </Formik>
    </div>
  );
};

export default ProfilePage;
