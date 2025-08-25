import React from "react";
import { Card, Button } from "flowbite-react";
import { useLanguage } from "../context/LanguageContext";
import PageTransition from "../components/PageTransition";

/**
 * Membership Expired page component
 * Displays when user's membership has expired and needs to contact support
 */
const MembershipExpired: React.FC = () => {
  const { t } = useLanguage();

  /**
   * Open WhatsApp chat with Jessica
   */
  const contactSupport = (): void => {
    const phoneNumber = "601158639269"; // +60 11-5863 9269
    const message = encodeURIComponent(
      "Hello Jessica, my membership has expired and I would like to renew it. Please help me with the renewal process."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  /**
   * Copy phone number to clipboard
   */
  const copyPhoneNumber = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText("+60 11-5863 9269");
      // You could add a toast notification here if desired
    } catch (error) {
      console.error("Failed to copy phone number:", error);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl relative z-10 rounded-2xl shadow-2xl 
                       border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       transition-all duration-300">
          <div className="text-center space-y-6 p-8">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Membership Expired
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Your membership has expired and you no longer have access to premium features.
              </p>
            </div>

            {/* Content */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-left">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What happens now?
              </h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Access to premium features is suspended
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Your account and data remain safe
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Contact support to renew your membership
                </li>
              </ul>
            </div>

            {/* Contact Support Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Support to Renew
              </h2>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Contact Jessica on WhatsApp:
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588z"/>
                    </svg>
                    <span>+60 11-5863 9269</span>
                    <button
                      onClick={copyPhoneNumber}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Copy phone number"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                                 <div className="flex justify-center space-x-4">
                   <button
                     onClick={contactSupport}
                     className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                   >
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.588z"/>
                     </svg>
                     <span>Contact Jessica on WhatsApp</span>
                   </button>
                 </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Jessica will help you renew your membership quickly and easily.
                </p>
              </div>
            </div>

            {/* Sign Out Option */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                If you&apos;re not ready to renew, you can sign out for now.
              </p>
                             <button
                 onClick={() => window.location.href = "/authentication/sign-in"}
                 className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default MembershipExpired;
