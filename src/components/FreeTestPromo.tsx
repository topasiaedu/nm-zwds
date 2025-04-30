import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import FREE_TEST_CONFIG from "../config/freeTestConfig";

/**
 * FreeTestPromo component to promote the limited-time free test feature
 * Can be embedded in the home page or other visible areas
 */
const FreeTestPromo: React.FC = () => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  
  /**
   * Check if the free test event is still active and calculate days remaining
   */
  useEffect(() => {
    const checkEventStatus = () => {
      // If feature is disabled via config, hide the promo
      if (!FREE_TEST_CONFIG.isEnabled) {
        setIsActive(false);
        return;
      }
      
      // Check if current date is after the configured end date
      const today = new Date();
      const endDate = new Date(`${FREE_TEST_CONFIG.endDate}T23:59:59`);
      
      // Calculate days left
      const timeDiff = endDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      setDaysLeft(daysRemaining > 0 ? daysRemaining : 0);
      setIsActive(today <= endDate);
    };
    
    checkEventStatus();
    
    // Update days left daily
    const intervalId = setInterval(checkEventStatus, 86400000); // 24 hours
    
    return () => clearInterval(intervalId);
  }, []);
  
  // If the promotion isn't active, don't render anything
  if (!isActive) {
    return null;
  }
  
  // Format the days left text
  const daysLeftText = t("freeTestPromo.daysLeft").replace("{{days}}", daysLeft.toString());
  
  // WhatsApp link
  const whatsappLink = "https://wa.me/601158639269";
  
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl overflow-hidden">
      <div className="relative p-6 md:p-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M47.5,-73.2C59.2,-64.2,65.1,-47.5,70.2,-31.3C75.3,-15.1,79.5,0.5,76.9,14.9C74.3,29.3,64.8,42.4,52.7,52.6C40.6,62.8,25.8,70,9.2,75.5C-7.5,81,-25.8,84.8,-39.6,78.7C-53.4,72.6,-62.6,56.7,-70.6,40.4C-78.6,24.2,-85.3,7.6,-83.1,-7.6C-80.9,-22.8,-69.7,-36.6,-57.1,-46.3C-44.5,-56,-30.5,-61.5,-16.4,-69.3C-2.3,-77.1,11.9,-87.2,27.6,-86.6C43.3,-86.1,60.5,-75,76.1,-60.4C91.7,-45.9,105.7,-27.9,101.7,-12.7C97.7,2.5,75.8,15,66.2,37.3C56.7,59.6,59.5,91.9,49.9,103.8C40.3,115.6,18.1,107,2.8,102.5C-12.6,98,-20.8,97.6,-32.5,94.3C-44.2,91,-59.5,84.8,-66.9,73.6C-74.4,62.4,-73.9,46.3,-77.7,31.8C-81.5,17.3,-89.6,4.3,-87.3,-7.2C-85,-18.6,-72.3,-28.5,-61.6,-38.9C-50.9,-49.3,-42.3,-60.2,-31.4,-70.3C-20.5,-80.4,-7.4,-89.8,5.7,-99.5C18.8,-109.3,37.5,-119.5,47.1,-113.8C56.7,-108,57.1,-86.4,47.5,-73.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              {t("freeTestPromo.limitedOffer")}
            </span>
            <span className="bg-white text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              {daysLeftText}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t("freeTestPromo.title")}
          </h2>
          
          <p className="text-indigo-100 mb-6 max-w-2xl">
            {t("freeTestPromo.description")}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/free-test"
              className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              {t("freeTestPromo.tryNow")}
            </Link>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              {t("freeTestPromo.createAccount")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTestPromo; 