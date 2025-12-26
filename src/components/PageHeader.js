'use client';

import { Search, Filter, Plus } from 'lucide-react';

/**
 * CENTRALIZED PAGE HEADER
 * 
 * This component provides a consistent location for:
 * - Page title
 * - Search functionality (ONE place for search)
 * - Filters (ONE place for filters)
 * - Primary actions (ONE place for actions)
 * 
 * Usage:
 * <PageHeader 
 *   title="Courses"
 *   showSearch={true}
 *   searchPlaceholder="Search courses..."
 *   onSearch={(query) => handleSearch(query)}
 *   filters={[
 *     { id: 'all', label: 'All' },
 *     { id: 'active', label: 'Active' }
 *   ]}
 *   activeFilter="all"
 *   onFilterChange={(filterId) => handleFilter(filterId)}
 *   primaryAction={{ label: 'Add Course', icon: Plus, onClick: handleAdd }}
 * />
 */
export default function PageHeader({
    title,
    subtitle,
    showSearch = false,
    searchPlaceholder = "Search...",
    searchValue = "",
    onSearch,
    filters = [],
    activeFilter = null,
    onFilterChange,
    primaryAction = null,
    secondaryActions = [],
    children
}) {
    return (
        <header className="page-header">
            <div className="page-header-inner">
                {/* Left: Title */}
                <div className="page-header-title-area">
                    <h1 className="page-title">{title}</h1>
                    {subtitle && <p className="page-subtitle">{subtitle}</p>}
                </div>

                {/* Center: Search - ONE centralized location */}
                {showSearch && (
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearch?.(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="header-actions">
                    {/* Filters - ONE centralized location */}
                    {filters.length > 0 && (
                        <div className="filter-bar">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
                                    onClick={() => onFilterChange?.(filter.id)}
                                >
                                    {filter.icon && <filter.icon size={14} />}
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Secondary Actions */}
                    {secondaryActions.map((action, index) => (
                        <button
                            key={index}
                            className="btn btn-secondary btn-icon"
                            onClick={action.onClick}
                            title={action.label}
                        >
                            {action.icon && <action.icon size={18} />}
                        </button>
                    ))}

                    {/* Primary Action */}
                    {primaryAction && (
                        <button
                            className="btn btn-primary"
                            onClick={primaryAction.onClick}
                        >
                            {primaryAction.icon && <primaryAction.icon size={18} />}
                            {primaryAction.label}
                        </button>
                    )}
                </div>

                {/* Custom Content */}
                {children}
            </div>
        </header>
    );
}
