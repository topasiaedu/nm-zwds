import React, { useMemo, useState, useEffect } from "react";
import {
  differenceInCalendarDays,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";
import { useTierContext, UserDetailsWithEmail, UserTier } from "../../context/TierContext";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import FeatureFlagsManager from "../../components/admin/FeatureFlagsManager";
import MembershipExpirationManager from "../../components/admin/MembershipExpirationManager";
import { FeatureFlags, PROGRAM_TEMPLATES } from "../../types/features";

/**
 * UserManagement component - Admin page for managing user tiers
 */
const UserManagement: React.FC = () => {
  const {
    getAllUserDetails,
    updateUserTier,
    toggleUserPause,
    updateFeatureFlags,
    applyProgramTemplate,
    updateMembershipExpiration,
    isAdmin,
    loading: tierLoading,
  } = useTierContext();
  
  const [users, setUsers] = useState<UserDetailsWithEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "tier1" | "tier2" | "founder" | "beta" | "admin" | "paused"
  >("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [batchUpdating, setBatchUpdating] = useState<boolean>(false);
  const [featureFlagsUser, setFeatureFlagsUser] = useState<UserDetailsWithEmail | null>(null);
  const [expirationUser, setExpirationUser] = useState<UserDetailsWithEmail | null>(null);
  const [openQuickActionsUserId, setOpenQuickActionsUserId] = useState<string | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);
  const EXPIRING_SOON_DAYS = 7;

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
   * Handle pause toggle for a single user
   */
  const handlePauseToggle = async (userId: string, currentPauseState: boolean) => {
    const newPauseState = !currentPauseState;
    setUpdating(userId);
    try {
      const success = await toggleUserPause(userId, newPauseState);
      if (success) {
        // Update local state
        setUsers(prev => 
          prev.map(user => 
            user.user_id === userId 
              ? { ...user, is_paused: newPauseState }
              : user
          )
        );
        alert(`User ${newPauseState ? "paused" : "unpaused"} successfully!`);
      } else {
        alert("Failed to toggle pause status. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling pause:", error);
      alert("An error occurred while toggling pause status.");
    } finally {
      setUpdating(null);
      setOpenQuickActionsUserId(null);
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
   * Handle batch pause/unpause
   */
  const handleBatchPauseToggle = async (shouldPause: boolean) => {
    if (selectedUsers.size === 0) {
      alert("Please select users to update.");
      return;
    }

    const action = shouldPause ? "pause" : "unpause";
    const confirmMessage = `Are you sure you want to ${action} ${selectedUsers.size} user(s)?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setBatchUpdating(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const userId of selectedUsers) {
        try {
          const success = await toggleUserPause(userId, shouldPause);
          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Error ${action}ing user ${userId}:`, error);
          failCount++;
        }
      }

      // Update local state for successful updates
      setUsers(prev => 
        prev.map(user => 
          selectedUsers.has(user.user_id) && successCount > 0
            ? { ...user, is_paused: shouldPause }
            : user
        )
      );

      // Clear selection
      setSelectedUsers(new Set());

      // Show result
      if (failCount === 0) {
        alert(`Successfully ${action}d ${successCount} user(s)!`);
      } else {
        alert(`${action}d ${successCount} user(s) successfully. ${failCount} failed.`);
      }
    } catch (error) {
      console.error(`Batch ${action} error:`, error);
      alert(`An error occurred during batch ${action}.`);
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
      case "beta":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "founder":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "tier2":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "tier1":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  /**
   * Build a safe display name for the user.
   */
  const getUserDisplayName = (user: UserDetailsWithEmail): string => {
    if (user.email && user.email.trim().length > 0) {
      return user.email;
    }
    return `${user.user_id.substring(0, 8)}...`;
  };

  /**
   * Parse membership expiration date safely.
   */
  const parseExpirationDate = (expiration: string | null): Date | null => {
    if (!expiration) {
      return null;
    }
    const parsed = parseISO(expiration);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  /**
   * Build UI metadata for the membership expiration badge.
   */
  const getExpirationStatus = (expiration: string | null) => {
    const expirationDate = parseExpirationDate(expiration);
    if (!expirationDate) {
      return {
        label: "Unlimited",
        description: "No expiration date set.",
        badgeClass:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
        daysRemaining: null,
      };
    }

    const normalizedExpiration = startOfDay(expirationDate);
    const daysRemaining = differenceInCalendarDays(normalizedExpiration, today);

    if (isBefore(normalizedExpiration, today)) {
      return {
        label: "Expired",
        description: `Expired on ${format(expirationDate, "PPP")}`,
        badgeClass:
          "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
        daysRemaining,
      };
    }

    return {
      label: "Active",
      description: `Expires on ${format(expirationDate, "PPP")}`,
      badgeClass:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
      daysRemaining,
    };
  };

  /**
   * Open the feature flags modal for a user.
   */
  const handleOpenFeatureFlags = (user: UserDetailsWithEmail) => {
    setFeatureFlagsUser(user);
  };

  /**
   * Persist feature flag changes and update local state.
   */
  const handleSaveFeatureFlags = async (flags: FeatureFlags) => {
    if (!featureFlagsUser) {
      return;
    }

    setUpdating(featureFlagsUser.user_id);
    try {
      const success = await updateFeatureFlags(featureFlagsUser.user_id, flags);
      if (!success) {
        alert("Failed to update feature flags. Please try again.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === featureFlagsUser.user_id ? { ...user, feature_flags: flags } : user
        )
      );
      alert("Feature flags updated successfully!");
      setFeatureFlagsUser(null);
    } catch (error) {
      console.error("Error updating feature flags:", error);
      alert("An error occurred while updating feature flags.");
    } finally {
      setUpdating(null);
    }
  };

  /**
   * Open the expiration modal for a user.
   */
  const handleOpenExpirationModal = (user: UserDetailsWithEmail) => {
    setExpirationUser(user);
  };

  /**
   * Persist membership expiration updates and update local state.
   */
  const handleSaveExpiration = async (expiration: string | null) => {
    if (!expirationUser) {
      return;
    }

    setUpdating(expirationUser.user_id);
    try {
      const success = await updateMembershipExpiration(expirationUser.user_id, expiration);
      if (!success) {
        alert("Failed to update membership expiration. Please try again.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === expirationUser.user_id
            ? { ...user, membership_expiration: expiration }
            : user
        )
      );
      alert("Membership expiration updated successfully!");
      setExpirationUser(null);
    } catch (error) {
      console.error("Error updating membership expiration:", error);
      alert("An error occurred while updating membership expiration.");
    } finally {
      setUpdating(null);
    }
  };

  /**
   * Toggle the quick actions dropdown for a user.
   */
  const handleToggleQuickActions = (userId: string) => {
    setOpenQuickActionsUserId((previous) => (previous === userId ? null : userId));
  };

  /**
   * Apply a program template and tier for a user.
   */
  const handleQuickProgramSet = async (user: UserDetailsWithEmail, program: UserTier) => {
    const previousTier = user.tier;
    setUpdating(user.user_id);

    try {
      const tierUpdated = await updateUserTier(user.user_id, program);
      if (!tierUpdated) {
        alert("Failed to update user tier. Please try again.");
        return;
      }

      const flagsUpdated = await applyProgramTemplate(user.user_id, program);
      if (!flagsUpdated) {
        await updateUserTier(user.user_id, previousTier as UserTier);
        alert("Failed to apply program features. Tier changes were rolled back.");
        return;
      }

      setUsers((prev) =>
        prev.map((existingUser) =>
          existingUser.user_id === user.user_id
            ? {
                ...existingUser,
                tier: program,
                feature_flags: PROGRAM_TEMPLATES[program],
              }
            : existingUser
        )
      );
      alert(`User updated to ${program.toUpperCase()} successfully!`);
      setOpenQuickActionsUserId(null);
    } catch (error) {
      console.error("Error applying program template:", error);
      alert("An error occurred while applying the program template.");
    } finally {
      setUpdating(null);
    }
  };

  /**
   * Filter users based on selected filter
   */
  const filteredUsers = users.filter(user => {
    if (filter === "all") return true;
    if (filter === "paused") return user.is_paused === true;
    return user.tier === filter;
  });

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
                onClick={() => setFilter("founder")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "founder"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Founder ({users.filter(u => u.tier === "founder").length})
              </button>
              <button
                onClick={() => setFilter("beta")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "beta"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Beta ({users.filter(u => u.tier === "beta").length})
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
              <button
                onClick={() => setFilter("paused")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "paused"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Paused ({users.filter(u => u.is_paused === true).length})
              </button>
            </div>
          </div>

          {/* Batch Actions */}
          {selectedUsers.size > 0 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  {selectedUsers.size} user(s) selected
                </span>
                <div className="flex flex-wrap gap-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBatchTierUpdate("tier1")}
                      disabled={batchUpdating}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50 text-sm"
                    >
                      → Tier 1
                    </button>
                    <button
                      onClick={() => handleBatchTierUpdate("tier2")}
                      disabled={batchUpdating}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 disabled:opacity-50 text-sm"
                    >
                      → Tier 2
                    </button>
                    <button
                      onClick={() => handleBatchTierUpdate("admin")}
                      disabled={batchUpdating}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50 text-sm"
                    >
                      → Admin
                    </button>
                  </div>
                  <div className="flex space-x-2 border-l pl-2 border-blue-300 dark:border-blue-700">
                    <button
                      onClick={() => handleBatchPauseToggle(true)}
                      disabled={batchUpdating}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 disabled:opacity-50 text-sm"
                    >
                      ⏸ Pause
                    </button>
                    <button
                      onClick={() => handleBatchPauseToggle(false)}
                      disabled={batchUpdating}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50 text-sm"
                    >
                      ▶ Unpause
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedUsers(new Set())}
                    disabled={batchUpdating}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
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
                      Membership
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierBadgeColor(user.tier as UserTier)}`}>
                          {user.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const expiration = getExpirationStatus(user.membership_expiration);
                          const showWarning =
                            expiration.daysRemaining !== null &&
                            expiration.daysRemaining >= 0 &&
                            expiration.daysRemaining <= EXPIRING_SOON_DAYS;

                          return (
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${expiration.badgeClass}`}
                                title={expiration.description}
                              >
                                {expiration.label}
                              </span>
                              {expiration.daysRemaining !== null && expiration.label !== "Expired" && (
                                <span
                                  className={`text-xs ${
                                    showWarning ? "text-amber-600 dark:text-amber-300" : "text-gray-500 dark:text-gray-400"
                                  }`}
                                  title={expiration.description}
                                >
                                  {showWarning
                                    ? `${expiration.daysRemaining} day(s) remaining`
                                    : `${expiration.daysRemaining} day(s) left`}
                                </span>
                              )}
                              {expiration.daysRemaining !== null && expiration.label === "Expired" && (
                                <span className="text-xs text-red-600 dark:text-red-300">
                                  {`${Math.abs(expiration.daysRemaining)} day(s) ago`}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_paused ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                            ⏸ PAUSED
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            ▶ ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleOpenFeatureFlags(user)}
                              disabled={updating === user.user_id}
                              className="px-2.5 py-1 text-xs rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors disabled:opacity-50"
                            >
                              Manage Features
                            </button>
                            <button
                              onClick={() => handleOpenExpirationModal(user)}
                              disabled={updating === user.user_id}
                              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                            >
                              Set Expiration
                            </button>
                          </div>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => handleToggleQuickActions(user.user_id)}
                              disabled={updating === user.user_id}
                              className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                              Quick Actions
                            </button>
                            {openQuickActionsUserId === user.user_id && (
                              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                <button
                                  type="button"
                                  onClick={() => handlePauseToggle(user.user_id, user.is_paused)}
                                  disabled={updating === user.user_id}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                  {user.is_paused ? "Unpause Membership" : "Pause Membership"}
                                </button>
                                <div className="border-t border-gray-100 dark:border-gray-700" />
                                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                                  Quick Set Program
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleQuickProgramSet(user, "tier2")}
                                  disabled={updating === user.user_id}
                                  className="w-full text-left px-4 py-2 text-sm text-indigo-700 dark:text-indigo-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                  Apply DYD (Tier 2)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickProgramSet(user, "founder")}
                                  disabled={updating === user.user_id}
                                  className="w-full text-left px-4 py-2 text-sm text-emerald-700 dark:text-emerald-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                  Apply Founder
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickProgramSet(user, "beta")}
                                  disabled={updating === user.user_id}
                                  className="w-full text-left px-4 py-2 text-sm text-amber-700 dark:text-amber-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                  Apply Beta
                                </button>
                              </div>
                            )}
                          </div>
                          {updating === user.user_id && (
                            <span className="text-blue-600 dark:text-blue-400 text-xs">Updating...</span>
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

          {featureFlagsUser && (
            <FeatureFlagsManager
              userId={featureFlagsUser.user_id}
              currentFlags={featureFlagsUser.feature_flags ?? {}}
              onSave={handleSaveFeatureFlags}
              onClose={() => setFeatureFlagsUser(null)}
            />
          )}

          {expirationUser && (
            <MembershipExpirationManager
              userId={expirationUser.user_id}
              currentExpiration={expirationUser.membership_expiration}
              userName={getUserDisplayName(expirationUser)}
              onSave={handleSaveExpiration}
              onClose={() => setExpirationUser(null)}
            />
          )}

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {users.filter(u => u.is_paused === true).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Paused Users</div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserManagement; 