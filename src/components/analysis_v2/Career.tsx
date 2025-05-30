import React from "react";
import { Badge } from "flowbite-react";
import { Tilt } from "react-tilt";
import { ChartData } from "../../utils/zwds/types";
import { 
  analyzeCareer, 
  getCareerArchetypeImage, 
  type CareerAnalysisResult 
} from "../../utils/zwds/analysis/careerAnalysis";

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
 * Props for the Career component
 */
type CareerProps = {
  chartData: ChartData;
};

/**
 * Career component displaying career analysis with image and text in a two-column layout
 */
const Career: React.FC<CareerProps> = ({ chartData }) => {
  // Analyze career data
  const careerAnalysis: CareerAnalysisResult = analyzeCareer(chartData);

  // Get user gender from chart input
  const userGender = chartData.input.gender;

  // Get appropriate image path
  const imagePath = getCareerArchetypeImage(careerAnalysis.archetype, userGender);

  // Convert career arrays to CareerItem format
  const idealCareerOptions: CareerItem[] = careerAnalysis.idealCareers.map((career, index) => ({
    id: `ideal-career-${index + 1}`,
    label: career,
  }));

  const nonIdealCareerOptions: CareerItem[] = careerAnalysis.nonIdealCareers.map((career, index) => ({
    id: `non-ideal-career-${index + 1}`,
    label: career,
  }));

  // Tilt options for the image
  const tiltOptions: TiltOptions = {
    scale: 1.05,
    speed: 1000,
    max: 10,
    glare: true,
    "max-glare": 0.5,
  };

  /**
   * Renders ideal career items as styled badges
   */
  const renderIdealCareerItems = (items: CareerItem[]): JSX.Element[] => {
    return items.map((item) => (
      <Badge key={item.id} color="purple" className="mr-2 mb-2">
        {item.label}
      </Badge>
    ));
  };

  /**
   * Renders non-ideal career items as styled badges
   */
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
          Uncover how you&apos;re wired to earn, invest, and build long-term
          financial power.
        </p>
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Image with Tilt Effect */}
          <div className="md:w-[30%] p-4 flex justify-center">
            <Tilt options={tiltOptions} className="w-full h-full">
              <img
                src={imagePath}
                alt={`${careerAnalysis.archetype} Career Archetype`}
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
                  Your {careerAnalysis.archetype} Path
                </h2>

                {/* Description */}
                <div>
                  {careerAnalysis.description.split('\n').map((paragraph, index) => (
                    <p 
                      key={index} 
                      className={`mb-4 text-gray-700 dark:text-gray-300 ${
                        index === careerAnalysis.description.split('\n').length - 1 
                          ? 'italic font-medium' 
                          : ''
                      }`}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ))}
                </div>

                {/* Ideal Career Options */}
                <div className="mt-6">
                  <h5 className="text-lg font-bold mb-4 dark:text-white">
                    Ideal Careers
                  </h5>
                  <div className="flex flex-wrap">
                    {renderIdealCareerItems(idealCareerOptions)}
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
