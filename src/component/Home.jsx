import React, { useState, useEffect, useMemo } from 'react';
import logoImage from '../assets/logo-constellation-brands.svg';
import lowerImage from '../assets/img-hero-1-scaled.webp';
import { Link } from 'react-router-dom';
import { allPromotions, stateData } from '../constants';
import logoOptivate from '../assets/logo-optivate.webp';

export default function Home() {
    // Filter and sort states
    const [brandFilter, setBrandFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);
    const [filteredPromotions, setFilteredPromotions] = useState(allPromotions);
    const [stateOptions, setStateOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);

    // Calculate brand options based on current filters
    const calculateBrandOptions = (stateValue = '') => {
        let filtered = allPromotions;

        // Filter by state if provided
        if (stateValue) {
            filtered = filtered.filter(promo =>
                promo.eligibleStates && promo.eligibleStates.includes(stateValue)
            );
        }

        // Count promotions per brand
        const brandCounts = {};
        filtered.forEach(promo => {
            brandCounts[promo.brand] = (brandCounts[promo.brand] || 0) + 1;
        });

        // Create brand options array
        const allBrands = [...new Set(allPromotions.map(p => p.brand))];
        return allBrands.map(brand => {
            const displayName = brand === 'corona' ? 'Corona' :
                brand === 'modelo' ? 'Modelo' :
                    brand === 'pacifico' ? 'Pacifico' : brand;
            return {
                value: brand,
                label: `${displayName} (${brandCounts[brand] || 0})`,
                count: brandCounts[brand] || 0
            };
        });
    };

    // Calculate state options based on current filters
    const calculateStateOptions = (brandValue = '') => {
        let filtered = allPromotions;

        // Filter by brand if provided
        if (brandValue) {
            filtered = filtered.filter(promo => promo.brand === brandValue);
        }

        // Count promotions per state
        const stateCounts = {};
        filtered.forEach(promo => {
            if (promo.eligibleStates) {
                promo.eligibleStates.forEach(state => {
                    stateCounts[state] = (stateCounts[state] || 0) + 1;
                });
            }
        });

        // Create state options array with all 51 states
        return stateData.map(state => ({
            ...state,
            count: stateCounts[state.value] || 0,
            label: `${state.label} (${stateCounts[state.value] || 0})`
        }));
    };

    // Initialize options
    useEffect(() => {
        const initialBrandOptions = calculateBrandOptions();
        const initialStateOptions = calculateStateOptions();

        setBrandOptions(initialBrandOptions);
        setStateOptions(initialStateOptions);
    }, []);

    // Update state options when brand filter changes
    useEffect(() => {
        const updatedStateOptions = calculateStateOptions(brandFilter);
        setStateOptions(updatedStateOptions);

        // Clear state selection if the selected state has 0 count for the selected brand
        if (stateFilter && brandFilter) {
            const selectedStateData = updatedStateOptions.find(s => s.value === stateFilter);
            if (!selectedStateData || selectedStateData.count === 0) {
                setStateFilter("");
            }
        }
    }, [brandFilter]);

    // Update brand options when state filter changes
    useEffect(() => {
        const updatedBrandOptions = calculateBrandOptions(stateFilter);
        setBrandOptions(updatedBrandOptions);

        // Clear brand selection if the selected brand has 0 count for the selected state
        if (brandFilter && stateFilter) {
            const selectedBrandData = updatedBrandOptions.find(b => b.value === brandFilter);
            if (!selectedBrandData || selectedBrandData.count === 0) {
                setBrandFilter("");
            }
        }
    }, [stateFilter]);

    // Apply filters and sort
    useEffect(() => {
        let result = [...allPromotions];

        // Apply brand filter
        if (brandFilter) {
            result = result.filter(promo => promo.brand === brandFilter);
        }

        // Apply state filter
        if (stateFilter) {
            result = result.filter(promo =>
                promo.eligibleStates && promo.eligibleStates.includes(stateFilter)
            );
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
        setVisibleCount(6);
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

        // Reset to all data
        setBrandOptions(calculateBrandOptions());
        setStateOptions(calculateStateOptions());
    };

    const handleBrandChange = (e) => {
        const brand = e.target.value;
        setBrandFilter(brand);
        setVisibleCount(6);
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setStateFilter(state);
        setVisibleCount(6);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Check if reset button should be disabled
    const isResetDisabled = !brandFilter && !stateFilter && !sortOption;

    // Get promotion states for display
    const getPromotionStates = (promotion) => {
        if (!promotion.eligibleStates || promotion.eligibleStates.length === 0) {
            return "Not available in any state";
        }

        if (promotion.eligibleStates.length === stateData.length) {
            return "Available in all states";
        }

        if (promotion.eligibleStates.length <= 3) {
            return `Available in: ${promotion.eligibleStates
                .map(state => stateData.find(s => s.value === state)?.label || state)
                .join(", ")}`;
        }

        return `Available in ${promotion.eligibleStates.length} states`;
    };

    // Sort options
    const sortOptions = [
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "title_asc", label: "Sort A-Z" },
        { value: "title_desc", label: "Sort Z-A" }
    ];

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

            {/* Lower image section */}
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

                    <div className="flex flex-col lg:flex-row gap-8 pt-10 mb-10">
                        {/* Sidebar - Filters - Sticky */}
                        <div className="lg:w-1/4">
                            <div className="sticky top-6 bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-[24px] font-bold text-[#011e5b] mb-6 uppercase">Filter</h2>

                                {/* Filter by Brand */}
                                <div className="mb-3">
                                    <h4 className="font-semibold text-[#011e5b] mb-3">Filter by Brand</h4>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[#f5fbff] text-[#0063aa]"
                                            value={brandFilter}
                                            onChange={handleBrandChange}
                                        >
                                            <option value="">Choose...</option>
                                            {brandOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                    disabled={option.count === 0}
                                                    className={option.count === 0 ? "text-gray-400" : ""}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-[#0063aa]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    {stateFilter && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Showing brands available in {stateData.find(s => s.value === stateFilter)?.label}
                                        </p>
                                    )}
                                </div>

                                {/* Filter by State */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-[#011e5b] mb-2">Filter by State</h4>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[#f5fbff] text-[#0063aa]"
                                            value={stateFilter}
                                            onChange={handleStateChange}
                                            disabled={!stateOptions.length}
                                        >
                                            <option value="">Choose...</option>
                                            {stateOptions.map((state) => (
                                                <option
                                                    key={state.value}
                                                    value={state.value}
                                                    disabled={state.count === 0}
                                                    className={state.count === 0 ? "text-gray-400" : ""}
                                                >
                                                    {state.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-[#0063aa]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    {brandFilter && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Showing states where {brandFilter === 'corona' ? 'Corona' :
                                                brandFilter === 'modelo' ? 'Modelo' :
                                                    'Pacifico'} has promotions
                                        </p>
                                    )}
                                </div>

                                {/* Sort */}
                                <div className="mb-3">
                                    <h2 className="text-[24px] font-bold text-[#011e5b] mb-3 uppercase">Sort</h2>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[#f5fbff] text-[#0063aa]"
                                            value={sortOption}
                                            onChange={handleSortChange}
                                        >
                                            <option value="">Sort by...</option>
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-[#0063aa]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <button
                                    onClick={handleReset}
                                    disabled={isResetDisabled}
                                    className={`w-full py-3 ${isResetDisabled ? 'bg-[#001e5b] cursor-not-allowed' : 'bg-[#001E5B] hover:bg-[#003080]'} text-white font-medium rounded-lg transition-colors uppercase`}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Main Content - Promotions Grid */}
                        <div className="lg:w-3/4">


                            {filteredPromotions.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                    <p className="text-lg text-gray-600 mb-4">No promotions found matching your filters.</p>
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-2 bg-[#001E5B] text-white font-medium rounded-lg hover:bg-[#003080] transition-colors"
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
                                                    <div className="absolute top-0 h-full px-6 overflow-hidden z-2">
                                                        <img
                                                            src={promotion.image}
                                                            alt={promotion.title}
                                                            className="w-full h-full"
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

                                                    {/* State availability badge */}
                                                    {/* <div className="mb-4 text-center">
                                                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#f0f8ff] text-[#0063aa] rounded-full">
                                                            {getPromotionStates(promotion)}
                                                        </span>
                                                    </div> */}

                                                    {/* Dates Section */}
                                                    <div className="flex flex-col items-center gap-2 text-sm text-gray-600 mb-4 mt-auto">
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-center">
                                                                <div><b className='text-[#011e5b]'>From</b></div>
                                                                <div>{promotion.fromDate}</div>
                                                            </div>
                                                            <span className="text-[#011e5b]">-</span>
                                                            <div className="text-center">
                                                                <div><b className='text-[#011e5b]'>To</b></div>
                                                                <div>{promotion.toDate}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Enter Button */}
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