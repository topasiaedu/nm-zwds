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
      description:
        "You're entering a transformative phase where space defines energy—a time when your environment is no longer just a backdrop, but an active participant in your journey. It's not simply about passing through rooms or neighborhoods anymore; it's about consciously choosing, shaping, and grounding yourself in a place that truly reflects who you are and what you need to thrive. This could manifest in buying a home, redecorating your current space, or seeking a deeper spiritual connection to your surroundings. \n\nYour environment now holds weight—it influences your clarity, your decision-making, and even your luck. The way you arrange your space becomes a mirror for how you organize your mind and your priorities. This isn't just about aesthetics; it's about alignment. The placement of objects, the colors on your walls, and the energy flow within your rooms begin to form a kind of personal sanctuary, subtly reinforcing your goals and values. \n\nThis is the beginning of actively shaping your personal energy field. As you put intention into your surroundings, you're anchoring yourself into a more stable version of your life—one that supports growth, vision, and purpose. When your space is aligned, your actions flow more smoothly, and that inner sense of order becomes a reliable foundation for everything you do going forward.",   
      quote:
        "When the home is settled, your wealth finally has a place to land.",
    },
    {
      palace: "Friends",
      transformation: "化权",
      description:
        "You're no longer content with merely fitting in or being part of the crowd—you’re stepping into a space where leadership calls. This is a turning point, marking your transition from being a participant in systems to becoming someone who shapes and directs them. It’s not just about visibility anymore; it’s about vision. You’re beginning to crave intentionality, seeking not only to be included but to influence outcomes through well-structured strategies and sustainable systems. \n\nExposure is no longer enough. Now, you're driven by a need for efficiency, discernment, and long-term value. You’re learning to assess your network not by size, but by substance—who brings depth, who reciprocates, and who aligns with your goals. It's less about collecting contacts and more about cultivating meaningful, reciprocal relationships that elevate everyone involved. \n\nAs you shift from passive involvement to strategic action, you begin to curate a network that works with you, not just around you. Every connection becomes part of a broader ecosystem of influence, one that reflects your evolving standards, goals, and sense of purpose. In doing so, you're no longer just navigating resources—you’re managing and integrating them with clarity and leadership. This is how a truly impactful web of support and collaboration begins to form.",
      quote:
        "You're not just expanding your contact list—you're building a network of influence.",
    },
    {
      palace: "Wealth",
      transformation: "化科",
      description:
        "You're beginning to understand a powerful truth: being liked is pleasant, but being paid is transformative. Approval can be flattering, but compensation is where validation meets reality. This phase of your journey is about translating your talents, personality, and effort into tangible value. It’s no longer enough to be appreciated—you’re seeking acknowledgment in the form of real, measurable outcomes. \n\nWhether you're freelancing, launching a business, raising your rates, or building a personal brand, you're entering a space where your skills are meeting the market—and the market is speaking back. This feedback loop is eye-opening. It shows you what people truly value and, more importantly, what you should value in yourself. Learning to price your offerings isn’t just a financial decision; it’s a soul-level statement about what you believe you’re worth. \n\nThis moment demands clarity: clarity in what you offer, in who you serve, and in the unique value you bring to the table. The more you refine your sense of identity and skill, the more others are willing to invest. You’re no longer shrinking to fit someone else’s budget—you’re expanding to match your true potential. And when you begin earning based on who you really are, it shifts everything. \n\nThis isn’t just income. It’s self-respect in action. It’s a personal upgrade that touches every area of life—confidence, boundaries, ambition, and direction. You're not just making money; you're rewriting your story about worth.",
      quote: "Your value is decided the moment you name your price.",
    },
    {
      palace: "Spouse",
      transformation: "化忌",
      description:
        "You may find yourself moving through a rough patch in your closest relationships—a time marked by emotional distance, unmet expectations, delayed progress, or cycles that keep repeating. It can feel disorienting, even painful. But this isn’t necessarily a sign that you’ve loved the wrong person or made the wrong choices. Instead, it’s a sign that life is urging you to pause and reflect more deeply on what you truly want from connection. \n\nThese moments of tension or heartbreak aren’t punishments—they're catalysts. They’re here to help you clarify your emotional needs, boundaries, and definitions of love. The discomfort is real, but so is the opportunity it brings. You're being called to confront what no longer serves you—whether it’s outdated attachments, unspoken expectations, or relationships that ask you to abandon yourself in order to keep the peace. \n\nThis is a time for courageous release. Sometimes it’s people. Sometimes it’s past versions of yourself. And sometimes, it's the stories you've told yourself about what love should look like. Letting go isn’t about giving up—it’s about making space for something more aligned and more nourishing. \n\nUltimately, the lesson is this: no relationship will ever feel whole unless it’s built upon a foundation of self-love. When you know your worth, you stop settling for emotional crumbs. You begin to form bonds that are balanced, reciprocal, and deeply rooted in respect. Your emotions, even the hard ones, aren’t here to derail you—they’re guiding you back to yourself. Growth often wears the disguise of grief, but on the other side is clarity, freedom, and a deeper kind of connection.",
      quote:
        "It&apos;s not love that broke you—it&apos;s life teaching you how to truly love.",
    },
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
      case "禄":
        return "text-green-600 dark:text-green-500";
      case "权":
        return "text-blue-600 dark:text-blue-500";
      case "科":
        return "text-yellow-600 dark:text-yellow-500";
      case "忌":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-gray-600 dark:text-gray-500";
    }
  };

  /**
   * Gets the border highlight color for a transformation
   */
  const getHighlightColor = (transformation: string): string => {
    const char = getTransformationChar(transformation);
    switch (char) {
      case "禄":
        return "border-green-200 dark:border-green-900 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20";
      case "权":
        return "border-blue-200 dark:border-blue-900 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20";
      case "科":
        return "border-yellow-200 dark:border-yellow-900 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-950/20";
      case "忌":
        return "border-red-200 dark:border-red-900 bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-950/20";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>

      {/* Title */}
      <h2 className="text-4xl mb-2 dark:text-white text-center font-bold">
      DESTINY ALERT MAP
      </h2>

      {/* Subtitle */}
      <p className="text-lg mb-6 dark:text-white text-center italic">
        Where your life force is thriving — and where it&apos;s sending
        warning signals.
      </p>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {palaceData.map((item, index) => (
          <Tilt key={index} options={tiltOptions} className="w-full h-full">
            <div
              className={`relative rounded-lg shadow-md overflow-hidden border-2 ${getHighlightColor(
                item.transformation
              )} min-h-[300px]`}>
              {/* Background transformation character */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="flex items-end justify-end h-full">
                  <div className="opacity-[0.08] dark:opacity-[0.05] transform scale-[3] mr-2 mb-2">
                    <span
                      className={`text-6xl font-bold ${getTransformationColor(
                        item.transformation
                      )}`}>
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
                  <span className="relative z-10">{item.quote}</span>
                  <span className="absolute bottom-0 right-4 text-5xl text-purple-400/30 dark:text-purple-500/20 leading-none font-serif">
                    &rdquo;
                  </span>
                </blockquote>

                {/* Description with fixed height and hidden scrollbar */}
                <div 
                  className="text-gray-600 dark:text-gray-400 text-sm description-container h-48 overflow-y-auto">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </Tilt>
        ))}
      </div>

      {/* Add CSS to hide scrollbars for different browsers */}
      <style dangerouslySetInnerHTML={{ __html: `
        .description-container::-webkit-scrollbar {
          display: none;
        }
        .description-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default FourKeyPalace;
