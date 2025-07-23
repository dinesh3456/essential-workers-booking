import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { bookings, loading: bookingsLoading } = useAppSelector(
    (state) => state.booking
  );
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "profile"
  >("overview");

  useEffect(() => {
    // TODO: Fetch user-specific data based on role
    // if (user?.role === "client") {
    //   dispatch(fetchClientBookings());
    // } else if (user?.role === "worker") {
    //   dispatch(fetchWorkerBookings());
    // }
  }, [user, dispatch]);

  if (!user) {
    return <LoadingSpinner />;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Welcome back, {user.firstName}!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.role === "client" ? (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">Total Bookings</h4>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900">Completed</h4>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900">Upcoming</h4>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">Total Jobs</h4>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900">Earnings</h4>
                <p className="text-2xl font-bold text-green-600">$2,450</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900">Rating</h4>
                <p className="text-2xl font-bold text-purple-600">4.8 ⭐</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.role === "client" ? (
            <>
              <Link to="/services">
                <Button className="w-full">Find Workers</Button>
              </Link>
              <Link to="/booking">
                <Button variant="outline" className="w-full">
                  New Booking
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full">View Available Jobs</Button>
              <Button variant="outline" className="w-full">
                Update Availability
              </Button>
              <Button variant="outline" className="w-full">
                Manage Services
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {user.role === "client" ? "My Bookings" : "My Jobs"}
          </h3>
        </div>
        <div className="p-6">
          {bookingsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {user.role === "client"
                  ? "You haven't made any bookings yet."
                  : "You don't have any jobs yet."}
              </p>
              {user.role === "client" && (
                <Link to="/services">
                  <Button>Find Workers</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{booking.service.name}</h4>
                      <p className="text-gray-600">{booking.scheduledDate}</p>
                      <p className="text-sm text-gray-500">
                        {booking.location.address}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {user.firstName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {user.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {user.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {user.phone || "Not provided"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 capitalize">
              {user.role}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Status
            </label>
            <p
              className={`px-3 py-2 border border-gray-300 rounded-md ${
                user.isVerified
                  ? "bg-green-50 text-green-800"
                  : "bg-yellow-50 text-yellow-800"
              }`}
            >
              {user.isVerified ? "Verified" : "Pending Verification"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            {user.role === "client"
              ? "Manage your bookings and find essential workers"
              : "Manage your jobs and services"}
          </p>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bookings"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {user.role === "client" ? "Bookings" : "Jobs"}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "bookings" && renderBookings()}
          {activeTab === "profile" && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
