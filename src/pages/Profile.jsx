import Tabs from "../components/Common/Tabs/Tabs";
import Layout from "../components/Layout/Layout";
import DeliverSection from "../components/Profile/DeliverSection/DeliverSection";
import ProfileSection from "../components/Profile/ProfileSection/ProfileSection";
import StoreSection from "../components/Profile/StoreSection/StoreSection";
import { Header } from "../utils";

const Profile = () => {
  return (
    <Layout>
      <Header text="Profile" />
      {/* <Tabs
        tabHeaders={["Profile", "Store Holidays"]}
        tabsContent={[<ProfileSection />, <StoreSection />]}
      /> */}
      <ProfileSection />
    </Layout>
  );
};

export default Profile;
