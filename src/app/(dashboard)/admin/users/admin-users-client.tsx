'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MoreVertical, User, ShieldAlert, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type AppUser = any; // type it loosely for now based on what we see in page.tsx

export function AdminUsersClient({ initialUsers }: { initialUsers: AppUser[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = 
      (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1">Manage platform administrators, managers, and students.</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm shadow-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search users by name or email..." 
                className="pl-9 border-slate-200 focus-visible:ring-indigo-500" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select 
              className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="college_admin">College Admins</option>
              <option value="super_admin">Super Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-4 font-medium text-slate-500">User</th>
                  <th className="p-4 font-medium text-slate-500">Contact</th>
                  <th className="p-4 font-medium text-slate-500">Role</th>
                  <th className="p-4 font-medium text-slate-500">Joined</th>
                  <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center shadow-inner">
                            <span className="font-bold text-indigo-700">
                              {user.full_name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                            </span>
                          </div>
                          <span className="font-medium text-slate-900 group-hover:text-[#bce600] transition-colors">
                            {user.full_name || 'Unnamed User'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`
                          ${user.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                            user.role === 'college_admin' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-slate-50 text-slate-700 border-slate-200'}
                        `}>
                          {user.role === 'super_admin' && <ShieldAlert className="h-3 w-3 mr-1" />}
                          {user.role?.replace('_', ' ') || 'User'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      <User className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p>No users found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50/50">
              <span className="text-sm text-slate-500">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, i, arr) => (
                      <React.Fragment key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 text-slate-400">...</span>}
                        <Button
                          variant={currentPage === p ? "default" : "outline"}
                          size="sm"
                          className={currentPage === p ? "bg-[#D4FF00] text-black" : ""}
                          onClick={() => setCurrentPage(p)}
                        >
                          {p}
                        </Button>
                      </React.Fragment>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
