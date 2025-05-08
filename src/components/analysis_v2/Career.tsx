import React from "react";
import { Badge } from "flowbite-react";
import { Tilt } from "react-tilt";

/**
 * Type definition for a career item to be displayed as a badge
 */
type CareerItem = {
  id: string;
  label: string;
};

/**
 * Type definition for Tilt options
 */
type TiltOptions = {
  scale: number;
  speed: number;
  max: number;
  glare: boolean;
  "max-glare": number;
};

/**
 * Career component displaying career analysis with image and text in a two-column layout
 */
const Career: React.FC = () => {
  // Career data for badges
  const careerOptions: CareerItem[] = [
    { id: "career-1", label: "Creative Direction" },
    { id: "career-2", label: "Boutique Brand Creation" },
    { id: "career-3", label: "Holistic Design (interior, fashion, UX)" },
    { id: "career-4", label: "Storytelling & Content Creation" },
    { id: "career-5", label: "Spiritual or Mindfulness-Based Business" },
    { id: "career-6", label: "Art Therapy or Healing Arts" },
    { id: "career-7", label: "Curated Retail (lifestyle, beauty, wellness)" },
    { id: "career-8", label: "Visual Arts & Installations" },
    { id: "career-9", label: "Ethical Product Development" },
    { id: "career-10", label: "Experience Design (events, spaces, brand worlds)" }
  ];
  

  const nonIdealCareerOptions: CareerItem[] = [
    { id: "career-11", label: "Cold-Call Sales or Commission-Based Roles" },
    { id: "career-12", label: "Corporate Advertising Strategy" },
    { id: "career-13", label: "High-Volume Social Media Management" },
    { id: "career-14", label: "Political PR or Image Consulting" },
    { id: "career-15", label: "Data-Heavy Market Research" },
    { id: "career-16", label: "Real Estate Sales" },
    { id: "career-17", label: "Corporate Consulting or Business Analysis" },
    { id: "career-18", label: "Standardized Test Prep or Traditional Teaching" },
    { id: "career-19", label: "Call Center or Customer Service Roles" },
    { id: "career-20", label: "Mass-Produced Product Sales" }
  ];
  

  // Tilt options for the image
  const tiltOptions: TiltOptions = {
    scale: 1.05,
    speed: 1000,
    max: 10,
    glare: true,
    "max-glare": 0.5,
  };

  /**
   * Renders career items as styled badges
   */
  const renderCareerItems = (items: CareerItem[]): JSX.Element[] => {
    return items.map((item) => (
      <Badge key={item.id} color="purple" className="mr-2 mb-2">
        {item.label}
      </Badge>
    ));
  };

  const renderNonIdealCareerItems = (items: CareerItem[]): JSX.Element[] => {
    return items.map((item) => (
      <Badge key={item.id} color="red" className="mr-2 mb-2">
        {item.label}
      </Badge>
    ));
  };

  return (
    <>
      <div className="p-6 dark:bg-gray-900">
        {/* Divider */}
        <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>

        {/* Title */}
        <h2 className="text-4xl mb-2 dark:text-white text-center font-bold">
          WEALTH STRATEGY PANEL
        </h2>

        {/* Subtitle */}
        <p className="text-lg mb-6 dark:text-white text-center italic">
          Uncover how you’re wired to earn, invest, and build long-term
          financial power.
        </p>
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Image with Tilt Effect */}
          <div className="md:w-[30%] p-4 flex justify-center">
            <Tilt options={tiltOptions} className="w-full h-full">
              <img
                src="/assets/visionaries.png"
                alt="Visionaries"
                className="rounded-lg shadow-md max-h-[500px] object-contain w-full"
              />
            </Tilt>
          </div>

          {/* Right Column - Description and Career Options */}
          <div className="md:w-[70%] p-4">
            <div className="rounded-lg shadow-sm">
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white italic">
                  Your Visionary Path
                </h2>

                {/* Description */}
                <div>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                  You possess an unparalleled imagination and a singular aesthetic sensibility, effortlessly uncovering the extraordinary hidden within the ordinary. Whether observing the world through a lens of wonder or analyzing the subtle details others might overlook, you bring a depth of perception that transforms the mundane into the magnificent. Your natural sensitivity to art, culture, and creativity allows you to draw connections between ideas, mediums, and emotions with graceful intuition. Whether it&apos;s through color, sound, words, or spatial design, your work becomes a conduit for meaning—an emotional bridge between inspiration and impact.
                  </p>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    More than just a creator, you are a visionary and a catalyst for artistic evolution. Your ideas often transcend trends, breathing new life into established forms while also breaking boundaries with bold originality. There&apos;s an innate power in your expression—one that awakens the senses and stirs the soul. Through your creative voice, you don&apos;t merely reflect the world around you; you shape its future, challenging others to see, feel, and think more deeply. Your artistry resonates on both a personal and collective level, helping to define and expand the aesthetic values of our time.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 italic font-medium">
                    You are the hands that make the world warmer and deeper, and
                    a builder of the human spirit.
                  </p>
                </div>

                {/* Career Options */}
                <div className="mt-6">
                  <h5 className="text-lg font-bold mb-4 dark:text-white">
                    Ideal Careers
                  </h5>
                  <div className="flex flex-wrap">
                    {renderCareerItems(careerOptions)}
                  </div>
                </div>

                {/* Non Ideal Careers */}
                <div className="mt-6">
                  <h5 className="text-lg font-bold mb-4 dark:text-white">
                    Non Ideal Careers
                  </h5>
                  <div className="flex flex-wrap">
                    {renderNonIdealCareerItems(nonIdealCareerOptions)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Career;
