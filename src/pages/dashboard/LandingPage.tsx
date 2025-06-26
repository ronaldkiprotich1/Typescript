import { NavLink } from "react-router-dom";
import { FaCar, FaMapMarkerAlt, FaShieldAlt, FaCreditCard, FaCalendarCheck, FaUsers, FaCogs } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Car Rental Management</h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Streamline your operations with our all-in-one solution for car rentals, reservations, and fleet management
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NavLink 
              to="/register" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              Get Started
            </NavLink>
            <NavLink 
              to="/about" 
              className="bg-transparent border-2 border-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
            >
              Learn More
            </NavLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Comprehensive Management Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Car Management */}
            <FeatureCard 
              icon={<FaCar className="text-3xl text-blue-600" />}
              title="Car Management"
              description="Track vehicle inventory, specifications, availability status, and rental rates"
            />
            
            {/* Location Management */}
            <FeatureCard 
              icon={<FaMapMarkerAlt className="text-3xl text-green-600" />}
              title="Location Management"
              description="Manage pickup/drop-off locations with address and contact details"
            />
            
            {/* Insurance Management */}
            <FeatureCard 
              icon={<FaShieldAlt className="text-3xl text-yellow-600" />}
              title="Insurance Management"
              description="Track policy details, coverage periods, and insurance providers"
            />
            
            {/* Payment Processing */}
            <FeatureCard 
              icon={<FaCreditCard className="text-3xl text-purple-600" />}
              title="Payment Processing"
              description="Secure payment tracking with multiple payment methods"
            />
            
            {/* Reservation System */}
            <FeatureCard 
              icon={<FaCalendarCheck className="text-3xl text-red-600" />}
              title="Reservation System"
              description="Manage bookings, pickup/return dates, and customer preferences"
            />
            
            {/* Customer Management */}
            <FeatureCard 
              icon={<FaUsers className="text-3xl text-indigo-600" />}
              title="Customer Management"
              description="Maintain customer profiles, contact information, and rental history"
            />
            
            {/* Maintenance Tracking */}
            <FeatureCard 
              icon={<FaCogs className="text-3xl text-gray-600" />}
              title="Maintenance Tracking"
              description="Schedule and record vehicle maintenance with cost tracking"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Streamlined Rental Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard 
              step={1}
              title="Vehicle Selection"
              description="Browse available cars with detailed specifications"
            />
            <StepCard 
              step={2}
              title="Reservation"
              description="Book your preferred dates and pickup location"
            />
            <StepCard 
              step={3}
              title="Secure Payment"
              description="Complete transaction with multiple payment options"
            />
            <StepCard 
              step={4}
              title="Rental Experience"
              description="Enjoy your vehicle with insurance coverage"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Car Rental Business?
          </h2>
          <p className="text-xl mb-10">
            Join thousands of satisfied customers using our management platform
          </p>
          <NavLink 
            to="/register" 
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 inline-block"
          >
            Start Free Trial
          </NavLink>
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Step Card Component
const StepCard = ({ step, title, description }: { 
  step: number;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
      <span className="text-2xl font-bold text-blue-600">{step}</span>
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
