import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { debounce } from "lodash";
import "./SearchComponent.css";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const BASE_URL = "http://localhost:3001";
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/search?q=${searchQuery}`
        );

        setResults(response.data);
      } catch (err) {
        setError(err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const element = document.getElementById("selected-item");
      element.innerHTML = selectedItem.description;
    }
  }, [selectedItem]);

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setHistory([...history, item]);
    localStorage.setItem("searchHistory", JSON.stringify(history));
  };

  return (
    <div className="search-container">
      <select placeholder="Select Category">
        <option name="name">Name</option>
        <option name="category">Type</option>
        <option name="date">Date</option>
      </select>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />

      <div className="results">
        {results.map((item) => (
          <div className="result-item" onClick={() => handleSelect(item)}>
            <img src={item.thumbnail} className="thumbnail" />
            <div className="details">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && <div id="selected-item" className="selected" />}

      <div className="history">
        <h4>Search History</h4>
        {history.map((item) => (
          <div className="history-item">{item.title}</div>
        ))}
      </div>
      <button
        className="clear-button"
        onClick={() => {
          setHistory([]);
        }}
      >
        Clear Search
      </button>
    </div>
  );
};

export default memo(SearchComponent);
