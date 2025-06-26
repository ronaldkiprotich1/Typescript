import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
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
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
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
        // Handle navigation or global auth update here
      } else {
        setLoginError(response.message || 'Login failed. Try again.');
      }
    } catch (error) {
      setLoginError('Unexpected error. Try again.');
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
      }, 1000);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="flex flex-col lg:flex-row-reverse max-w-6xl w-full shadow-lg bg-white rounded-lg overflow-hidden">
        {/* Info Panel */}
        <div className="lg:w-1/2 p-10 bg-base-100 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome Back!</h1>
          <p className="text-lg mb-6 text-gray-600">
            Access your Car Management System to track vehicles, schedule maintenance, and manage your fleet efficiently.
          </p>
          <div className="hidden lg:flex stats shadow">
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

        {/* Login Form */}
        <div className="lg:w-1/2 p-8 bg-white">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

          {loginError && (
            <div className="alert alert-error mb-4">
              <span>{loginError}</span>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="space-y-4">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" />
                </div>

                {/* Remember Me */}
                <div className="form-control">
                  <label className="label cursor-pointer gap-2">
                    <Field type="checkbox" name="rememberMe" className="checkbox checkbox-primary" />
                    <span className="label-text">Remember me</span>
                  </label>
                </div>

                {/* Submit Button */}
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

                {/* Social Login */}
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => console.log('Google login clicked')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2 text-sm">
            <Link to="/forgot-password" className="link link-primary">Forgot your password?</Link>
            <p>
              Don’t have an account?{' '}
              <Link to="/register" className="link link-primary font-semibold">Create one here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
