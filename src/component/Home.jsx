import React, { useState, useEffect } from 'react';
import logoImage from '../assets/logo-constellation-brands.svg';
import lowerImage from '../assets/img-hero-1-scaled.webp';
import { Link } from 'react-router-dom';
import { allPromotions } from '../constants';
import logoOptivate from '../assets/logo-optivate.webp';

export default function Home() {


    // Filter and sort states
    const [brandFilter, setBrandFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);
    const [filteredPromotions, setFilteredPromotions] = useState(allPromotions);

    // Filter options
    const brandOptions = [
        { value: "corona", label: "Corona (6)" },
        { value: "modelo", label: "Modelo (2)" },
        { value: "pacifico", label: "Pacifico (4)" }
    ];

    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "title_asc", label: "Sort A-Z" },
        { value: "title_desc", label: "Sort Z-A" }
    ];

    // Apply filters and sort
    useEffect(() => {
        let result = [...allPromotions];

        // Apply brand filter
        if (brandFilter) {
            result = result.filter(promo => promo.brand === brandFilter);
        }

        // Apply state filter (simplified - just showing functionality)
        if (stateFilter) {
            // For demo purposes, filter by brand if state is selected
            result = result.filter(promo => promo.brand === "corona");
        }

        // Apply sorting
        if (sortOption) {
            switch (sortOption) {
                case "newest":
                    result.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate));
                    break;
                case "oldest":
                    result.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
                    break;
                case "title_asc":
                    result.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case "title_desc":
                    result.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                default:
                    break;
            }
        }

        setFilteredPromotions(result);
        setVisibleCount(6); // Reset visible count when filters change
    }, [brandFilter, stateFilter, sortOption]);

    // Get visible promotions
    const promotions = filteredPromotions.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPromotions.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 6, filteredPromotions.length));
    };

    const handleReset = () => {
        setBrandFilter("");
        setStateFilter("");
        setSortOption("");
        setVisibleCount(6);
    };

    const handleBrandChange = (e) => {
        setBrandFilter(e.target.value);
    };

    const handleStateChange = (e) => {
        setStateFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Check if reset button should be disabled
    const isResetDisabled = !brandFilter && !stateFilter && !sortOption;

    return (
        <div className="min-h-screen bg-white">
            {/* Top color section with centered logo */}
            <div className="h-16 md:h-20 bg-[#011e5b] flex justify-center items-center px-4">
                <img
                    src={logoImage}
                    alt="Constellation Brands"
                    className="h-8 md:h-12 w-auto"
                />
            </div>

            {/* Lower image section - RESPONSIVE */}
            <div className="w-full">
                <div className="">
                    <img
                        src={lowerImage}
                        alt="Promotions"
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Promotions Section */}
            <section className="bg-[#0079CF1A] py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10 leading-[1.2]">
                        <p className="text-[24px] font-bold text-[#011e5b]">2025</p>
                        <p className="text-[40px] text-[#0063aa] font-bold">PROMOTIONS</p>
                        <p className="text-[24px] font-bold text-[#011e5b]">GOOD LUCK!</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 pt-10 mb-10 ">
                        {/* Sidebar - Filters - Sticky */}
                        <div className="lg:w-1/4">
                            <div className="sticky top-6 bg-white rounded-lg shadow-md p-6 ">
                                <h2 className="text-[24px] font-bold text-[#011e5b] mb-6 uppercase">Filter</h2>

                                {/* Filter by Brand */}
                                <div className="mb-3">
                                    <h4 className="font-semibold text-gray-700 mb-3">Filter by Brand</h4>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[#f5fbff] text-[#0063aa]"
                                            value={brandFilter}
                                            onChange={handleBrandChange}
                                        >
                                            <option value="">Choose...</option>
                                            {brandOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter by State */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-700 mb-2">Filter by State</h4>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[#f5fbff] text-[#0063aa]"
                                            value={stateFilter}
                                            onChange={handleStateChange}
                                        >
                                            <option value="">Choose...</option>
                                            <option value="alabama">Alabama (6)</option>
                                            <option value="california">California (8)</option>
                                            <option value="new-york">New York (7)</option>
                                            <option value="texas">Texas (6)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Sort */}
                                <div className="mb-3 ">
                                    <h2 className="text-[24px] font-bold text-[#011e5b] mb-3 uppercase">Sort</h2>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[#f5fbff] text-[#0063aa]"
                                            value={sortOption}
                                            onChange={handleSortChange}
                                        >
                                            <option value="" className=''>Sort by...</option>
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <button
                                    onClick={handleReset}
                                    disabled={isResetDisabled}
                                    className={`w-full py-3 ${isResetDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#001E5B] hover:bg-[#003080]'} text-white font-medium rounded-lg transition-colors uppercase`}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Main Content - Promotions Grid */}
                        <div className="lg:w-3/4">
                            {filteredPromotions.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-lg text-gray-600">No promotions found matching your filters.</p>
                                    <button
                                        onClick={handleReset}
                                        className="mt-4 px-6 py-2 bg-[#001E5B] text-white font-medium rounded-lg hover:bg-[#003080] transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {promotions.map((promotion) => (
                                            <li key={promotion.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                                {/* Image Section */}

                                                <figure className="relative h-80 overflow-hidden flex items-center justify-center">
                                                    <img
                                                        src={promotion.image}
                                                        alt={promotion.title}
                                                        className="w-full h-full object-cover blur-sm"
                                                    />
                                                    <div className="absolute top-0 h-full px-6 overflow-hidden z-2 ">
                                                        <img
                                                            src={promotion.image}
                                                            alt={promotion.title}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                                </figure>


                                                {/* Content Section */}
                                                <div className="p-6 flex flex-col grow justify-center">
                                                    <div className="mb-4 text-center">
                                                        <p className="text-[#011e5b] text-sm mb-2">{promotion.description}</p>
                                                        <h2 className="text-[20px] font-bold text-[#011e5b] line-clamp-2">{promotion.title}</h2>
                                                    </div>

                                                    {/* Dates Section */}
                                                    <div className="flex flex-col items-center gap-2 text-sm text-gray-600 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <div>
                                                                <b className='text-[#011e5b]'>From</b> {promotion.fromDate}
                                                            </div>
                                                            <span>-</span>
                                                            <div>
                                                                <b className='text-[#011e5b]'>To</b> {promotion.toDate}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Enter Button - Separate Div */}
                                                    <div className="text-center mt-auto">
                                                        <Link
                                                            to={`/sweepstakes/${promotion.id}`}
                                                            state={{ promotion }}
                                                            className="inline-flex items-center justify-center px-6 py-3 bg-[#0079cf] text-white font-medium rounded-lg hover:bg-[#004a80] transition-colors whitespace-nowrap uppercase"
                                                        >
                                                            Enter
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="text-center mt-10">
                                            <button
                                                onClick={handleLoadMore}
                                                className="w-full py-3 bg-[#011e5b] text-white font-bold rounded-lg hover:bg-[#004a80] transition-colors uppercase"
                                            >
                                                Load more ({filteredPromotions.length - visibleCount})
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="w-full h-10 bg-[#011e5b]"></div>
            <footer className="bg-[#0063aa] text-white py-10">
                <div className=' py-10 px-4'>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            {/* Constellation Brands */}
                            <div className="h-20 flex justify-center items-center">
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
                                        className={"text-[#ffb500] hover:text-[#ffb500] hover:underline text-sm transition-colors"}
                                        href="https://www.cbrands.com/pages/terms"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="Terms and Conditions Link"
                                        aria-label="Terms and Conditions Link"
                                    >
                                        Terms and Conditions
                                    </a>
                                    <a
                                        className={"text-[#ffb500] hover:text-[#ffb500] text-sm transition-colors "}
                                        onClick={() => {
                                            console.log("Toggle OneTrust display");
                                        }}
                                    >
                                        Do Not Sell/Do Not Share My Personal Information
                                    </a>
                                    <a
                                        className={"text-[#ffb500] hover:text-[#ffb500] hover:underline text-sm transition-colors"}
                                        href="https://www.cbrands.com/pages/privacy-notice"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="Privacy Policy Link"
                                        aria-label="Privacy Policy Link"
                                    >
                                        Privacy Notice
                                    </a>
                                    <a
                                        className={"text-[#ffb500] hover:text-[#ffb500] hover:underline text-sm transition-colors"}
                                        href="/faq"
                                        rel="noopener noreferrer nofollow"
                                        target="_blank"
                                        title="FAQ Link"
                                        aria-label="FAQ Link"
                                    >
                                        FAQs
                                    </a>
                                </div>


                            </div>

                            {/* Drink Responsibly */}
                            <p className="text-sm mb-2">Please Drink Responsibly</p>

                            {/* Copyright */}
                            <p className="text-sm mb-8">© 2025 Constellation Brands, All Rights Reserved</p>


                        </div>
                    </div>
                </div>
            </footer>

            <div className="w-full h-full bg-[#272727]">
                <div className="h-10 flex justify-center items-center">
                    <p className="text-sm  mr-2 text-white">In Partnership with</p>
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