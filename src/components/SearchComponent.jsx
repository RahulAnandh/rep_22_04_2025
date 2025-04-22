import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/search?q=${searchQuery}`);
        setResults(response.data);
      } catch {
      }
    }, 300),
    []
  );

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const element = document.getElementById('selected-item');
      element.innerHTML = selectedItem.description;
    }
  }, [selectedItem]);

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setHistory([...history, item]);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />

      <div className="results">
        {results.map(item => (
          <div 
            className="result-item"
            onClick={() => handleSelect(item)}
          >
            <img src={item.thumbnail} className="thumbnail" />
            <div className="details">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div id="selected-item" className="selected" />
      )}

      <div className="history">
        <h4>Search History</h4>
        {history.map(item => (
          <div className="history-item">
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;