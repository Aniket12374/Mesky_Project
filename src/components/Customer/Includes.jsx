import React, { useState } from "react";

const Includes = () => {
  const [itemsFruits, setItemFruits] = useState([]);

  const handleitems = (item) => {
    if (!itemsFruits.includes(item)){ 
        
        setItemFruits([...itemsFruits, item]);
    }
  };

  return (
    <div>
      <button onClick={() => handleitems("Apple")}></button>
      <button onClick={() => handleitems("Orange")}></button>
      <h3>Fruits:</h3>
      <ul>
        {itemsFruits.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

