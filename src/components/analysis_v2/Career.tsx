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
    { id: "career-1", label: "Rental business" },
    { id: "career-2", label: "Luxury cars" },
    { id: "career-3", label: "Women's products" },
    { id: "career-4", label: "Cosmetics" },
    { id: "career-5", label: "Bedding sales" },
    { id: "career-6", label: "Brand-name sales" },
    { id: "career-7", label: "International trade" },
    { id: "career-8", label: "Media and public relations" },
    { id: "career-9", label: "Marketing and communications" },
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

  return (
    <>
      <div className="p-6 dark:bg-gray-900">
        {/* Divider */}
        <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>

        {/* Title */}
        <h2 className="text-3xl mb-2 dark:text-white text-center font-bold">
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
                    You possess an unparalleled imagination and a unique
                    aesthetic perspective, always able to find the extraordinary
                    in the ordinary. You have a natural sensitivity to art,
                    culture, and creativity, and you&apos;re skilled at
                    transforming inspiration into emotional experiences through
                    color, sound, words, or space. You are a born creator and a
                    pioneer of ideas. Your work is not just an expression, but
                    an awakening; your creativity not only resonates—it helps
                    shape the evolution of aesthetic values in our time.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 italic font-medium">
                    You are the hands that make the world warmer and deeper, and
                    a builder of the human spirit.
                  </p>
                </div>

                {/* Career Options */}
                <div className="mt-6">
                  <h5 className="text-lg font-bold mb-4 dark:text-white">
                    Careers that suit you
                  </h5>
                  <div className="flex flex-wrap">
                    {renderCareerItems(careerOptions)}
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
