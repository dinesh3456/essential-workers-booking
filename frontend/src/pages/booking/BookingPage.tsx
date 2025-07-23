import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Booking Steps Components
const ServiceSelection: React.FC<{ onNext: (serviceId: string) => void }> = ({
  onNext,
}) => {
  const [selectedService, setSelectedService] = useState("");
  const services = [
    { id: "cleaning", name: "House Cleaning", price: 75, duration: 120 },
    { id: "plumbing", name: "Plumbing Services", price: 95, duration: 90 },
    { id: "electrical", name: "Electrical Work", price: 85, duration: 60 },
    { id: "landscaping", name: "Landscaping", price: 65, duration: 180 },
    { id: "handyman", name: "Handyman Services", price: 55, duration: 120 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select a Service
        </h2>
        <p className="text-gray-600">Choose the service you need help with</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedService === service.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <p className="text-gray-600">Starting at ${service.price}</p>
            <p className="text-sm text-gray-500">~{service.duration} minutes</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onNext(selectedService)}
          disabled={!selectedService}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const WorkerSelection: React.FC<{
  serviceId: string;
  onNext: (workerId: string) => void;
  onBack: () => void;
}> = ({ serviceId, onNext, onBack }) => {
  const [selectedWorker, setSelectedWorker] = useState("");

  // Mock workers data - in real app, this would be fetched based on serviceId
  const workers = [
    {
      id: "1",
      name: "Sarah Johnson",
      rating: 4.9,
      reviews: 127,
      price: 75,
      avatar: "/avatars/sarah.jpg",
      verified: true,
    },
    {
      id: "2",
      name: "Mike Chen",
      rating: 4.8,
      reviews: 89,
      price: 80,
      avatar: "/avatars/mike.jpg",
      verified: true,
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      rating: 4.7,
      reviews: 156,
      price: 70,
      avatar: "/avatars/emily.jpg",
      verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose a Worker
        </h2>
        <p className="text-gray-600">
          Select from available verified professionals
        </p>
      </div>

      <div className="space-y-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedWorker === worker.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedWorker(worker.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-600">
                  {worker.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">{worker.name}</h3>
                  {worker.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>⭐ {worker.rating}</span>
                  <span>•</span>
                  <span>{worker.reviews} reviews</span>
                </div>
                <p className="text-lg font-semibold text-primary-600">
                  ${worker.price}/hour
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => onNext(selectedWorker)}
          disabled={!selectedWorker}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const DateTimeSelection: React.FC<{
  onNext: (datetime: { date: string; time: string }) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Date & Time
        </h2>
        <p className="text-gray-600">Choose when you'd like the service</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Select Date</h3>
          <div className="grid grid-cols-2 gap-2">
            {dates.map((date) => {
              const dateObj = new Date(date);
              const isSelected = selectedDate === date;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 text-center rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-lg">
                    {dateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Select Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 text-center rounded-lg border transition-all ${
                  selectedTime === time
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => onNext({ date: selectedDate, time: selectedTime })}
          disabled={!selectedDate || !selectedTime}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const LocationDetails: React.FC<{
  onNext: (location: any) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  const isValid =
    location.address && location.city && location.state && location.zipCode;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Service Location
        </h2>
        <p className="text-gray-600">Where should the service be performed?</p>
      </div>

      <div className="space-y-4">
        <Input
          name="address"
          placeholder="Street Address"
          value={location.address}
          onChange={handleInputChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="city"
            placeholder="City"
            value={location.city}
            onChange={handleInputChange}
            required
          />
          <Input
            name="state"
            placeholder="State"
            value={location.state}
            onChange={handleInputChange}
            required
          />
          <Input
            name="zipCode"
            placeholder="ZIP Code"
            value={location.zipCode}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows={4}
            placeholder="Any special instructions or details..."
            value={location.notes}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onNext(location)} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  );
};

const BookingSummary: React.FC<{
  bookingData: any;
  onConfirm: () => void;
  onBack: () => void;
}> = ({ bookingData, onConfirm, onBack }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Summary
        </h2>
        <p className="text-gray-600">Review your booking details</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Service:</span>
            <span className="capitalize">
              {bookingData.serviceId || "House Cleaning"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Worker:</span>
            <span>Sarah Johnson</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Date & Time:</span>
            <span>
              {bookingData.datetime?.date} at {bookingData.datetime?.time}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Location:</span>
            <span className="text-right">
              {bookingData.location?.address}
              <br />
              {bookingData.location?.city}, {bookingData.location?.state}{" "}
              {bookingData.location?.zipCode}
            </span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>$75.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirm}>Confirm Booking</Button>
      </div>
    </div>
  );
};

// Main BookingPage Component
const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceId: "",
    workerId: "",
    datetime: { date: "", time: "" },
    location: null,
  });

  // Redirect if user is not authenticated or is a worker
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "worker") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleServiceNext = (serviceId: string) => {
    setBookingData((prev) => ({ ...prev, serviceId }));
    setCurrentStep(2);
  };

  const handleWorkerNext = (workerId: string) => {
    setBookingData((prev) => ({ ...prev, workerId }));
    setCurrentStep(3);
  };

  const handleDateTimeNext = (datetime: { date: string; time: string }) => {
    setBookingData((prev) => ({ ...prev, datetime }));
    setCurrentStep(4);
  };

  const handleLocationNext = (location: any) => {
    setBookingData((prev) => ({ ...prev, location }));
    setCurrentStep(5);
  };

  const handleConfirmBooking = () => {
    // TODO: Create booking API call
    console.log("Creating booking:", bookingData);
    navigate("/dashboard?tab=bookings");
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user || user.role === "worker") {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-primary-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Service</span>
            <span>Worker</span>
            <span>Date/Time</span>
            <span>Location</span>
            <span>Summary</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {currentStep === 1 && <ServiceSelection onNext={handleServiceNext} />}
          {currentStep === 2 && (
            <WorkerSelection
              serviceId={bookingData.serviceId}
              onNext={handleWorkerNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <DateTimeSelection
              onNext={handleDateTimeNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <LocationDetails onNext={handleLocationNext} onBack={handleBack} />
          )}
          {currentStep === 5 && (
            <BookingSummary
              bookingData={bookingData}
              onConfirm={handleConfirmBooking}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
