import { useState } from "react";
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
      {showAgentCreation ? (
        <AgentCreation setShowAgentCreation={setShowAgentCreation} />
      ) : (
        <ListingPage setShowAgentCreation={setShowAgentCreation} />
      )}
    </Layout>
  );
};

export default Agents;
