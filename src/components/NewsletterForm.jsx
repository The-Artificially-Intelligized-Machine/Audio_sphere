import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(0);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => setModalOpacity(1), 10);
    } else {
      setModalOpacity(0);
    }
  }, [isModalOpen]);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const data = { email: email };

    try {
      const response = await fetch("https://sheetdb.io/api/v1/9uz7u1s8g646n", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        toast.success("Successfully subscribed!");
        setEmail("");
        closeModal();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setModalOpacity(0);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  return (
    <div className="flex justify-center items-baseline pb-2 gap-3">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme="dark"
        transition:Bounce
      />
      <button
        onClick={openModal}
        className="p-2 max-w-full text-sm text-center bg-sky-600 rounded-md"
      >
        Join Waitlist
      </button>
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          style={{
            opacity: modalOpacity,
            transition: 'opacity 300ms ease-in-out'
          }}
        >
          <div className="bg-[#161616ce] p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4 text-white">Join Our Waitlist</h2>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1 rounded-lg text-white bg-gray-500 opacity-30 p-2 border-none outline-none w-250"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-sm text-center bg-gray-500 opacity-30 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 text-sm text-center bg-sky-700 text-white rounded-md"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;
