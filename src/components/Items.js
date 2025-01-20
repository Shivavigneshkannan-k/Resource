import React from "react";
import RequestButton from "./RequestButton"; // Ensure you import RequestButton

const Items = ({ id, location, type, description, donorId, ngoId }) => {
  return (
    <div>
      <li
        key={id}
        className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{type}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-sm font-semibold text-gray-800">
            Location: {location}
          </p>
        </div>
        <div className="w-1/4">
          <RequestButton donationId={id} donorId={donorId} ngoId={ngoId} />
        </div>
      </li>

      {/* Pass the props properly to the RequestButton */}
    </div>
  );
};

export default Items;
