import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface WorkerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
  }>;
  reviews: Array<{
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    createdAt: string;
    service: string;
  }>;
  availability: {
    isAvailable: boolean;
    nextAvailable?: string;
  };
}

const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "services" | "reviews">(
    "about"
  );

  // Mock data - in real app, this would be fetched from API
  useEffect(() => {
    const fetchWorkerProfile = async () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        const mockWorker: WorkerProfile = {
          id: id || "1",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 123-4567",
          bio: "Professional house cleaner with over 5 years of experience. I pride myself on attention to detail and providing exceptional service to all my clients. Fully insured and bonded.",
          isVerified: true,
          rating: 4.9,
          reviewCount: 127,
          joinedDate: "2022-03-15",
          services: [
            {
              id: "1",
              name: "Standard House Cleaning",
              description:
                "Complete house cleaning including dusting, vacuuming, mopping, and bathroom cleaning",
              price: 75,
              duration: 120,
            },
            {
              id: "2",
              name: "Deep Cleaning",
              description:
                "Thorough deep cleaning service including inside appliances, baseboards, and detailed cleaning",
              price: 120,
              duration: 180,
            },
            {
              id: "3",
              name: "Move-in/Move-out Cleaning",
              description: "Comprehensive cleaning for moving situations",
              price: 150,
              duration: 240,
            },
          ],
          reviews: [
            {
              id: "1",
              clientName: "Michael R.",
              rating: 5,
              comment:
                "Sarah did an amazing job! My house has never been cleaner. Very professional and thorough.",
              createdAt: "2024-01-15",
              service: "Standard House Cleaning",
            },
            {
              id: "2",
              clientName: "Jennifer L.",
              rating: 5,
              comment:
                "Excellent service! Sarah was punctual, professional, and paid attention to every detail.",
              createdAt: "2024-01-10",
              service: "Deep Cleaning",
            },
            {
              id: "3",
              clientName: "David K.",
              rating: 4,
              comment:
                "Great work overall. House looks fantastic. Will definitely book again.",
              createdAt: "2024-01-05",
              service: "Standard House Cleaning",
            },
          ],
          availability: {
            isAvailable: true,
            nextAvailable: "2024-01-20",
          },
        };

        setWorker(mockWorker);
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchWorkerProfile();
    }
  }, [id]);

  const handleBookNow = (serviceId?: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "worker") {
      alert("Workers cannot book services");
      return;
    }

    // Navigate to booking with pre-selected service and worker
    navigate("/booking", {
      state: {
        preSelectedWorker: worker?.id,
        preSelectedService: serviceId,
      },
    });
  };

  const handleContact = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // TODO: Implement contact functionality (chat, call, etc.)
    alert("Contact functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Worker Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The worker profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/services")}>
            Browse All Workers
          </Button>
        </div>
      </div>
    );
  }

  const renderAbout = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">About</h3>
        <p className="text-gray-700 leading-relaxed">
          {worker.bio || "No bio available."}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700">Member since:</span>
            <span className="ml-2 text-gray-600">
              {new Date(worker.joinedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Reviews:</span>
            <span className="ml-2 text-gray-600">{worker.reviewCount}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Average Rating:</span>
            <span className="ml-2 text-gray-600">⭐ {worker.rating}/5</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Verification:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                worker.isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {worker.isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-4">
      {worker.services.map((service) => (
        <div key={service.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {service.name}
              </h3>
              <p className="text-gray-600 mt-2">{service.description}</p>
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                <span>Duration: {service.duration} minutes</span>
                <span>•</span>
                <span className="text-lg font-semibold text-primary-600">
                  ${service.price}
                </span>
              </div>
            </div>
            <Button onClick={() => handleBookNow(service.id)} className="ml-4">
              Book Now
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      {worker.reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No reviews yet.</p>
        </div>
      ) : (
        worker.reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {review.clientName}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>⭐ {review.rating}/5</span>
                  <span>•</span>
                  <span>{review.service}</span>
                  <span>•</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Worker Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  {worker.avatar ? (
                    <img
                      src={worker.avatar}
                      alt={`${worker.firstName} ${worker.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-semibold text-gray-600">
                      {worker.firstName[0]}
                      {worker.lastName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {worker.firstName} {worker.lastName}
                    </h1>
                    {worker.isVerified && (
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-lg text-gray-600">
                      ⭐ {worker.rating} ({worker.reviewCount} reviews)
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        worker.availability.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {worker.availability.isAvailable ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 flex space-x-3">
                <Button variant="outline" onClick={handleContact}>
                  Contact
                </Button>
                <Button onClick={() => handleBookNow()}>Book Now</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("about")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "about"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "services"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Services ({worker.services.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reviews ({worker.reviewCount})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "about" && renderAbout()}
          {activeTab === "services" && renderServices()}
          {activeTab === "reviews" && renderReviews()}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfilePage;
