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
      className={`px-4 py-2 font-bold text-stone-200 hover:text-purple-400 hover:-translate-y-1 transition-transform duration-200 ${page === index ? "text-green-500" : ""}`}
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
        className={`px-2 transition-transform duration-200 ${page === limit ? "hidden" : "block"} ${decrement ? "rounded-l-full hover:-translate-x-1" : "rounded-r-full hover:translate-x-1"}`}
        onClick={handleClick}
        disabled={page === limit}
      >
        <img
          src={ChevronIcon}
          alt="chevron"
          className={`invert ${decrement ? "" : "rotate-180"}`}
        />
      </button>
    );
  };

  return (
    <div className="mb-5 flex items-center justify-center">
      <div className="bg-black rounded-full flex shadow">
        {incrementButton("down")}
        {pageNumberButtons()}
        {incrementButton()}
      </div>
    </div>
  );
}
