import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { createTicket } from "../services/support/supportService";

const Support = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const handleChange = () => {
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="m-16">
        {!isSubmitted ? (
          <div>
            <div className="text-3xl font-bold">Write to Us!</div>
            <div className="flex flex-col h-96 w-8/12">
              <textarea
                className="textarea textarea-info w-full h-full rounded-lg mt-4 border-1 border-[#65CBF3]"
                onChange={(e) => setDescription(e.target.value)}
              >
                {description}
              </textarea>
              <div className="mt-2 flex justify-end">
                <button
                  className="w-32 h-8 rounded-lg text-white bg-[#65CBF3]"
                  onClick={() => {
                    setIsSubmitted(true);
                    createTicket(description);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-3xl font-bold">
              We have received your request!
            </div>
            <div className="flex flex-col h-96 w-8/12">
              <div className="textarea textarea-info w-full h-full border-2 border-[#65CBF3]  mt-4 text-3xl font-semibold text-center p-32">
                Our team will be in touch within 24 hours to resolve the issue.
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  className="w-32 h-8 rounded-lg text-white bg-[#65CBF3]"
                  onClick={handleChange}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Support;
