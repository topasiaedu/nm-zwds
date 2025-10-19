import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import { Database } from "../../../database.types";
import { useTierAccess } from "../../context/TierContext";
import PageTransition from "../../components/PageTransition";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Interface for numerology result
 */
interface NumerologyResult {
  profileId: string;
  name: string;
  birthdate: string;
  primary: number;
  secondary: number;
  master: number;
  combination: string;
}

/**
 * Interface for combination count
 */
interface CombinationCount {
  combination: string;
  count: number;
  percentage: string;
}

/**
 * NumerologyAnalytics component - Admin page for viewing numerology patterns
 */
const NumerologyAnalytics: React.FC = () => {
  const { isAdmin } = useTierAccess();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "buyers" | "freeTest" | "relations">("all");

  /**
   * Fetch all profiles on component mount
   */
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching profiles:", error);
        } else {
          setProfiles(data || []);
        }
      } catch (error) {
        console.error("Exception fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [isAdmin]);

  /**
   * Reduce a number to a single digit by adding its digits
   * Example: 18 → 1 + 8 = 9
   */
  const reduceToSingleDigit = (num: number): number => {
    while (num > 9) {
      num = num
        .toString()
        .split("")
        .reduce((sum, digit) => sum + Number.parseInt(digit, 10), 0);
    }
    return num;
  };

  /**
   * Calculate numerology for a given birthdate
   * Example: 14 December 1999
   * - Day: 14 → 1 + 4 = 5
   * - Month: 12 → 1 + 2 = 3
   * - Primary = 5 + 3 = 8
   * - Year: 1999 → split as "19" and "99"
   *   - 19 → 1 + 9 = 10 → 1 + 0 = 1
   *   - 99 → 9 + 9 = 18 → 1 + 8 = 9
   * - Secondary = 1 + 9 = 10 → 1 + 0 = 1
   * - Master = 8 + 1 = 9
   * Result: 8-1-9
   */
  const calculateNumerology = (
    birthdate: string,
    profileId: string,
    name: string
  ): NumerologyResult | null => {
    try {
      const date = new Date(birthdate);
      const day = date.getDate();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const year = date.getFullYear();

      // Calculate Primary (Day + Month)
      const daySum = reduceToSingleDigit(day);
      const monthSum = reduceToSingleDigit(month);
      const primary = reduceToSingleDigit(daySum + monthSum);

      // Calculate Secondary (Year as two pairs)
      const yearStr = year.toString();
      const firstPair = Number.parseInt(yearStr.substring(0, 2), 10);
      const secondPair = Number.parseInt(yearStr.substring(2, 4), 10);
      const firstPairSum = reduceToSingleDigit(firstPair);
      const secondPairSum = reduceToSingleDigit(secondPair);
      const secondary = reduceToSingleDigit(firstPairSum + secondPairSum);

      // Calculate Master (Primary + Secondary)
      const master = reduceToSingleDigit(primary + secondary);

      return {
        profileId,
        name,
        birthdate,
        primary,
        secondary,
        master,
        combination: `${primary}-${secondary}-${master}`,
      };
    } catch (error) {
      console.error("Error calculating numerology for", birthdate, error);
      return null;
    }
  };

  /**
   * Filter profiles by created_at date range
   */
  const filteredProfiles = useMemo(() => {
    if (!startDate && !endDate) {
      return profiles;
    }

    return profiles.filter((profile) => {
      const profileDate = new Date(profile.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && profileDate < start) return false;
      if (end && profileDate > end) return false;
      return true;
    });
  }, [profiles, startDate, endDate]);

  /**
   * Segment profiles into three groups (mutually exclusive)
   */
  const segmentedProfiles = useMemo(() => {
    const buyers = filteredProfiles.filter(
      (p) => p.is_self === true && p.user_id !== "2fdd8c60-fdb0-4ba8-a6e4-327a28179498"
    );
    const freeTest = filteredProfiles.filter(
      (p) => p.user_id === "2fdd8c60-fdb0-4ba8-a6e4-327a28179498"
    );
    const relations = filteredProfiles.filter(
      (p) => p.is_self === false && p.user_id !== "2fdd8c60-fdb0-4ba8-a6e4-327a28179498"
    );

    return { buyers, freeTest, relations };
  }, [filteredProfiles]);

  /**
   * Calculate numerology results for a group
   */
  const calculateGroupNumerology = (
    groupProfiles: Profile[]
  ): NumerologyResult[] => {
    return groupProfiles
      .map((profile) =>
        calculateNumerology(profile.birthday, profile.id, profile.name)
      )
      .filter((result): result is NumerologyResult => result !== null);
  };

  /**
   * Get combination counts sorted by count
   */
  const getCombinationCounts = (
    results: NumerologyResult[]
  ): CombinationCount[] => {
    const counts = new Map<string, number>();

    for (const result of results) {
      const current = counts.get(result.combination) || 0;
      counts.set(result.combination, current + 1);
    }

    const total = results.length;
    return Array.from(counts.entries())
      .map(([combination, count]) => ({
        combination,
        count,
        percentage: ((count / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);
  };

  /**
   * Get frequency distribution for a specific number type (primary, secondary, or master)
   */
  const getNumberDistribution = (
    results: NumerologyResult[],
    type: "primary" | "secondary" | "master"
  ) => {
    const counts = new Map<number, number>();

    // Initialize all numbers 1-9
    for (let i = 1; i <= 9; i++) {
      counts.set(i, 0);
    }

    for (const result of results) {
      const value = result[type];
      counts.set(value, (counts.get(value) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([number, count]) => ({
        number: number.toString(),
        count,
      }))
      .sort((a, b) => Number.parseInt(a.number, 10) - Number.parseInt(b.number, 10));
  };

  /**
   * Render section for a specific group
   */
  const renderGroupSection = (
    title: string,
    description: string,
    profiles: Profile[],
    bgColor: string,
    borderColor: string,
    textColor: string
  ) => {
    const results = calculateGroupNumerology(profiles);
    const combinationCounts = getCombinationCounts(results);
    const top10 = combinationCounts.slice(0, 10);
    const primaryDist = getNumberDistribution(results, "primary");
    const secondaryDist = getNumberDistribution(results, "secondary");
    const masterDist = getNumberDistribution(results, "master");

    // Prepare data for pie chart
    const pieData = top10.map((item, index) => ({
      id: item.combination,
      label: item.combination,
      value: item.count,
      color: `hsl(${(index * 360) / 10}, 70%, 50%)`,
    }));

    return (
      <div className="mb-8">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${textColor} mb-2`}>{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">
              No profiles found in this group.
            </p>
          </div>
        ) : (
          <>
            {/* Top 10 Combinations Table */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Top 10 Numerology Combinations
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Combination (Primary-Secondary-Master)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {top10.map((item, index) => (
                      <tr
                        key={item.combination}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {item.combination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Primary Number Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Primary Number Distribution
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sum of day and month digits
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={primaryDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="number" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "0.5rem",
                        color: "#F3F4F6",
                      }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Secondary Number Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Secondary Number Distribution
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sum of year digit pairs
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={secondaryDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="number" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "0.5rem",
                        color: "#F3F4F6",
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Master Number Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Master Number Distribution
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sum of Primary and Secondary
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={masterDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="number" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "0.5rem",
                        color: "#F3F4F6",
                      }}
                    />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top 10 Combinations Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top 10 Combinations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Most common numerology patterns
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      label={(entry) => `${entry.label}: ${entry.value}`}>
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "0.5rem",
                        color: "#F3F4F6",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* All Combinations Table */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                All Combinations
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Combination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {combinationCounts.map((item) => (
                      <tr
                        key={item.combination}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.combination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4">You need admin privileges to access this page.</p>
          <Link
            to="/dashboard"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading profiles...
          </p>
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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Numerology Analytics
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Birth date numerology patterns across all profiles
                </p>
              </div>
              <Link
                to="/dashboard"
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-xl p-4 shadow-sm text-left transition-all ${
                activeTab === "all"
                  ? "bg-gray-100 dark:bg-gray-700 border-2 border-gray-500"
                  : "bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-300"
              }`}>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredProfiles.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Profiles</div>
            </button>
            <button
              onClick={() => setActiveTab("buyers")}
              className={`rounded-xl p-4 shadow-sm text-left transition-all ${
                activeTab === "buyers"
                  ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
                  : "bg-white dark:bg-gray-800 border-2 border-transparent hover:border-blue-300"
              }`}>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {segmentedProfiles.buyers.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Buyers/Members</div>
            </button>
            <button
              onClick={() => setActiveTab("freeTest")}
              className={`rounded-xl p-4 shadow-sm text-left transition-all ${
                activeTab === "freeTest"
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                  : "bg-white dark:bg-gray-800 border-2 border-transparent hover:border-green-300"
              }`}>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {segmentedProfiles.freeTest.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Free Test Users</div>
            </button>
            <button
              onClick={() => setActiveTab("relations")}
              className={`rounded-xl p-4 shadow-sm text-left transition-all ${
                activeTab === "relations"
                  ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500"
                  : "bg-white dark:bg-gray-800 border-2 border-transparent hover:border-purple-300"
              }`}>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {segmentedProfiles.relations.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Relations/Others</div>
            </button>
          </div>

          {/* Date Range Filter - Compact */}
          <div className="mb-6 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Clear
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "all" && renderGroupSection(
            "All Profiles Analytics",
            "Complete overview of all profiles in the system",
            filteredProfiles,
            "",
            "",
            "text-gray-700 dark:text-gray-400"
          )}

          {activeTab === "buyers" && renderGroupSection(
            "Buyers/Members Analytics",
            "Profiles with is_self = true - Users who have purchased memberships",
            segmentedProfiles.buyers,
            "",
            "",
            "text-blue-700 dark:text-blue-400"
          )}

          {activeTab === "freeTest" && renderGroupSection(
            "Free Test Users Analytics",
            "Profiles from the free test program - Potential customers",
            segmentedProfiles.freeTest,
            "",
            "",
            "text-green-700 dark:text-green-400"
          )}

          {activeTab === "relations" && renderGroupSection(
            "Relations/Others Analytics",
            "Profiles with is_self = false - Friends, family, or clients of buyers",
            segmentedProfiles.relations,
            "",
            "",
            "text-purple-700 dark:text-purple-400"
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default NumerologyAnalytics;

