import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, UserCheck, UserPlus, Shield, Eye, Edit, XCircle, CheckCircle2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Navbar from '../components/Navbar';
import { UserContext, API } from '../App';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';
import { Badge } from '../components/ui/badge';

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    new_users_7days: 0,
    total_workers: 0,
    total_employers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (user?.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/users`),
        axios.get(`${API}/admin/stats`)
      ]);

      setUsers(usersRes.data);
      setFilteredUsers(usersRes.data);

      // Calculate stats
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const newUsers = usersRes.data.filter(u => 
        new Date(u.created_at) >= sevenDaysAgo
      ).length;

      const activeUsers = usersRes.data.filter(u => u.verified).length;

      setStats({
        total_users: statsRes.data.users.total,
        active_users: activeUsers,
        new_users_7days: newUsers,
        total_workers: statsRes.data.users.workers,
        total_employers: statsRes.data.users.employers
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 403) {
        toast.error('Admin access required');
        navigate('/');
      } else {
        toast.error('Failed to load admin data');
      }
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleVerifyUser = async (userId) => {
    try {
      await axios.patch(`${API}/admin/users/${userId}/verify`);
      toast.success('User verified successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`${API}/admin/users/${selectedUser.id}`);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-[#EA580C]" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#1C1917]" data-testid="admin-dashboard-heading">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">Manage users and monitor platform activity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-job" data-testid="total-users-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-[#EA580C]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.total_users}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Total Users</p>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </div>

          <div className="card-job" data-testid="active-users-card">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="h-8 w-8 text-[#15803D]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.active_users}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">Active Users</p>
            <p className="text-xs text-muted-foreground">Verified accounts</p>
          </div>

          <div className="card-job" data-testid="new-users-card">
            <div className="flex items-center justify-between mb-2">
              <UserPlus className="h-8 w-8 text-[#0F766E]" />
              <span className="text-3xl font-bold text-[#1C1917]">{stats.new_users_7days}</span>
            </div>
            <p className="text-sm font-semibold text-[#1C1917]">New Users</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </div>

          <div className="card-job" data-testid="user-breakdown-card">
            <div className="mb-2">
              <div className="text-sm font-semibold text-[#1C1917] mb-1">User Breakdown</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Workers:</span>
                <span className="font-bold text-[#1C1917]">{stats.total_workers}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Employers:</span>
                <span className="font-bold text-[#1C1917]">{stats.total_employers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
                data-testid="search-users-input"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 h-12" data-testid="role-filter">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="worker">Workers</SelectItem>
                <SelectItem value="employer">Employers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="users-table">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1917]">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1917]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1917]">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1917]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1917]">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1C1917]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-50 transition-colors" data-testid={`user-row-${user.id}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#1C1917]">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={`
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : ''}
                            ${user.role === 'worker' ? 'bg-orange-100 text-orange-700' : ''}
                            ${user.role === 'employer' ? 'bg-teal-100 text-teal-700' : ''}
                          `}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {user.verified ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">
                            Unverified
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.average_rating > 0 ? (
                          <span className="font-semibold text-[#F59E0B]">⭐ {user.average_rating.toFixed(1)}</span>
                        ) : (
                          <span className="text-muted-foreground">No ratings</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                            data-testid={`view-user-${user.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!user.verified && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerifyUser(user.id)}
                              className="text-green-600 hover:text-green-700"
                              data-testid={`verify-user-${user.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-700"
                            data-testid={`delete-user-${user.id}`}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-semibold text-[#1C1917]">Name</label>
                <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1C1917]">Email</label>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1C1917]">Phone</label>
                <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1C1917]">Role</label>
                <p className="text-sm text-muted-foreground capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1C1917]">Status</label>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.verified ? 'Verified' : 'Unverified'}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1C1917]">Rating</label>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.average_rating > 0 
                    ? `${selectedUser.average_rating.toFixed(1)} (${selectedUser.total_ratings} ratings)`
                    : 'No ratings yet'}
                </p>
              </div>
              {selectedUser.skills && selectedUser.skills.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-[#1C1917]">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.skills.map(skill => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-[#1C1917]">Joined</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteUser}
              data-testid="confirm-delete-button"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
