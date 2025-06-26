import { Formik, Form, Field, ErrorMessage, type FormikHelpers, type FormikProps } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      setLoginError(null);
      console.log('Login data:', values);

      const response = await simulateLogin(values);

      if (response.success) {
        console.log('Login successful');
        // Add redirect logic here
      } else {
        setLoginError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const simulateLogin = (values: LoginFormValues): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (values.email === 'demo@example.com' && values.password === 'password123') {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Invalid email or password' });
        }
      }, 1500);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="flex flex-col lg:flex-row-reverse max-w-6xl w-full bg-white shadow-xl rounded-xl overflow-hidden">
        
        {/* Welcome Section */}
        <div className="lg:w-1/2 p-10 flex flex-col justify-center bg-white">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome Back!</h1>
          <p className="text-lg mb-6 text-gray-700">
            Access your Car Management System to track vehicles, schedule maintenance,
            and manage your fleet efficiently.
          </p>
          <div className="hidden lg:flex gap-6">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Active Users</div>
                <div className="stat-value text-primary">2.5K+</div>
              </div>
              <div className="stat">
                <div className="stat-title">Cars Managed</div>
                <div className="stat-value text-secondary">15K+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="lg:w-1/2 p-8 bg-base-100">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

          {loginError && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              isValid,
              dirty
            }: FormikProps<LoginFormValues>) => (
              <Form className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full focus:input-primary"
                    autoComplete="email"
                  />
                  <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full pr-12 focus:input-primary"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer gap-3 items-center">
                    <Field type="checkbox" name="rememberMe" className="checkbox checkbox-primary" />
                    <span className="label-text">Remember me</span>
                  </label>
                </div>

                <div className="form-control mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting || !isValid || !dirty}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>

                <div className="divider">OR</div>

                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => console.log('Social login clicked')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-6 space-y-2">
            <Link to="/forgot-password" className="link link-primary text-sm hover:link-hover">
              Forgot your password?
            </Link>
            <p className="text-sm">
              Don’t have an account?{' '}
              <Link to="/register" className="link link-primary font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
