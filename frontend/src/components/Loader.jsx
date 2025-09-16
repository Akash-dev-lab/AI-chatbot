// src/components/Loader.jsx
const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-white">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      {/* Optional Text */}
      <p className="mt-2 text-sm opacity-80">{text}</p>
    </div>
  );
};

export default Loader;
