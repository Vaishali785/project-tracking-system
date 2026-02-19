import { useEffect, useRef, useState } from 'react';

/**
 * Filters Component
 * Provides status filter, search, and sort controls
 * Calls onFilterChange when any filter changes
 */


export default function Filters({ onFilterChange, projectCount, initialFilters }) {
    const [status, setStatus] = useState(initialFilters?.status || '');
    const [search, setSearch] = useState(initialFilters?.search || '');
    const [searchError, setSearchError] = useState('');
    const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'createdAt');
    const searchTimeoutRef = useRef(null);
    const errorTimeoutRef = useRef(null);

    // When any filter changes, call parent with all current filters
    const handleFilterChange = (newFilters) => {
        onFilterChange(newFilters);
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        handleFilterChange({ status: newStatus, search, sortBy });
    };

    const handleSearchChange = (e) => {
        const newSearch = e.target.value;
        setSearch(newSearch);

        // Clear previous timeout if user is still typing
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Clear any existing error timeout
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }

        // Set new timeout - only call API after 500ms of no typing
        searchTimeoutRef.current = setTimeout(() => {
            // Only search if there's actual meaningful text
            const trimmedSearch = newSearch.trim();
            setSearchError('')

            // Case 1: User typed something but it's only whitespace
            if (newSearch.length > 0 && trimmedSearch.length === 0) {
                setSearchError('Search cannot be empty or contain only spaces');

                // Auto-dismiss error after 10 seconds
                errorTimeoutRef.current = setTimeout(() => {
                    setSearchError('');
                }, 2000);
                return; // Don't make API call
            }

            handleFilterChange({
                status,
                search: trimmedSearch,
                sortBy
            });
        }, 500);

    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortBy(newSort);
        handleFilterChange({ status, search, sortBy: newSort });
    };

    const handleReset = () => {
        setStatus('');
        setSearch('');
        setSortBy('createdAt');
        setSearchError('');
        handleFilterChange({ status: '', search: '', sortBy: 'createdAt' });
    };

    // Add this before the return statement
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%'
        }}>
            {/* First row - Filter controls */}
            <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                width: '100%'
            }}>
                {/* Status Filter */}
                <div style={{ minWidth: '140px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            width: '100%'
                        }}
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Search Input - takes remaining space */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', marginBottom: '4px', gap: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500' }}>
                            Search
                        </label>
                        {/* Error message above input */}
                        {searchError && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '0px 0 0 0',

                            }}>
                                {searchError}
                            </p>
                        )}
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search project or client..."
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            width: '100%'
                        }}
                    />

                </div>

                {/* Sort By */}
                <div style={{ minWidth: '140px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            width: '100%'
                        }}
                    >
                        <option value="createdAt">Created Date</option>
                        <option value="startDate">Start Date</option>
                    </select>
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginTop: '20px', // Align with inputs
                        whiteSpace: 'nowrap'
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Second row - Active filter badges */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                {/* Left side - Active badges (or empty if no filters) */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    {(status || search) && (
                        <>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Active:</span>

                            {status && (
                                <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#dbeafe',
                                    color: '#1e40af',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    Status: {status === 'on_hold' ? 'On Hold' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    <button
                                        onClick={() => {
                                            setStatus('');
                                            handleFilterChange({ status: '', search, sortBy });
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            color: '#1e40af',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {search && (
                                <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#dcfce7',
                                    color: '#166534',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    Search: "{search}"
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            handleFilterChange({ status, search: '', sortBy });
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            color: '#166534',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* Right side - Project Count */}
                {projectCount !== null && projectCount !== undefined && (
                    <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap'
                    }}>
                        <span style={{ fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                            {projectCount}
                        </span>
                        {' '}
                        <span style={{ fontSize: '14px' }}>
                            {projectCount === 1 ? 'project' : 'projects'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

}
