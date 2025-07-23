import React from "react";

const ServicesPage: React.FC = () => {
  const services = [
    {
      category: "Home Maintenance",
      items: [
        {
          name: "Plumbing",
          description: "Emergency repairs, installations, maintenance",
          icon: "🔧",
        },
        {
          name: "Electrical",
          description: "Wiring, repairs, installations",
          icon: "⚡",
        },
        {
          name: "HVAC",
          description: "Heating, cooling, ventilation services",
          icon: "🌡️",
        },
        {
          name: "Handyman",
          description: "General repairs and maintenance",
          icon: "🔨",
        },
      ],
    },
    {
      category: "Cleaning Services",
      items: [
        {
          name: "House Cleaning",
          description: "Regular and deep cleaning services",
          icon: "🏠",
        },
        {
          name: "Office Cleaning",
          description: "Commercial cleaning solutions",
          icon: "🏢",
        },
        {
          name: "Carpet Cleaning",
          description: "Professional carpet care",
          icon: "🧹",
        },
        {
          name: "Window Cleaning",
          description: "Interior and exterior window cleaning",
          icon: "🪟",
        },
      ],
    },
    {
      category: "Personal Services",
      items: [
        {
          name: "Pet Care",
          description: "Walking, sitting, grooming",
          icon: "🐕",
        },
        {
          name: "Tutoring",
          description: "Academic support and lessons",
          icon: "📚",
        },
        {
          name: "Personal Training",
          description: "Fitness coaching and guidance",
          icon: "💪",
        },
        {
          name: "Elderly Care",
          description: "Companion and care services",
          icon: "👵",
        },
      ],
    },
    {
      category: "Delivery & Transport",
      items: [
        {
          name: "Package Delivery",
          description: "Fast and secure delivery",
          icon: "📦",
        },
        {
          name: "Grocery Shopping",
          description: "Shopping and delivery service",
          icon: "🛒",
        },
        {
          name: "Moving Help",
          description: "Packing and moving assistance",
          icon: "📦",
        },
        {
          name: "Ride Services",
          description: "Personal transportation",
          icon: "🚗",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
          <p className="mt-2 text-lg text-gray-600">
            Find the right professional for any job, big or small
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {services.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((service) => (
                  <div
                    key={service.name}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-primary-600 text-sm font-medium group-hover:underline">
                        View Providers →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See What You Need?</h2>
          <p className="text-xl mb-8 text-primary-100">
            We're always adding new services. Contact us to let us know what
            you're looking for.
          </p>
          <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
            Request a Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
