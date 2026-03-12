import { useRef, useState } from "react";
import { Upload } from "lucide-react"; // example SVG, you can use your own

export default function FileUploadButton({ onFileSelect }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
    const handleClick = () => {
    fileInputRef.current.click(); // open file picker
  };

 const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]); // send file to parent
      e.target.value = null; // reset input so user can select same file again
    }
  };

  return (
     <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
      />

      {/* Custom button with SVG */}
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {/* Example SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0-8l-3 3m3-3l3 3m-3-3V4"
          />
        </svg>
        Upload
      </button>
    </div>
  );
}
