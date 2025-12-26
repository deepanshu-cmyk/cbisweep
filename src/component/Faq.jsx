import React, { useState } from 'react'
import logoImage from '../assets/logo-constellation-brands.svg';
import lowerImage from '../assets/img-hero-1-scaled.webp';
import logoOptivate from '../assets/logo-optivate.webp';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqItems } from '../constants';

// API endpoint constant
const API_ENDPOINT = 'https://0gt6s4bqo5.execute-api.us-east-1.amazonaws.com/prod/create-support-request';

export default function Faq() {
    const [openQuestion, setOpenQuestion] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        question: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Start submission
        setIsSubmitting(true);

        try {
            // Prepare API data
            const apiData = {
                email: formData.email,
                name: formData.name,
                question: formData.question,
                origin: {
                    source: 'website',
                    page: window.location.pathname,
                    utm_campaign: 'faq_support_form'
                }
            };

            console.log("Submitting to API:", apiData);

            // Submit to API
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("API Response:", responseData);

            // Clear the form
            setFormData({
                name: '',
                email: '',
                question: ''
            });

            // Show success message
            setIsSubmitted(true);
            setIsSubmitting(false);

            // Hide success message after 5 seconds
            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);

        } catch (error) {
            console.error('Submission error:', error);
            setIsSubmitting(false);
            alert("There was an error submitting your question. Please try again.");
        }
    };

    return (
        <div className="min-h-screen">
            {/* Top color section with centered logo */}
            <div className="h-20 bg-[#011e5b] flex justify-center items-center">
                <img
                    src={logoImage}
                    alt="Constellation Brands"
                    className="h-12 w-auto"
                />
            </div>

            {/* Lower image section - REMOVED max-w-7xl for full width */}
            <div className="flex justify-center items-center">
                <img
                    src={lowerImage}
                    alt="Promotions"
                    className="w-full h-auto"
                />
            </div>

            {/* FAQ Section - UPDATED to remove max-w-7xl for full width background */}
            <div className="bg-[#0079CF1A] px-28 py-12">
                {/* Main Title - ADDED max-w-7xl mx-auto to only center the content */}
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#011e5b]">
                        FREQUENTLY ASKED QUESTIONS
                    </h1>

                    {/* Two Column Layout */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Left Column - Contact Form */}
                        <div className="lg:w-1/2">
                            <div className="bg-transparent p-6 md:p-8 rounded-lg">
                                <h2 className="text-2xl font-bold text-[#011e5b] mb-6">
                                    HAVE ANOTHER QUESTION?
                                </h2>
                                <p className="text-[#205493] mb-8">
                                    Please ask a here and we'll be in touch soon.
                                </p>

                                {/* Success Message */}
                                {isSubmitted && (
                                    <div style={{
                                        backgroundColor: '#d4edda',
                                        border: '1px solid #c3e6cb',
                                        borderRadius: '4px',
                                        padding: '1rem',
                                        marginBottom: '1.5rem',
                                        color: '#155724'
                                    }}>
                                        Thank you for your question! We'll be in touch soon.
                                    </div>
                                )}

                                {/* Contact Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#205493] mb-2">
                                            Name <span className="text-red-500 mr-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011e5b] focus:border-transparent bg-white"
                                            placeholder=""
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#205493] mb-2">
                                            Email <span className="text-red-500 mr-1">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011e5b] focus:border-transparent bg-white"
                                            placeholder=""
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#205493] mb-2">
                                            Question <span className="text-red-500 mr-1">*</span>
                                        </label>
                                        <textarea
                                            name="question"
                                            value={formData.question}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011e5b] focus:border-transparent min-h-[120px] bg-white"
                                            placeholder=""
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Send Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full bg-[#004a80] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#002f8c] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#011e5b] focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? 'SENDING...' : 'SEND'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column - FAQ Questions with Dropdowns */}
                        <div className="lg:w-1/2 mt-10">
                            <div className="space-y-6">
                                {faqItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-white  rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleQuestion(item.id)}
                                            className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-color cursor-pointer"
                                        >
                                            <span className="text-lg font-bold text-[#011e5b] text-left">
                                                {item.question}
                                            </span>
                                            <span className="text-[#011e5b] ml-4 flex-shrink-0">
                                                {openQuestion === item.id ? (
                                                    <ChevronUp size={20} />
                                                ) : (
                                                    <ChevronDown size={20} />
                                                )}
                                            </span>
                                        </button>

                                        {openQuestion === item.id && (
                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                                <p className="text-[#001e5b]">
                                                    {item.answer || "Answer will appear here..."}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#011e5b] text-white py-10">
                <div className='px-4'>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            {/* Constellation Brands Logo */}
                            <div className="h-20 flex justify-center items-center mb-6">
                                <img
                                    src={logoImage}
                                    alt="Constellation Brands"
                                    className="h-12 w-auto"
                                />
                            </div>

                            {/* Legal Links */}
                            <div className="mb-6">
                                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
                                    <a
                                        className="text-[#ffb500] hover:text-[#ffb500] text-sm transition-colors"
                                        href="https://www.cbrands.com/pages/terms"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="Terms and Conditions Link"
                                        aria-label="Terms and Conditions Link"
                                    >
                                        Terms and Conditions
                                    </a>
                                    <a
                                        className="text-[#ffb500] hover:text-[#ffb500] text-sm transition-colors cursor-pointer"
                                        onClick={() => {
                                            console.log("Toggle OneTrust display");
                                        }}
                                    >
                                        Do Not Sell/Do Not Share My Personal Information
                                    </a>
                                    <a
                                        className="text-[#ffb500] hover:text-[#ffb500] text-sm transition-colors"
                                        href="https://www.cbrands.com/pages/privacy-notice"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="Privacy Policy Link"
                                        aria-label="Privacy Policy Link"
                                    >
                                        Privacy Notice
                                    </a>
                                    <a
                                        className="text-[#ffb500] hover:text-[#ffb500] text-sm transition-colors"
                                        href="/faq"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="FAQ Link"
                                        aria-label="FAQ Link"
                                    >
                                        FAQs
                                    </a>
                                </div>

                                {/* Drink Responsibly */}
                                <p className="text-sm mb-2">Drink responsibly. Corona Premier® Beer. Imported by Crown Imports, Chicago, IL</p>

                                {/* Copyright */}
                                <p className="text-sm mb-8">© 2025 Constellation Brands, All Rights Reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="w-full h-full bg-[#272727]">
                <div className="h-10 flex justify-center items-center">
                    <p className="text-sm mr-2 text-white">In Partnership with</p>
                    <img
                        src={logoOptivate}
                        alt="Optivate"
                        className="h-4 w-auto"
                    />
                </div>
            </div>
        </div>
    )
}