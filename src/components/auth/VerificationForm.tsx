import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const VerificationForm = () => {
  const [code, setCode] = useState('');
  const { verify, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email) {
      navigate('/register');
      return;
    }

    try {
      await verify({ email, code });
      navigate('/login');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a verification code to {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            name="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>
    </div>
  );
};

export default VerificationForm;
