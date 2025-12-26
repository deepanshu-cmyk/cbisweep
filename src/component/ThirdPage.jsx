import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Calendar, Mail, Phone, MapPin, Upload } from 'lucide-react';
import logoOptivate from '../assets/logo-optivate.webp';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { officialRules } from '../constants';

const API_ENDPOINT = 'https://0gt6s4bqo5.execute-api.us-east-1.amazonaws.com/prod/create-user-entry-prod';

export default function ThirdPage() {
    const location = useLocation();
    const promotion = location.state?.promotion;
    const [showRules, setShowRules] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [apiError, setApiError] = useState(null);

    const isPacifico = promotion?.brandLogo && promotion.brandLogo.includes('pacifico');
    const isModelo = promotion?.brandLogo && (
        promotion.brandLogo.includes('modelo') ||
        promotion.brand === 'modelo' ||
        promotion.brandLogo.includes('modelo-especial')
    );

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        setError,
        clearErrors
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            yearBorn: '',
            state: '',
            email: '',
            phone: '',
            file: null,
            acceptRules: false,
            acceptPrivacy: false
        }
    });

    // Watch checkbox values for submit button disabled state
    const watchAcceptRules = watch('acceptRules');
    const watchAcceptPrivacy = watch('acceptPrivacy');
    const watchPhone = watch('phone');

    // Format phone number to (XXX) XXX-XXXX
    const formatPhoneNumber = (value) => {
        const phoneNumber = value.replace(/\D/g, '');
        const phoneNumberDigits = phoneNumber.slice(0, 10);

        if (phoneNumberDigits.length === 0) {
            return '';
        } else if (phoneNumberDigits.length <= 3) {
            return `(${phoneNumberDigits}`;
        } else if (phoneNumberDigits.length <= 6) {
            return `(${phoneNumberDigits.slice(0, 3)}) ${phoneNumberDigits.slice(3)}`;
        } else {
            return `(${phoneNumberDigits.slice(0, 3)}) ${phoneNumberDigits.slice(3, 6)}-${phoneNumberDigits.slice(6)}`;
        }
    };

    // Handle phone number formatting on input
    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setValue('phone', formatted);

        // Clear error if exists
        if (errors.phone) {
            clearErrors('phone');
        }

        // Trigger validation
        if (formatted.replace(/\D/g, '').length === 10) {
            clearErrors('phone');
        }
    };

    // Calculate age from year born
    const calculateAge = (yearBorn) => {
        const currentYear = new Date().getFullYear();
        return currentYear - parseInt(yearBorn);
    };

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Function to get beer name with registered trademark symbol
    const getBeerName = () => {
        if (!promotion) return "Corona Premier®";
        if (promotion.register) {
            return promotion.register.includes("®") ? promotion.register : promotion.register + "®";
        }
        if (isModelo) return "Modelo Especial®";
        if (isPacifico) return "Pacifico Clara®";
        return "Corona Premier®";
    };

    const states = [
        'Select State',
        'California', 'New York', 'Texas', 'Florida', 'Illinois',
        'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
    ];

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError('file', {
                    type: 'manual',
                    message: 'File size must be less than 5MB'
                });
                return;
            }

            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setError('file', {
                    type: 'manual',
                    message: 'File must be PDF, JPG, or PNG'
                });
                return;
            }

            setFileName(file.name);
            setValue('file', file);
            clearErrors('file');
        }
    };

    // Submit to API
    const submitToAPI = async (data) => {
        try {
            // Prepare data in the expected API format
            const apiData = {
                email: data.email,
                promotion: {
                    campaign_id: `PROMO_${promotion?.id || 'DEFAULT'}`,
                    source: 'website',
                    medium: 'form_entry',
                    title: promotion?.title || 'Premier Serve 2026 Sweepstakes'
                },
                user_data: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    age: calculateAge(data.yearBorn),
                    country: 'US',
                    state: data.state,
                    phone: data.phone.replace(/\D/g, ''),
                    year_born: data.yearBorn
                },
                agreements: {
                    terms_and_conditions: data.acceptRules,
                    privacy_policy: data.acceptPrivacy,
                    marketing_emails: false,
                    official_rules_text: 'Click here to indicate that you have read the official rules.',
                    privacy_consent_text: 'By clicking "submit", I have read and agree to Corona\'s Privacy Notice and Website User Agreement and consent to Corona\'s and other Constellation Brands brands\' use of my personal information for marketing and analytics purposes, including receiving targeted advertising, marketing and promotional communications and conversion of my email address into identifiers used for advertising purposes.'
                },
                origin: {
                    ip: '127.0.0.1', // In production, get from backend
                    user_agent: navigator.userAgent,
                    page: window.location.pathname,
                    referrer: document.referrer || 'Direct visit',
                    timestamp: new Date().toISOString()
                },
                file_info: data.file ? {
                    name: data.file.name,
                    size: data.file.size,
                    type: data.file.type
                } : null
            };

            console.log('Sending to API:', apiData);

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log('API Response:', responseData);

            return responseData;
        } catch (error) {
            console.error('API submission error:', error);
            throw error;
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setApiError(null);
        setApiResponse(null);

        try {
            // Additional phone validation
            const phoneDigits = data.phone.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                setError('phone', {
                    type: 'manual',
                    message: 'Please enter a valid 10-digit phone number'
                });
                setIsSubmitting(false);
                return;
            }

            // Submit to API
            const apiResult = await submitToAPI(data);
            setApiResponse(apiResult);

            // Store submission in localStorage for backup
            localStorage.setItem('lastSubmission', JSON.stringify({
                formData: data,
                apiResponse: apiResult,
                submittedAt: new Date().toISOString(),
                promotion: promotion
            }));

            // Show success and reset form
            setIsSubmitting(false);
            setIsSubmitted(true);
            reset();
            setFileName('');

        } catch (error) {
            console.error('Submission error:', error);
            setApiError(error.message || 'There was an error submitting your entry. Please try again.');
            setIsSubmitting(false);

            // Store failed submission locally
            localStorage.setItem('failedSubmission', JSON.stringify({
                formData: data,
                error: error.message,
                timestamp: new Date().toISOString(),
                promotion: promotion
            }));
        }
    };

    // Custom validation for phone number
    const validatePhone = (value) => {
        const phoneDigits = value.replace(/\D/g, '');
        if (!phoneDigits) return 'Phone number is required';
        if (phoneDigits.length !== 10) return 'Please enter a valid 10-digit phone number';
        return true;
    };

    // If no promotion data is passed, show a fallback
    if (!promotion) {
        return (
            <div className="min-h-screen bg-[#011e5b] py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Promotion Not Found</h1>
                    <p className="text-gray-600 mb-8">The promotion you're looking for doesn't exist or the link is invalid.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#0079cf] text-white font-medium rounded-lg hover:bg-[#004a80] transition-colors"
                    >
                        Back to Promotions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fff8e6] from-gray-50 to-gray-100">
            {/* Header with back button */}
            <div className={`${isPacifico ? 'bg-[#ffdd00]' : 'bg-[#002856]'} shadow-sm h-38`}>
                <div className="max-w-7xl mx-auto px-4 py-4 h-30 pt-6">
                    <div className="h-22 flex justify-center items-center">
                        <img
                            src={promotion.brandLogo}
                            alt={promotion.title}
                            className="h-12 w-auto"
                            style={{ width: 200, height: 100 }}
                        />
                    </div>
                </div>
            </div>

            {/* Orange Line */}
            <div className={`w-full h-2 ${isPacifico ? 'bg-black' : 'bg-[#ffb500]'}`}></div>

            {/* Main Content */}
            <h1 className="text-[22px] sm:text-[24px] md:text-[32px] lg:text-[40px] font-extrabold text-center text-[#011e5b] mb-0 pt-8 md:pt-12 lg:pt-18">
                {promotion.title}
            </h1>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-24 py-8">
                <div className="grid lg:grid-cols-2">
                    {/* Left Column - Promotion Image */}
                    <div className="space-y-8">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={promotion.image}
                                alt={promotion.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="text-center text-black text-sm">
                            <p className="mb-2">Photos may vary from pictures shown.</p>
                            <p>Subject to additional restrictions.</p>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div>
                        <div className="bg-transparent rounded-xl p-8 sticky top-8">
                            {isSubmitted ? (
                                // Confirmation View
                                <div className="submission-confirmation">
                                    <div className="confirmation-message-box bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                                        <h3 className="text-xl font-bold text-green-800 mb-2">Submission Successful!</h3>
                                        <p className="text-green-700">
                                            You have officially entered. Good Luck! For frequently asked questions please visit the{' '}
                                            <Link to="/faq" className="text-[#0063aa] hover:text-[#004a80] underline font-medium">
                                                F.A.Q here
                                            </Link>.
                                        </p>
                                        {apiResponse && (
                                            <div className="mt-4 p-3 bg-green-100 rounded-md">
                                                <p className="text-green-800 text-sm">
                                                    <strong>Reference ID:</strong> {apiResponse.referenceId || apiResponse.id || 'N/A'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsSubmitted(false);
                                            setApiResponse(null);
                                        }}
                                        className="w-full bg-[#011e5b] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#003080] transition-colors"
                                    >
                                        Submit Another Entry
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-[#011e5b] mb-2">ENTER HERE</h1>
                                        {apiError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                                <p className="text-red-700 text-sm">{apiError}</p>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        {/* Personal Information Section */}
                                        <div className="mb-8">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[#011e5b] mb-2">
                                                        First Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('firstName', {
                                                            required: 'First name is required',
                                                            minLength: {
                                                                value: 2,
                                                                message: 'First name must be at least 2 characters'
                                                            }
                                                        })}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white ${errors.firstName ? 'border-red-500' : 'border-black'}`}
                                                    />
                                                    {errors.firstName && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-[#011e5b] mb-2">
                                                        Last Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('lastName', {
                                                            required: 'Last name is required',
                                                            minLength: {
                                                                value: 2,
                                                                message: 'Last name must be at least 2 characters'
                                                            }
                                                        })}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white ${errors.lastName ? 'border-red-500' : 'border-black'}`}
                                                    />
                                                    {errors.lastName && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-[#011e5b] mb-2">
                                                        Year Born <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('yearBorn', {
                                                            required: 'Year born is required',
                                                            min: {
                                                                value: 1900,
                                                                message: 'Year must be after 1900'
                                                            },
                                                            max: {
                                                                value: new Date().getFullYear() - 21,
                                                                message: 'You must be at least 21 years old'
                                                            }
                                                        })}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white ${errors.yearBorn ? 'border-red-500' : 'border-black'}`}
                                                    />
                                                    {errors.yearBorn && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.yearBorn.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-[#011e5b] mb-2">
                                                        State <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            {...register('state', {
                                                                required: 'State is required'
                                                            })}
                                                            className={`w-full px-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none appearance-none bg-white ${errors.state ? 'border-red-500' : 'border-black'}`}
                                                        >
                                                            {states.map((state, index) => (
                                                                <option key={index} value={index === 0 ? '' : state}>
                                                                    {state}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    {errors.state && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information Section */}
                                        <div className="mb-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-[#011e5b] mb-2">
                                                        Email <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                        <input
                                                            type="email"
                                                            {...register('email', {
                                                                required: 'Email is required',
                                                                pattern: {
                                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                    message: 'Please enter a valid email address'
                                                                }
                                                            })}
                                                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white ${errors.email ? 'border-red-500' : 'border-black'}`}
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-[#011e5b] mb-2">
                                                        Phone <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                        <input
                                                            type="tel"
                                                            {...register('phone', {
                                                                required: 'Phone number is required',
                                                                validate: validatePhone
                                                            })}
                                                            onChange={handlePhoneChange}
                                                            value={watchPhone || ''}
                                                            placeholder="(555) 555-5555"
                                                            maxLength="14"
                                                            className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white ${errors.phone ? 'border-red-500' : 'border-black'}`}
                                                        />
                                                    </div>
                                                    {errors.phone && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                                    )}
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        Format: (XXX) XXX-XXXX
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* File Upload Section */}
                                        <div className="mb-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-[#011e5b] mb-2">
                                                        Upload File <span className="text-gray-500 text-sm">(PDF, JPG, PNG up to 5MB)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id="file-upload"
                                                            onChange={handleFileChange}
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor="file-upload"
                                                            className={`w-full flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-black hover:bg-orange-50'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Upload className="text-gray-500" size={20} />
                                                                <div className="text-center">
                                                                    <span className="text-gray-700 font-medium">
                                                                        {fileName ? 'File Selected' : 'Choose a file'}
                                                                    </span>
                                                                    <p className="text-gray-500 text-sm">
                                                                        {fileName || 'or drag and drop here'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </label>
                                                        {fileName && (
                                                            <div className="mt-2 flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <span className="text-sm text-gray-700 truncate max-w-[200px]">{fileName}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFileName('');
                                                                        setValue('file', null);
                                                                        clearErrors('file');
                                                                        document.getElementById('file-upload').value = '';
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {errors.file && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
                                                    )}
                                                    <p className="text-gray-500 text-xs mt-2">
                                                        Supported formats: PDF, JPG, PNG. Maximum file size: 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Checkboxes */}
                                        <div className="space-y-4 mb-8">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    {...register('acceptRules', {
                                                        required: 'You must accept the official rules'
                                                    })}
                                                    className="mt-1 h-5 w-5 text-orange-500 border-black rounded focus:ring-orange-500"
                                                />
                                                <span className="text-black text-sm">
                                                    Click here to indicate that you have read the{' '}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            document.getElementById('official-rules-section')?.scrollIntoView({ behavior: 'smooth' });
                                                            setShowRules(true);
                                                        }}
                                                        className="text-[#0063aa] hover:text-[#004a80] underline font-medium"
                                                    >
                                                        official rules
                                                    </button>
                                                    .*
                                                </span>
                                            </label>
                                            {errors.acceptRules && (
                                                <p className="text-red-500 text-sm">{errors.acceptRules.message}</p>
                                            )}

                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    {...register('acceptPrivacy', {
                                                        required: 'You must accept the privacy policy'
                                                    })}
                                                    className="mt-1 h-5 w-5 text-orange-500 border-black rounded focus:ring-orange-500"
                                                />
                                                <span className="text-black text-sm">
                                                    By clicking "submit", I have read and agree to Corona's Privacy Notice and Website User Agreement and consent to Corona's and other Constellation Brands brands' use of my personal information for marketing and analytics purposes, including receiving targeted advertising, marketing and promotional communications and conversion of my email address into identifiers used for advertising purposes.*
                                                </span>
                                            </label>
                                            {errors.acceptPrivacy && (
                                                <p className="text-red-500 text-sm">{errors.acceptPrivacy.message}</p>
                                            )}
                                        </div>

                                        {/* Required Info Note */}
                                        <div className="text-center mb-6">
                                            <p className="text-gray-600 font-medium inline-flex items-center">
                                                <span className="text-red-500 mr-1">*</span>
                                                Required Information
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !watchAcceptRules || !watchAcceptPrivacy}
                                            className={`w-full bg-[#ffb500] text-black text-[16px] font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 ${isSubmitting || !watchAcceptRules || !watchAcceptPrivacy
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:-translate-y-1'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    SUBMITTING...
                                                </span>
                                            ) : 'SUBMIT'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* OFFICIAL RULES Button with Down Arrow */}
                <div className="w-full flex justify-center items-center px-4">
                    <div className="mt-20 mb-20 text-center w-full max-w-md h-16 bg-[#011e5b] px-4 rounded-lg shadow-lg">
                        <button
                            onClick={() => setShowRules(!showRules)}
                            className="inline-flex flex-row items-center justify-center text-[#0063aa] hover:text-[#004a80] font-bold w-full h-full gap-2"
                        >
                            <span className="text-white text-xs sm:text-sm md:text-base font-extrabold">
                                OFFICIAL RULES
                            </span>
                            <svg
                                className={`w-4 h-4 transition-transform text-white ${showRules ? 'rotate-180' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Official Rules Content - Show/Hide */}
                {showRules && (
                    <div id="official-rules-section" className="mt-12 bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-[#011e5b] mb-6 text-center">OFFICIAL RULES</h2>
                        <div className="prose max-w-none text-black whitespace-pre-line text-sm leading-relaxed">
                            {officialRules}
                        </div>
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowRules(false)}
                                className="text-[#0063aa] hover:text-[#004a80] font-medium text-sm underline"
                            >
                                Hide Rules
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={`w-full h-2 ${isPacifico ? 'bg-black' : 'bg-[#ffb500]'}`}></div>

            <footer className={`py-10 ${isPacifico ? 'bg-[#ffdd00]' : 'bg-[#011e5b]'}`}>
                <div className='py-10 px-4'>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <div className="h-20 flex justify-center items-center mb-6">
                                <img
                                    src={promotion.brandLogo}
                                    alt={promotion.title}
                                    className="h-22 w-auto"
                                />
                            </div>

                            <div className="flex justify-center items-center gap-6 mb-8">
                                <a
                                    href="https://www.facebook.com/CoronaUSA"
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    title="Facebook Link"
                                    aria-label="Facebook Link"
                                    className={`${isPacifico ? 'text-black hover:text-black' : 'text-[#ffb500] hover:text-[#ffb500]'} transition-colors`}
                                >
                                    <FaFacebook size={24} />
                                    <span className="sr-only">Follow us on Facebook</span>
                                </a>
                                <a
                                    href="https://twitter.com/CoronaExtraUSA"
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    title="Twitter Link"
                                    aria-label="Twitter Link"
                                    className={`${isPacifico ? 'text-black hover:text-black' : 'text-[#ffb500] hover:text-[#ffb500]'} transition-colors`}
                                >
                                    <FaXTwitter size={24} />
                                    <span className="sr-only">Follow us on Twitter</span>
                                </a>
                                <a
                                    href="https://www.instagram.com/coronausa/"
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    title="Instagram Link"
                                    aria-label="Instagram Link"
                                    className={`${isPacifico ? 'text-black hover:text-black' : 'text-[#ffb500] hover:text-[#ffb500]'} transition-colors`}
                                >
                                    <FaInstagram size={24} />
                                    <span className="sr-only">Follow us on Instagram</span>
                                </a>
                            </div>

                            <div className="mb-6">
                                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
                                    <a
                                        className={`${isPacifico ? 'text-black hover:text-black' : 'text-[#ffb500] hover:text-[#ffb500]'} text-sm transition-colors`}
                                        href="https://www.cbrands.com/pages/terms"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="Terms and Conditions Link"
                                        aria-label="Terms and Conditions Link"
                                    >
                                        Terms and Conditions
                                    </a>
                                    <a
                                        className={`${isPacifico ? 'text-black hover:text-black' : 'text-[#ffb500] hover:text-[#ffb500]'} text-sm transition-colors cursor-pointer`}
                                        onClick={() => console.log("Toggle OneTrust display")}
                                    >
                                        Do Not Sell/Do Not Share My Personal Information
                                    </a>
                                    <a
                                        className={`${isPacifico ? 'text-black hover:text-black' : 'text-[#ffb500] hover:text-[#ffb500]'} text-sm transition-colors`}
                                        href="https://www.cbrands.com/pages/privacy-notice"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="Privacy Policy Link"
                                        aria-label="Privacy Policy Link"
                                    >
                                        Privacy Notice
                                    </a>
                                    <a
                                        className={`${isPacifico ? 'text-black hover:text-black' : 'text-[#ffb500] hover:text-[#ffb500]'} text-sm transition-colors`}
                                        href="/faq"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="FAQ Link"
                                        aria-label="FAQ Link"
                                    >
                                        FAQs
                                    </a>
                                </div>

                                <p className={`text-sm mb-2 ${isPacifico ? 'text-black' : 'text-white'}`}>
                                    Drink responsibly. {getBeerName()} Beer. Imported by Crown Imports, Chicago, IL
                                </p>

                                <p className={`text-sm mb-8 ${isPacifico ? 'text-black' : 'text-white'}`}>
                                    NO PURCHASE NECESSARY. 21+. Ends 01/06/2026. Void where prohibited.
                                </p>
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
                        alt="Constellation Brands"
                        className="h-4 w-auto"
                    />
                </div>
            </div>
        </div>
    );
}