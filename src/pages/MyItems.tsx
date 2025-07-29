import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Item } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const MyItems: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyItems();
    }
  }, [user]);

  const fetchMyItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error('Error loading your items');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ is_available: !currentStatus })
        .eq('id', itemId);

      if (error) throw error;
      
      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, is_available: !currentStatus }
          : item
      ));
      
      toast.success(`Item ${!currentStatus ? 'made available' : 'marked unavailable'}`);
    } catch (error) {
      toast.error('Error updating item');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setItems(items.filter(item => item.id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Error deleting item');
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
          <p className="mt-4 text-gray-600">Loading your items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Items</h1>
            <p className="text-gray-600">Manage the items you're sharing with the community</p>
          </div>
          
          <Link
            to="/add-item"
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Item</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {items.length}
            </div>
            <div className="text-gray-600">Total Items</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {items.filter(item => item.is_available).length}
            </div>
            <div className="text-gray-600">Available</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {items.filter(item => !item.is_available).length}
            </div>
            <div className="text-gray-600">Unavailable</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {user?.items_shared || 0}
            </div>
            <div className="text-gray-600">Times Shared</div>
          </div>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-6">
              Start sharing by adding your first item to the community.
            </p>
            <Link
              to="/add-item"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Item Image */}
                <div className="h-48 bg-gray-200 relative">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400">No Image</div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.is_available 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                      {item.title}
                    </h3>
                    {item.daily_value && (
                      <span className="text-green-600 font-medium text-sm ml-2">
                        ${item.daily_value}/day
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {item.category}
                    </span>
                    {item.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/item/${item.id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    
                    <button
                      onClick={() => toggleAvailability(item.id, item.is_available)}
                      className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                        item.is_available
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {item.is_available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;