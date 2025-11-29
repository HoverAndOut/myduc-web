import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-md px-6">
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <img
                src="/logo.png"
                alt="My Duc School Logo"
                className="w-80 h-80 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Parent Portal Login
            </h1>
            <p className="text-slate-600">
              Access your child's progress and communicate with teachers
            </p>
          </div>

          {/* Login Button */}
          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign In with Your Account
            </Button>

            {/* Security Note */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Secure authentication powered by school system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
