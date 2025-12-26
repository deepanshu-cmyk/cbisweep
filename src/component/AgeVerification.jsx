import React, { useState, useRef, useEffect } from 'react';
import logoImage from '../assets/logo.webp';
import { Navigate } from 'react-router-dom';

export default function AgeVerification() {
    const [formData, setFormData] = useState({
        month: '',
        day: '',
        year: ''
    });
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // Refs for input focus management
    const monthRef = useRef(null);
    const dayRef = useRef(null);
    const yearRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Allow only numbers
        const numericValue = value.replace(/[^0-9]/g, '');

        // Update state
        setFormData(prev => ({
            ...prev,
            [name]: numericValue
        }));

        // Auto-focus next input
        if (name === 'month' && numericValue.length === 2) {
            dayRef.current?.focus();
        }
        if (name === 'day' && numericValue.length === 2) {
            yearRef.current?.focus();
        }

        // Clear error when user types
        if (error) setError('');
    };

    const handleKeyDown = (e, fieldName) => {
        // Handle backspace to move to previous field
        if (e.key === 'Backspace' && fieldName !== 'month') {
            if (formData[fieldName] === '') {
                e.preventDefault();
                if (fieldName === 'day') {
                    monthRef.current?.focus();
                } else if (fieldName === 'year') {
                    dayRef.current?.focus();
                }
            }
        }

        // Handle arrow keys for navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (fieldName === 'day') monthRef.current?.focus();
            if (fieldName === 'year') dayRef.current?.focus();
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (fieldName === 'month') dayRef.current?.focus();
            if (fieldName === 'day') yearRef.current?.focus();
        }
    };

    const calculateAge = (month, day, year) => {
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        // Check if date is valid
        if (isNaN(birthDate.getTime())) return null;

        // Check if birth date is in the future
        if (birthDate > today) return null;

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all fields are filled
        if (!formData.month || !formData.day || !formData.year) {
            setError('Please enter your complete birth date');
            return;
        }

        // Validate month
        const month = parseInt(formData.month);
        if (month < 1 || month > 12) {
            setError('Please enter a valid month (1-12)');
            return;
        }

        // Validate day
        const day = parseInt(formData.day);
        if (day < 1 || day > 31) {
            setError('Please enter a valid day (1-31)');
            return;
        }

        // Validate year
        const year = parseInt(formData.year);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear) {
            setError(`Please enter a valid year (1900-${currentYear})`);
            return;
        }

        // Validate date exists (e.g., not Feb 30)
        const date = new Date(year, month - 1, day);
        if (date.getMonth() + 1 !== month || date.getDate() !== day) {
            setError('Please enter a valid date');
            return;
        }

        const age = calculateAge(month, day, year);

        if (age === null) {
            setError('Please enter a valid date');
            return;
        }

        if (age < 21) {
            setError('You must be 21 years or older to enter');
            return;
        }

        // Age verification passed
        setIsVerified(true);
        setError('');
        console.log('Age verified successfully!');
    };

    // Focus first input on component mount
    useEffect(() => {
        monthRef.current?.focus();
    }, []);

    // If age is verified, show next page or redirect
    if (isVerified) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="min-h-screen bg-[#011e5b] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Single White Box Container - Everything in one box */}
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl border-2 border-gray-300">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={logoImage}
                            alt="Site Logo"
                            className="h-16 w-auto object-contain max-w-full"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="font-bold text-center text-[#011e5b] mb-3 tracking-tight" style={{ fontSize: 'var(--text-xl)' }}>
                        21 years or older?
                    </h1>

                    {/* Subtitle */}
                    <p className="text-center text-[#011e5b] mb-8 font-medium" style={{ fontSize: 'var(--text-m)' }}>
                        You must be of legal drinking age to enter this site.
                    </p>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Date Labels */}
                        <div className="flex justify-between mb-4 px-1">
                            <span className="text-[#011e5b] text-sm uppercase tracking-[0.2em] font-semibold">MONTH</span>
                            <span className="text-[#011e5b] text-sm uppercase tracking-[0.2em] font-semibold">DAY</span>
                            <span className="text-[#011e5b] text-sm uppercase tracking-[0.2em] font-semibold">YEAR</span>
                        </div>

                        {/* Input Fields */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        ref={monthRef}
                                        type="text"
                                        name="month"
                                        value={formData.month}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'month')}
                                        placeholder="MM"
                                        className="w-full h-16 px-4 bg-white border-2 border-gray-800 rounded-lg text-center text-2xl font-bold text-[#011e5b] placeholder-[#011e5b] placeholder-opacity-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                                        maxLength={2}
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        ref={dayRef}
                                        type="text"
                                        name="day"
                                        value={formData.day}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'day')}
                                        placeholder="DD"
                                        className="w-full h-16 px-4 bg-white border-2 border-gray-800 rounded-lg text-center text-2xl font-bold text-[#011e5b] placeholder-[#011e5b] placeholder-opacity-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                                        maxLength={2}
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        ref={yearRef}
                                        type="text"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'year')}
                                        placeholder="YYYY"
                                        className="w-full h-16 px-4 bg-white border-2 border-gray-800 rounded-lg text-center text-2xl font-bold text-[#011e5b] placeholder-[#011e5b] placeholder-opacity-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none transition-all duration-200"
                                        maxLength={4}
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center justify-center my-6">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="ml-2 text-[#011e5b] text-sm uppercase tracking-[0.1em] font-medium opacity-80 cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
                                <p className="text-red-600 text-center font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg uppercase tracking-[0.2em] rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Enter
                        </button>
                    </form>

                    {/* Footer Note inside the same box */}
                    <p className="text-center text-[#011e5b] text-opacity-80 text-sm mt-8 tracking-wide font-medium">
                        By entering, you confirm you are of legal drinking age.
                    </p>
                </div>
            </div>
        </div>
    );
}   