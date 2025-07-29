import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  User, 
  Calendar, 
  MessageCircle, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Item, BorrowRequest } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    message: ''
  });

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          owner:users(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      toast.error('Error loading item');
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  };

  const submitBorrowRequest = async () => {
    if (!user || !item) {
      toast.error('Please log in to make a request');
      return;
    }

    if (user.id === item.owner_id) {
      toast.error('You cannot borrow your own item');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('borrow_requests')
        .insert([
          {
            item_id: item.id,
            borrower_id: user.id,
            owner_id: item.owner_id,
            start_date: requestData.startDate,
            end_date: requestData.endDate,
            message: requestData.message,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success('Request sent successfully!');
      setShowRequestModal(false);
      navigate('/requests');
    } catch (error) {
      toast.error('Error sending request');
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    if (item?.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === item.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (item?.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? item.images.length - 1 : prev - 1
      );
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading item...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="relative">
              {item.images && item.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.title}
                    className="w-full h-96 lg:h-full object-cover"
                  />
                  
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {item.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? 'bg-white'
                                : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 lg:h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-lg">No Image Available</div>
                </div>
              )}
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  item.is_available 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {item.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Item Details */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                {item.daily_value && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${item.daily_value}
                    </div>
                    <div className="text-sm text-gray-600">per day</div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  {item.category}
                </span>
                {item.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>

              {/* Owner Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.owner?.full_name}</div>
                      <div className="text-sm text-gray-600">
                        {item.owner?.items_shared || 0} items shared
                      </div>
                    </div>
                  </div>
                  
                  {item.owner && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {item.owner.rating.toFixed(1)} ({item.owner.total_reviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {user && user.id !== item.owner_id && item.is_available && (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    Request to Borrow
                  </button>
                  
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Message Owner
                  </button>
                </div>
              )}

              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    Please <a href="/auth" className="font-medium underline">sign in</a> to request this item.
                  </p>
                </div>
              )}

              {user && user.id === item.owner_id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm font-medium">
                    This is your item. You can manage it from your dashboard.
                  </p>
                </div>
              )}

              {!item.is_available && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm font-medium">
                    This item is currently unavailable for borrowing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request to Borrow: {item.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={requestData.startDate}
                  onChange={(e) => setRequestData({...requestData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={requestData.endDate}
                  onChange={(e) => setRequestData({...requestData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={requestData.message}
                  onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                  placeholder="Tell the owner why you need this item or any special arrangements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={submitBorrowRequest}
                disabled={submitting}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
              
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;