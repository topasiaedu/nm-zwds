import React from "react";
import { Tilt } from "react-tilt";

/**
 * Type definition for a palace item data
 */
type PalaceItem = {
  palace: string;
  transformation: string;
  description: string;
  quote: string;
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
 * FourKeyPalace component displaying four palace cards with transformation data
 */
const FourKeyPalace: React.FC = () => {
  // Tilt options for the cards
  const tiltOptions: TiltOptions = {
    scale: 1.05,
    speed: 1000,
    max: 10,
    glare: true,
    "max-glare": 0.5,
  };

  // Data for the four palace cards
  const palaceData: PalaceItem[] = [
    {
      palace: "Property",
      transformation: "化禄",
      description: "You're entering a phase where 'space defines energy'—no longer just passing through, but seriously reflecting on where you belong. Whether it's buying a home, redecorating, or finding spiritual grounding, your space now greatly impacts your stability and luck. This is the beginning of actively shaping a personal energy field. Organizing your home means organizing your life—and this stability becomes your foundation for future actions.",
      quote: "When the home is settled, your wealth finally has a place to land."
    },
    {
      palace: "Friends",
      transformation: "化权",
      description: "You're no longer content just fitting in—you want to take the lead in managing and integrating resources. This marks your transition from participant to leader. You now seek strategy and systems, not just exposure. You'll care more about the efficiency of your network, its sustainability, and who is truly worth connecting with. When you shift from passive to strategic networking, you're building a more influential web of resources.",
      quote: "You're not just expanding your contact list—you're building a network of influence."
    },
    {
      palace: "Wealth",
      transformation: "化科",
      description: "You're beginning to realize that being liked is one thing—being paid is the real measure of value. Your skills, personality, and services are starting to receive real market feedback. Whether it's freelancing, launching a business, raising your rates, or building a personal brand—learning to price yourself is a soul-level declaration. The clearer you are about your uniqueness and value, the more the market is willing to pay for it. This isn't just income—it's a full upgrade of your self-worth.",
      quote: "Your value is decided the moment you name your price."
    },
    {
      palace: "Spouse",
      transformation: "化忌",
      description: "You may face a rough patch in close relationships—delays, distance, broken trust, or emotional cycles. This doesn't mean you've loved the wrong person—it means you're being pushed to understand what you *truly* want. You'll need to confront what needs to be released—be it people, emotions, or attachments. Only by learning to love yourself first can you form relationships that are balanced and meaningful. Emotions aren't trials—they're opportunities for growth.",
      quote: "It's not love that broke you—it's life teaching you how to truly love."
    }
  ];

  /**
   * Extracts the Chinese character without the "hua" part
   */
  const getTransformationChar = (transformation: string): string => {
    // Extract the second character (index 1) from the transformation
    return transformation.charAt(1);
  };

  /**
   * Gets the color for a transformation based on its type
   */
  const getTransformationColor = (transformation: string): string => {
    const char = getTransformationChar(transformation);
    switch (char) {
      case "禄": return "text-green-600 dark:text-green-500";
      case "权": return "text-blue-600 dark:text-blue-500"; 
      case "科": return "text-yellow-600 dark:text-yellow-500";
      case "忌": return "text-red-600 dark:text-red-500";
      default: return "text-gray-600 dark:text-gray-500";
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900">

      {/* Divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>

      {/* Title */}
      <h2 className="text-2xl mb-6 dark:text-white text-center italic">
        What Your Four Key Palaces Say About You
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {palaceData.map((item, index) => (
          <Tilt
            key={index}
            options={tiltOptions}
            className="w-full h-full"
          >
            <div 
              className="relative rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 min-h-[300px]"
            >
              {/* Background transformation character */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="flex items-end justify-end h-full">
                  <div className="opacity-[0.08] dark:opacity-[0.05] transform scale-[3] mr-2 mb-2">
                    <span className={`text-6xl font-bold ${getTransformationColor(item.transformation)}`}>
                      {getTransformationChar(item.transformation)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 relative z-10">
                {/* Palace name header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {item.palace}
                  </h3>
                </div>

                {/* Quote with strong emphasis */}
                <blockquote className="text-xl italic font-semibold text-gray-700 dark:text-gray-300 pl-4 py-2 mb-4 text-center relative">
                  <span className="absolute top-0 left-0 text-5xl text-purple-400/30 dark:text-purple-500/20 leading-none font-serif">
                    &ldquo;
                  </span>
                  <span className="relative z-10">
                    {item.quote}
                  </span>
                  <span className="absolute bottom-0 right-4 text-5xl text-purple-400/30 dark:text-purple-500/20 leading-none font-serif">
                    &rdquo;
                  </span>
                </blockquote>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          </Tilt>
        ))}
      </div>
    </div>
  );
};

export default FourKeyPalace;
