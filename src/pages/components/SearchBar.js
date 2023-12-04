import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
  
    useEffect(() => {
      const search = async () => {
        if (query) {
          const response = await axios.get(`http://localhost:8081/search?query=${query}&n=5`);
          onSearch(response.data);
        } else {
          onSearch([]);
        }
      };
      const delayDebounce = setTimeout(() => search(), 300);  // Delay for 300ms
      return () => clearTimeout(delayDebounce);
    }, [query]);
  
    return (
        <input type="text" className="border-2 border-white text-black rounded-md p-2 m-2" placeholder="Enter a movie title" value={query} onChange={e => setQuery(e.target.value)}/>
    );
}