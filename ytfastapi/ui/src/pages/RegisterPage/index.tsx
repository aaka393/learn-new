import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLoaderButton from '../../components/AuthLoaderButton';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { axiosClient } from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useMainContext } from '../../context/MainContext';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isHide, setIsHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const {fetchProfile} = useMainContext()
  const navigate = useNavigate()

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Email must be valid").required("Email is required"),
    password: yup.string().required("Password is required")
  });

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: ''
  };

  const onSubmitHandler = async (values: RegisterFormValues, helpers: any  ) => {
    try {
      setLoading(true);
     
      const response = await axiosClient.post("/auth/register", values)
      const data = await response.data
      toast.success(data.msg)
      localStorage.setItem("token", data.token)
      await fetchProfile()
      helpers.resetForm()
      navigate('/login')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.details || err.message);
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

          {/* NAME */}
          <div className="mb-3">
            <label className="text-white block mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 rounded bg-white/10 border border-gray-400 text-white"
            />
            <ErrorMessage name="name" className="text-red-500 text-sm" component="p" />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="text-white block mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Enter your Email"
              className="w-full p-2 rounded bg-white/10 border border-gray-400 text-white"
            />
            <ErrorMessage name="email" className="text-red-500 text-sm" component="p" />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="text-white block mb-2">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="rounded border border-gray-400 flex justify-between px-4 items-center bg-white/10">
              <Field
                id="password"
                name="password"
                type={isHide ? "password" : "text"}
                placeholder="Enter your password"
                className="w-full py-3 outline-none border-none bg-transparent text-white"
              />

              <button type="button" onClick={() => setIsHide(!isHide)} className="ml-2 text-white">
                {isHide ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* ❗ FIXED: Error outside the flex div */}
            <ErrorMessage name="password" className="text-red-500 text-sm" component="p" />
          </div>

          {/* BUTTON */}
          <div className="mt-5 mb-5">
            <AuthLoaderButton isLoading={loading} text="Register" />
          </div>

          <div className='mb-3'>
            <p className='text-end'>
              Already have An Account ? <Link
              className='text-blue-500 font-bold'
              to="/login">Login</Link> 
            </p>

          </div>

        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
