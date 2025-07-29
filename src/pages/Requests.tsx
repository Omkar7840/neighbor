import React, { useState, useEffect } from 'react';
import { Calendar, User, MessageCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BorrowRequest } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Requests: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, activeTab]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const query = supabase
        .from('borrow_requests')
        .select(`
          *,
          item:items(*),
          borrower:users!borrow_requests_borrower_id_fkey(*),
          owner:users!borrow_requests_owner_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (activeTab === 'received') {
        query.eq('owner_id', user.id);
      } else {
        query.eq('borrower_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast.error('Error loading requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('borrow_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;
      
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status }
          : request
      ));
      
      toast.success(`Request ${status === 'approved' ? 'approved' : 'rejected'}`);
    } catch (error) {
      toast.error('Error updating request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'returned': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'active': return Calendar;
      case 'returned': return CheckCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Requests</h1>
          <p className="text-gray-600">Manage borrowing requests and lending approvals</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'received'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Received Requests
                {requests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                    {requests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sent'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sent Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {requests.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-gray-600">Approved</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {requests.filter(r => r.status === 'active').length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {requests.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No {activeTab} requests yet
            </h3>
            <p className="text-gray-600">
              {activeTab === 'received' 
                ? 'When someone wants to borrow your items, requests will appear here.'
                : 'When you request to borrow items, they will appear here.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              const isReceived = activeTab === 'received';
              const otherUser = isReceived ? request.borrower : request.owner;
              
              return (
                <div key={request.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {request.item?.images && request.item.images.length > 0 ? (
                          <img
                            src={request.item.images[0]}
                            alt={request.item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-gray-400 text-xs">No Image</div>
                          </div>
                        )}
                      </div>

                      {/* Request Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.item?.title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>
                              {isReceived ? 'Requested by' : 'From'} {otherUser?.full_name}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {format(new Date(request.start_date), 'MMM d')} - 
                              {format(new Date(request.end_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>

                        {request.message && (
                          <p className="text-gray-700 text-sm mb-2">
                            <span className="font-medium">Message:</span> {request.message}
                          </p>
                        )}

                        <div className="text-xs text-gray-500">
                          Requested {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isReceived && request.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => updateRequestStatus(request.id, 'approved')}
                        className="flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      
                      <button
                        onClick={() => updateRequestStatus(request.id, 'rejected')}
                        className="flex items-center px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                      
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </button>
                    </div>
                  )}

                  {request.status !== 'pending' && (
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;