import React, { useState } from "react";

const CreateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    age: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formdata:", formdata);
  };
const handleClick = ()=>{
    alert('form has successfully submitted');
}
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name :</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />
      </div>
      <div>
        <label>Age :</label>
        <input
          type="text"
          name="age"
          onChange={handleChange}
          value={formData.age}
        />
      </div>
      <div>
        <label>Address :</label>
        <input
          type="text"
          name="address"
          onChange={handleChange}
          value={formData.address}
        />
      </div>
      <button type="Submit" onClick={handleClick}>Submit</button>
    </form>
  );
};


export default CreateForm;


