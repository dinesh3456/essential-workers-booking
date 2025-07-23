import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="text-6xl mb-4">😵</div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been
          moved, deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          <Link to="/" className="block">
            <Button size="lg" className="w-full">
              Go Home
            </Button>
          </Link>

          <button onClick={() => window.history.back()} className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              Go Back
            </Button>
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>
            Need help?{" "}
            <Link to="/contact" className="text-primary-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
