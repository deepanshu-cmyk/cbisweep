import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [isOpen, setIsOpen] = useState(false);
    const [consentPreferences, setConsentPreferences] = useState({
        necessary: true, // Always active
        analytics: false,
        marketing: false,
        functional: false
    });

    // Load saved preferences on mount
    useEffect(() => {
        const savedConsent = localStorage.getItem('cookieConsent');
        if (savedConsent) {
            setConsentPreferences(JSON.parse(savedConsent));
        }
    }, []);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleConfirm = () => {
        // Save preferences to localStorage
        localStorage.setItem('cookieConsent', JSON.stringify(consentPreferences));
        setIsOpen(false);

        // Dispatch event for other components to react to consent changes
        const event = new CustomEvent('cookieConsentUpdated', {
            detail: consentPreferences
        });
        window.dispatchEvent(event);

        // Show confirmation message (optional)
        console.log('Cookie preferences saved:', consentPreferences);
    };

    const handleToggle = (type) => {
        if (type === 'necessary') return; // Cannot toggle necessary cookies
        setConsentPreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.cookie-modal-content')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            {/* Floating Button */}
            <div
                className="fixed bottom-4 right-4 z-50 cursor-pointer"
                onClick={toggleModal}
                title="Do Not Sell or Share My Personal Information"
            >
                <div className="relative w-12 h-12">
                    {/* Front of button - Visible by default */}
                    <div className="absolute inset-0 bg-[#292B2E] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                        <button
                            type="button"
                            className="w-6 h-6"
                            aria-label="Do Not Sell or Share My Personal Information"
                        >
                            {/* Cookie/Privacy icon */}
                            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="cookie-modal-content bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Cookie & Privacy Preferences
                                    </h2>
                                    <div className="flex items-center text-sm text-green-600 mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Global Privacy Controls are enabled on this site
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Adjustments to your preferences on this site will only apply to this brand site.
                                        Constellation Brands, Inc. owns and operates several other brands, and your
                                        preferences saved for this site will not apply to other brand sites.
                                    </p>
                                </div>
                                <button
                                    onClick={toggleModal}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Description */}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    We do not sell your personal information to third parties for monetary consideration.
                                    However, the third-party cookies and applications used on this site may collect your
                                    personal information for advertising purposes. This activity may be considered a
                                    sale/sharing under applicable laws. The button below allows you to set your preferences
                                    for cookies used on this site. To delete or limit the sale/sharing of your information
                                    that Constellation Brands, Inc. may have collected through other brand sites or other
                                    customer interactions with you, or to exercise any other privacy rights applicable to
                                    you, please submit a data subject access request.
                                </p>
                            </div>
                        </div>

                        {/* Cookie Categories */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Manage Consent Preferences
                            </h3>

                            {/* Strictly Necessary Cookies - Always Active */}
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-green-600 font-medium mr-2">+</span>
                                            <h4 className="font-medium text-gray-900">
                                                Strictly Necessary Cookies
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            These cookies are essential for the website to function and cannot be switched off.
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-600 text-sm font-medium mr-2">Always Active</span>
                                        <div className="relative">
                                            <div className="w-12 h-6 bg-green-500 rounded-full opacity-50"></div>
                                            <div className="absolute top-0 left-0 w-6 h-6 bg-white border border-gray-300 rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Analytics Cookies
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Allow us to analyze site usage and improve performance.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('analytics')}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${consentPreferences.analytics ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${consentPreferences.analytics ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Marketing Cookies
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Used to track visitors across websites for targeted advertising.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('marketing')}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${consentPreferences.marketing ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${consentPreferences.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Functional Cookies */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            Functional Cookies
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Enable enhanced functionality and personalization.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('functional')}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${consentPreferences.functional ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${consentPreferences.functional ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={handleConfirm}
                                    className="bg-[#011e5b] hover:bg-[#002f8c] text-white font-medium py-3 px-8 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#011e5b] focus:ring-offset-2"
                                >
                                    Confirm My Choices
                                </button>
                            </div>

                            {/* Powered by Onetrust */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center">
                                    <span className="text-sm text-gray-500 mr-2">Powered by</span>
                                    <span className="font-bold text-gray-700">Onetrust</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}