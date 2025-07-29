import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, 
  Users, 
  Leaf, 
  Star, 
  ArrowRight,
  Shield,
  MessageCircle,
  MapPin
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Share2,
      title: 'Share & Borrow',
      description: 'List items you rarely use and borrow what you need from neighbors.'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Connect with neighbors and build lasting relationships in your area.'
    },
    {
      icon: Leaf,
      title: 'Reduce Waste',
      description: 'Help the environment by maximizing the use of existing resources.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'User verification and review system ensure safe transactions.'
    },
    {
      icon: MessageCircle,
      title: 'Easy Communication',
      description: 'Built-in messaging system to coordinate pickups and returns.'
    },
    {
      icon: MapPin,
      title: 'Local Focus',
      description: 'Find items and neighbors in your immediate area.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Items Shared' },
    { number: '2K+', label: 'Happy Users' },
    { number: '50+', label: 'Communities' },
    { number: '95%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <Share2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Share. Borrow. 
              <span className="text-green-600"> Connect.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Turn your neighborhood into a sharing community. Borrow what you need, 
              share what you don't use, and build connections with your neighbors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/browse"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-medium rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How NeighborShare Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and sustainable way to share resources in your community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-6">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                location: 'Portland, OR',
                text: 'I borrowed a power drill for my weekend project and ended up making a great friend in my neighbor!',
                rating: 5
              },
              {
                name: 'Mike Chen',
                location: 'Austin, TX',
                text: 'Amazing platform! I shared my camping gear and helped three families enjoy the outdoors.',
                rating: 5
              },
              {
                name: 'Emma Davis',
                location: 'Denver, CO',
                text: 'The messaging system makes coordination so easy. Great community-focused app!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Sharing?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of neighbors already building stronger, more sustainable communities.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            <span>Join NeighborShare Today</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;