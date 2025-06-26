import VerificationForm from '@/components/auth/VerificationForm';
import { Link } from 'react-router-dom';

const Verify = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <VerificationForm />

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
