import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useTierContext, UserDetailsWithEmail, UserTier } from "../../context/TierContext";

type AdminStats = {
  totalUsers: number;
  tier1Users: number;
  tier2Users: number;
  founderUsers: number;
  betaUsers: number;
  adminUsers: number;
  pausedUsers: number;
};

type ActionCard = {
  title: string;
  description: string;
  href?: string;
  icon: React.ReactNode;
  gradientClassName: string;
  isDisabled: boolean;
  badgeText?: string;
};

/**
 * AdminDashboard component for admin-only overview and navigation.
 */
const AdminDashboard: React.FC = () => {
  const { getAllUserDetails, isAdmin, loading: tierLoading } = useTierContext();
  const [users, setUsers] = useState<UserDetailsWithEmail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Fetch all user details for admin stats once the tier context is ready.
   */
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      if (tierLoading || !isAdmin) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const userDetails = await getAllUserDetails();
        setUsers(userDetails);
      } catch (error) {
        console.error("AdminDashboard - Error fetching users:", error);
        setErrorMessage("Unable to load admin stats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [getAllUserDetails, isAdmin, tierLoading]);

  /**
   * Compute the admin stats summary from fetched user data.
   */
  const stats = useMemo<AdminStats>(() => {
    /**
     * Count users by a list of tier identifiers.
     * @param tiers - The tier values to include.
     */
    const getTierCount = (tiers: UserTier[]): number => {
      return users.filter((user) => tiers.includes(user.tier as UserTier)).length;
    };

    return {
      totalUsers: users.length,
      tier1Users: getTierCount(["tier1"]),
      tier2Users: getTierCount(["tier2"]),
      founderUsers: getTierCount(["founder"]),
      betaUsers: getTierCount(["beta"]),
      adminUsers: getTierCount(["admin"]),
      pausedUsers: users.filter((user) => user.is_paused === true).length,
    };
  }, [users]);

  /**
   * Admin action cards configuration for navigation shortcuts.
   */
  const actionCards = useMemo<ActionCard[]>(() => {
    return [
      {
        title: "User Management",
        description: "Manage tiers, pauses, and admin access",
        href: "/admin/users",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
        gradientClassName: "bg-gradient-to-r from-indigo-500 to-purple-500",
        isDisabled: false,
      },
      {
        title: "Numerology Analytics",
        description: "Explore numerology usage trends",
        href: "/admin/numerology-analytics",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3v18m-4-9h8m-2-7l4 4m0-4l-4 4"
            />
          </svg>
        ),
        gradientClassName: "bg-gradient-to-r from-blue-500 to-cyan-500",
        isDisabled: false,
      },
      {
        title: "Feature Flags",
        description: "Configure experiments and rollouts",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h12l-2 4 2 4H4v6"
            />
          </svg>
        ),
        gradientClassName: "bg-gradient-to-r from-amber-500 to-orange-500",
        isDisabled: true,
        badgeText: "Coming Soon",
      },
      {
        title: "System Settings",
        description: "Configure core platform settings",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        gradientClassName: "bg-gradient-to-r from-gray-600 to-slate-700",
        isDisabled: true,
        badgeText: "Coming Soon",
      },
    ];
  }, []);

  /**
   * Render a loading state while data loads.
   */
  if (tierLoading || isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin overview...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  /**
   * Render a fallback when the current user is not an admin.
   */
  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center px-6 py-12 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              You need admin privileges to access this page.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Back to User Dashboard
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage platform access, analytics, and operations.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to User View
            </Link>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tier 1 Users</div>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.tier1Users}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tier 2 Users</div>
              <div className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.tier2Users}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Founder Users</div>
              <div className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.founderUsers}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Beta Users</div>
              <div className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">
                {stats.betaUsers}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Admin Users</div>
              <div className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.adminUsers}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Paused Users</div>
              <div className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.pausedUsers}
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionCards.map((card) => {
              const cardClasses = [
                "rounded-2xl p-5 shadow-sm border border-white/20 dark:border-gray-700/60",
                "bg-white/70 dark:bg-gray-800/70 backdrop-blur",
                card.isDisabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-md transition-shadow",
              ].join(" ");

              const content = (
                <div className={cardClasses}>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.gradientClassName}`}>
                      {card.icon}
                    </div>
                    {card.badgeText && (
                      <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {card.badgeText}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {card.description}
                  </p>
                </div>
              );

              if (card.isDisabled || !card.href) {
                return (
                  <div key={card.title}>
                    {content}
                  </div>
                );
              }

              return (
                <Link key={card.title} to={card.href} className="block">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
