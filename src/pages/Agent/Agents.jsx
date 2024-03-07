import React, { useState } from "react";
import Button from "../../components/Common/Button";
import ListingPage from "../../components/Agents/ListingPage";
import { Header } from "../../utils";
import Layout from "../../components/Layout/Layout";
import AgentCreation from "../../components/Agents/AgentCreation";

const Agents = () => {
  const [showAgentCreation, setShowAgentCreation] = useState(false);

  const handleAddAgentClick = () => {
    setShowAgentCreation(true);
  };

  return (
    <Layout>
      <Header text="Agents" />
      <div className="float-right">
        {/* Render the "Add Agent" button only if showAgentCreation is false */}
        {!showAgentCreation && (
          <Button btnName={"+ Add Agent"} onClick={handleAddAgentClick} />
        )}
      </div>
      {/* Conditionally render either AgentCreation or ListingPage */}
      {showAgentCreation ? (
        <AgentCreation setShowAgentCreation={setShowAgentCreation} />
      ) : (
        <ListingPage />
      )}
    </Layout>
  );
};

export default Agents;
