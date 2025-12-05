import { useAuth } from './AuthContext';
import { Loader2, Calculator, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { signInWithMicrosoft, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">10X Medication Calculator</h1>
            <p className="text-gray-500 mt-2">Sign in to access the calculator</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Access Denied</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Microsoft Sign In Button */}
          <button
            onClick={signInWithMicrosoft}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#2F2F2F] hover:bg-[#1F1F1F] text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            {/* Microsoft Logo */}
            <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </button>

          {/* Domain Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Access restricted to <span className="font-medium text-indigo-600">@10xhealthsystem.com</span> accounts
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          10X Health System Internal Tool
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
