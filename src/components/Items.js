import React, { useState } from "react";
import { generateNames, generateNumbers } from "../utils/constants";
// Ensure you import RequestButton

const Items = ({ donation }) => {
  let names = generateNames();
  const { id, location, type, description, distance } = donation;
  const [showMore, setShowMore] = useState(false);
  return (
    <div>
      <li
        key={id}
        className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow flex justify-between items-center">
        <div>
          {/* <h3 className="text-lg font-medium text-gray-700">{type}</h3> */}
          <p className="text-sm text-gray-600 text-lg font-bold">{description}</p>
          <p className="text-sm font-semibold text-gray-800">
            Location: {location}
          </p>
          {showMore && (
            <div className="flex flex-col py-4">
              <p>Donar Name: {donation?.name || generateNames()}</p>
              <p>Email Id: {donation?.donorEmail || names + "@gmail.com"}</p>
              <p>Contact: {donation?.contact || generateNumbers()}</p>
              <p> Distance: {distance == 0 ? "in the same city" : distance}</p>
            </div>
          )}
        </div>
        <div className="w-1/4">
          <button
            onClick={() => {
              setShowMore(!showMore);
            }}>
            {showMore ? "Show less" : "Show More"}
          </button>
        </div>
      </li>

      {/* Pass the props properly to the RequestButton */}
    </div>
  );
};

export default Items;
