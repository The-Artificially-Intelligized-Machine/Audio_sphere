import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center items-baseline pb-2 gap-3">
      <input className="mt-1 rounded-lg text-white bg-gray-500 opacity-30 p-2 border-none outline-none w-250" placeholder="register with your gmail for free use"></input>
      <button className="p-2 max-w-full text-sm text-center bg-sky-600 rounded-xl ">
        Waitlist
      </button>
    </footer>
  );
};

export default Footer;
