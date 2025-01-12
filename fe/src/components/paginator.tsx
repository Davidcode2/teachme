import { useState } from "react";
import ChevronIcon from "../assets/icons/icons8-chevron-24.png";

export default function Paginator({
  setPage,
  page,
  totalPages,
}: {
  setPage: (x: number) => void;
  page: number;
  totalPages: number;
}) {
  const pageButton = (index: number) => (
    <button
      className={`px-4 py-2 font-bold text-stone-200 hover:text-purple-400 hover:-translate-y-1 transition-transform duration-200 ${page === index ? "" : ""}`}
      key={index}
      onClick={() => setPage(index)}
    >
      {index + 1}
    </button>
  );

  const pageNumberButtons = () => {
    const buttons = [];
    for (let i: number = 0; i < totalPages; i++) {
      buttons.push(pageButton(i));
    }
    return buttons;
  };

  const incrementButton = (direction?: string) => {
    let decrement = false;
    if (direction === "down") {
      decrement = true;
    }
    const limit = decrement ? 0 : totalPages - 1;
    const handleClick = decrement
      ? () => setPage(page - 1)
      : () => setPage(page + 1);
    return (
      <button
        className={`font-bold text-gray-800 px-2 transition-transform duration-200 ${page === limit ? "hidden" : ""} ${decrement ? "rounded-l-full hover:-translate-x-1" : "rounded-r-full hover:translate-x-1"}`}
        onClick={handleClick}
        disabled={page === limit}
      >
        <img
          src={ChevronIcon}
          alt="chevron"
          className={`${decrement ? "" : "rotate-180"} invert`}
        />
      </button>
    );
  };

  return (
    <div className="mb-5 mt-10 flex items-center justify-center">
      <div className="bg-black rounded-full flex">
        {incrementButton("down")}
        {pageNumberButtons()}
        {incrementButton()}
      </div>
    </div>
  );
}
