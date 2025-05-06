import React from "react";
import { Badge } from "flowbite-react";

/**
 * Type definition for a feature item to be displayed as a badge
 */
type FeatureItem = {
  id: string;
  label: string;
};

/**
 * Type definition for the features section data
 */
type FeaturesData = {
  strengths: FeatureItem[];
  weaknesses: FeatureItem[];
  tips: FeatureItem[];
};

/**
 * Overview component displaying personality analysis in a two-column layout
 */
const Overview: React.FC = () => {
  // Mock data for the features section
  const featuresData: FeaturesData = {
    strengths: [
      { id: "strength-1", label: "Dares to speak the truth" },
      { id: "strength-2", label: "Clear logic" },
      { id: "strength-3", label: "Strong observational skills" },
      { id: "strength-4", label: "Impactful expression" },
    ],
    weaknesses: [
      { id: "weakness-1", label: "Can appear too critical" },
      { id: "weakness-2", label: "May struggle with tact" },
      { id: "weakness-3", label: "Risk of alienating others" },
      { id: "weakness-4", label: "Potential for overthinking" },
    ],
    tips: [
      {
        id: "tip-1",
        label:
          "You're not a master of arguments—you're an antidote to toxic language",
      },
      {
        id: "tip-2",
        label:
          "Learn to price yourself through altruism, so your value can be seen",
      },
      {
        id: "tip-3",
        label: "Build a team system / Establish a leadership-profit equation",
      },
      {
        id: "tip-4",
        label:
          "Define your professional niche / Practice expressing ambition with grace",
      },
    ],
  };

  /**
   * Renders feature items as styled badges
   */
  const renderFeatureItems = (
    items: FeatureItem[],
    color: string
  ): JSX.Element[] => {
    return items.map((item) => (
      <Badge key={item.id} color={color} className="mr-2 mb-2">
        {item.label}
      </Badge>
    ));
  };

  /**
   * Renders tip items with increased size and emphasis
   */
  const renderTipItems = (items: FeatureItem[]): JSX.Element[] => {
    return items.map((item) => (
      <div
        key={item.id}
        className="p-4 mb-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-md shadow-sm hover:shadow transition-shadow dark:shadow-gray-800">
        <p className="text-base font-medium text-blue-900 dark:text-blue-300">
          {item.label}
        </p>
      </div>
    ));
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Description Text */}
        <div className="md:w-1/2 p-4">
          <div className="rounded-lg shadow-sm">
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              You are a natural thinker, skilled at dissecting the logic and
              truth behind things, with the sharp insight to see through
              appearances. You&apos;re not easily swayed by popular opinion, and
              you&apos;re unafraid to voice your genuine judgments. Your
              questions often cut straight to the point, and your analyses tend
              to offer unique perspectives. While others may still be distracted
              by surface phenomena, you&apos;ve already begun to qstion and dig
              deeper.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You have a strong need to express yourself and the ability to
              speak on behalf of the silent majority. You thrive in areas that
              require judgment, discussion, dialectical thinking, and public
              communication — such as media, law, policy analysis, and public
              communication. Your words carry weight; they are powerful tools to
              expose falsehoods and challenge blind conformity. However,
              it&apos;s important for you to learn when and how to speak, so
              that your sharpness becomes a strength rather than a source of
              conflict. When you channel your critical mindset into constructive
              language, you become a key force in changing systems and elevating
              collective awareness.
            </p>
          </div>
        </div>

        {/* Divider for medium screens and above */}
        <div className="hidden md:block md:w-px md:bg-gray-300 dark:md:bg-gray-700 md:mx-4"></div>

        {/* Right Column - Features (Strengths, Weaknesses, Tips) */}
        <div className="md:w-1/2 p-4">
          <div className="rounded-lg shadow-sm">
            <div className="mb-6">
              <h5 className="text-lg font-bold mb-3 dark:text-white">
                Strengths
              </h5>
              <div className="flex flex-wrap">
                {renderFeatureItems(featuresData.strengths, "success")}
              </div>
            </div>

            <div className="mb-6">
              <h5 className="text-lg font-bold mb-3 dark:text-white">
                Potential Challenges
              </h5>
              <div className="flex flex-wrap">
                {renderFeatureItems(featuresData.weaknesses, "failure")}
              </div>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-4 pb-2 dark:text-white ">
                Growth Tips
              </h5>
              <div>{renderTipItems(featuresData.tips)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
