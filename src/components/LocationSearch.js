import React, { useState } from "react";
import axios from "axios";
import DebugLogger from "../utils/DebugLogger";
import debounce from "lodash.debounce";
import "./LocationSearch.css";

const LOCATIONIQ_KEY = process.env.REACT_APP_LOCATIONIQ_API_KEY;

function LocationSearch({ setCenter }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = debounce(async (text) => {
    if (!text) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await axios.get(`https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(text)}&limit=5&format=json`);
      setSuggestions(resp.data || []);
      DebugLogger.log("LocationSearch", "Fetched suggestions", { text, count: resp.data.length });
    } catch (e) {
      DebugLogger.error("LocationSearch", "Suggestion API failed", e);
      setSuggestions([]);
    }
  }, 300);

  function handleInput(e) {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
  }

  function handleSelect(suggestion) {
    setCenter({ lat: Number(suggestion.lat), lng: Number(suggestion.lon) });
    setQuery(suggestion.display_name);
    setSuggestions([]);
    DebugLogger.log("LocationSearch", "Selected suggestion", suggestion);
  }

  return (
    <div className="location-search-bar">
      <input value={query} onChange={handleInput} placeholder="Search for a location..." />
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((s) => (
            <li key={s.place_id} onClick={() => handleSelect(s)}>{s.display_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationSearch;