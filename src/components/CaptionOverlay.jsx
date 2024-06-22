import React from "react";

const CaptionOverlay = ({ caption }) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 text-center">
      {caption ? (
        <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded text-lg">
          {caption}
        </span>
      ) : (
        ""
      )}
    </div>
  );
};

export default CaptionOverlay;
