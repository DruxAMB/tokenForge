"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useState, useEffect } from 'react';
import dummyData, { DataProp } from "../../dummy-data";
import { TradeCard } from './TradeCard';
import { SearchIcon } from '@heroicons/react/outline';
import axios from 'axios';

interface TokenData {
  creator_address: string;
  token_address: string;
  name: string;
  symbol: string;
  supply: string;
  image_url: string;
  description: string;
  website_link: string;
  twitter_link: string;
  telegram_link: string;
  discord_link: string;
}

export const TradeToken: FC = () => {
    // const { publicKey, signMessage } = useWallet();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 12;
  
    // Filter the data based on the search query
    const filteredData = dummyData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    // Get the items for the current page
    const currentItems = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };


    //fetch data from API
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios.get('https://pump.truevastdata.com/api/v1/tokens')
        .then(response => {
          setTokens(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, []);
  
    if (loading) {
      return <p className="py-28 px-5 text-center font-bold text-2xl">Loading.<span className="animate-ping">...</span></p>;
    }
  

    return (
        <>
          
      <div className="max-lg:px-5 mt-10">
        <div className="flex flex-col items-center">
          <div className="flex items-center px-2 border rounded-full">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-[350px] bg-transparent text-white/80 border-none focus:border-white/25 focus:ring-transparent"
            />
            <SearchIcon className='text-white h-5' />
          </div>
        </div>

        {filteredData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-16 gap-5">
            {tokens.map((token, index) => (
          <TradeCard key={index} data={token} />
        ))}
            </div>
          </>
        ) : (
          <h1 className="text-white text-2xl text-center my-20">
            Token NotFound :(
          </h1>
        )}

        <div className="mx-[100px] max-sm:mx-5 flex justify-between mt-10">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="self-center text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>  
        </>
    );
};
