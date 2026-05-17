import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchBar = ({ placeholder = 'Search...', onSelect = null }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/v1/search', {
          params: { q: query }
        });
        setResults(response.data.data || []);
        setShowResults(true);
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (result) => {
    if (onSelect) {
      onSelect(result);
    }
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSelect(result)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition"
            >
              <div className="flex items-center">
                {result.image && (
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-8 h-8 rounded mr-3 object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{result.name}</p>
                  {result.category && (
                    <p className="text-xs text-gray-500">{result.category}</p>
                  )}
                </div>
                {result.price && (
                  <span className="text-sm font-semibold text-gray-900">
                    ${result.price?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && query && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-gray-600">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
