import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTierContext, UserDetailsWithEmail, UserTier } from "../../context/TierContext";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";

/**
 * UserManagement component - Admin page for managing user tiers
 */
const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { getAllUserDetails, updateUserTier, isAdmin, loading: tierLoading } = useTierContext();
  
  const [users, setUsers] = useState<UserDetailsWithEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "tier1" | "tier2" | "admin">("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [batchUpdating, setBatchUpdating] = useState<boolean>(false);

  /**
   * Fetch all user details on component mount - but only after TierContext finishes loading
   */
  useEffect(() => {
    const fetchUsers = async () => {
      // Wait for TierContext to finish loading before trying to fetch users
      if (tierLoading || !isAdmin) {
        return;
      }
      
      setLoading(true);
      try {
        const userDetails = await getAllUserDetails();
        setUsers(userDetails);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAllUserDetails, tierLoading, isAdmin]);

  /**
   * Handle single tier update
   */
  const handleTierUpdate = async (userId: string, newTier: UserTier) => {
    setUpdating(userId);
    try {
      const success = await updateUserTier(userId, newTier);
      if (success) {
        // Update local state
        setUsers(prev => 
          prev.map(user => 
            user.user_id === userId 
              ? { ...user, tier: newTier }
              : user
          )
        );
        alert("User tier updated successfully!");
      } else {
        alert("Failed to update user tier. Please try again.");
      }
    } catch (error) {
      console.error("Error updating tier:", error);
      alert("An error occurred while updating the tier.");
    } finally {
      setUpdating(null);
    }
  };

  /**
   * Handle batch tier update
   */
  const handleBatchTierUpdate = async (newTier: UserTier) => {
    if (selectedUsers.size === 0) {
      alert("Please select users to update.");
      return;
    }

    const confirmMessage = `Are you sure you want to update ${selectedUsers.size} user(s) to ${newTier.toUpperCase()}?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setBatchUpdating(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Update users one by one (could be optimized with batch API call)
      for (const userId of selectedUsers) {
        try {
          const success = await updateUserTier(userId, newTier);
          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Error updating user ${userId}:`, error);
          failCount++;
        }
      }

      // Update local state for successful updates
      setUsers(prev => 
        prev.map(user => 
          selectedUsers.has(user.user_id) && successCount > 0
            ? { ...user, tier: newTier }
            : user
        )
      );

      // Clear selection
      setSelectedUsers(new Set());

      // Show result
      if (failCount === 0) {
        alert(`Successfully updated ${successCount} user(s) to ${newTier.toUpperCase()}!`);
      } else {
        alert(`Updated ${successCount} user(s) successfully. ${failCount} failed.`);
      }
    } catch (error) {
      console.error("Batch update error:", error);
      alert("An error occurred during batch update.");
    } finally {
      setBatchUpdating(false);
    }
  };

  /**
   * Handle checkbox selection
   */
  const handleSelectUser = (userId: string, isChecked: boolean) => {
    const newSelection = new Set(selectedUsers);
    if (isChecked) {
      newSelection.add(userId);
    } else {
      newSelection.delete(userId);
    }
    setSelectedUsers(newSelection);
  };

  /**
   * Handle select all/none
   */
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allUserIds = new Set(filteredUsers.map(user => user.user_id));
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers(new Set());
    }
  };

  /**
   * Get badge color for tier
   */
  const getTierBadgeColor = (tier: UserTier): string => {
    switch (tier) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "tier2":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "tier1":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  /**
   * Filter users based on selected filter
   */
  const filteredUsers = users.filter(user => 
    filter === "all" || user.tier === filter
  );

  // Redirect if not admin (this should be handled by route protection, but adding as extra security)
  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4">You need admin privileges to access this page.</p>
          <Link to="/dashboard" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Return to Dashboard
          </Link>
        </div>
      </PageTransition>
    );
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  User Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage user tiers and permissions
                </p>
              </div>
              <Link
                to="/dashboard"
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                All Users ({users.length})
              </button>
              <button
                onClick={() => setFilter("tier1")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "tier1"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Tier 1 ({users.filter(u => u.tier === "tier1").length})
              </button>
              <button
                onClick={() => setFilter("tier2")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "tier2"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Tier 2 ({users.filter(u => u.tier === "tier2").length})
              </button>
              <button
                onClick={() => setFilter("admin")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "admin"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Admins ({users.filter(u => u.tier === "admin").length})
              </button>
            </div>
          </div>

          {/* Batch Actions */}
          {selectedUsers.size > 0 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  {selectedUsers.size} user(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBatchTierUpdate("tier1")}
                    disabled={batchUpdating}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    → Tier 1
                  </button>
                  <button
                    onClick={() => handleBatchTierUpdate("tier2")}
                    disabled={batchUpdating}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 disabled:opacity-50"
                  >
                    → Tier 2
                  </button>
                  <button
                    onClick={() => handleBatchTierUpdate("admin")}
                    disabled={batchUpdating}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                  >
                    → Admin
                  </button>
                  <button
                    onClick={() => setSelectedUsers(new Set())}
                    disabled={batchUpdating}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
              {batchUpdating && (
                <div className="mt-2 text-blue-600 dark:text-blue-400">
                  Updating users...
                </div>
              )}
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Current Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.user_id)}
                          onChange={(e) => handleSelectUser(user.user_id, e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                        {user.user_id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {user.email || "Loading..."}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierBadgeColor(user.tier)}`}>
                          {user.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {user.tier !== "tier1" && (
                            <button
                              onClick={() => handleTierUpdate(user.user_id, "tier1")}
                              disabled={updating === user.user_id}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:opacity-50"
                            >
                              → Tier 1
                            </button>
                          )}
                          {user.tier !== "tier2" && (
                            <button
                              onClick={() => handleTierUpdate(user.user_id, "tier2")}
                              disabled={updating === user.user_id}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-100 disabled:opacity-50"
                            >
                              → Tier 2
                            </button>
                          )}
                          {user.tier !== "admin" && (
                            <button
                              onClick={() => handleTierUpdate(user.user_id, "admin")}
                              disabled={updating === user.user_id}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100 disabled:opacity-50"
                            >
                              → Admin
                            </button>
                          )}
                          {updating === user.user_id && (
                            <span className="text-blue-600 dark:text-blue-400">Updating...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No users found for the selected filter.
                </p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.tier === "tier1").length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Tier 1 Users</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {users.filter(u => u.tier === "tier2").length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Tier 2 Users</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {users.filter(u => u.tier === "admin").length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Admin Users</div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserManagement; 