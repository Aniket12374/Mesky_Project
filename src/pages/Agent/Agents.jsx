import { useState } from "react";
import Button from "../../components/Common/Button";
import ListingPage from "../../components/Agents/ListingPage";
import { Header } from "../../utils";
import Layout from "../../components/Layout/Layout";
import AgentCreation from "../../components/Agents/AgentCreation";
import arrow from "../../../public/back_arrow.png";
import { useNavigate } from "react-router-dom";

const Agents = () => {
  const [showAgentCreation, setShowAgentCreation] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const navigate = useNavigate();

  const handleAddAgentClick = () => {
    setShowAgentCreation(true);
  };

  const handleBack = () => {
    window.location.reload();
  };

  return (
    <Layout>
      <div className="flex space-x-2">
        {showBack && (
          <div onClick={handleBack}>
            <img src={arrow} width={30} height={30} alt="backArrow-1" />
          </div>
        )}
        <Header text="Agents " />
      </div>
      {showAgentCreation ? (
        <AgentCreation
          setShowAgentCreation={setShowAgentCreation}
          setShowBack={setShowBack}
        />
      ) : (
        <ListingPage
          setShowAgentCreation={setShowAgentCreation}
          setShowBack={setShowBack}
        />
      )}
    </Layout>
  );
};

export default Agents;
