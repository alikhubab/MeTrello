"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";

import logo from "@/public/logotext.png";
import { useBoardStore } from "@/store/BoardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>();

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);
    async function getSuggestion() {
      const suggestion = await fetchSuggestion(board);
      console.log(suggestion);
      setSuggestion(suggestion);
      setLoading(false);
    }

    getSuggestion();
  }, [board]);

  useEffect(() => {
    console.log(searchString);
  }, [searchString]);

  return (
    <header>
      <div
        className="absolute top-0 left-0 w-full h-96
      bg-gradient-to-br from-secondary to-primary -z-10 rounded-md
      filter blur-3xl
      opacity-50
      "
      />
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <Image
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
          src={logo}
          alt="MeTrello Logo"
          width={100}
          height={100}
        />
        <div className="flex items-center space-x-4 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none flex-1 p-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          {/* Avatar */}
          <button className="bg-primary text-white rounded-full p-2 w-12 h-12 shadow-sm font-bold">
            KA
          </button>
        </div>
      </div>
      <div
        className="flex items-center
       justify-center px-5 py-3 md:py-5"
      >
        <p className="p-5 flex items-center justify-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic ma-w-3xl text-primary transition-[width] delay-150">
          <UserCircleIcon
            className={`w-10 h-10 text-primary inline-block mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarizing your tasks for the day."}
        </p>
      </div>
    </header>
  );
}

export default Header;
