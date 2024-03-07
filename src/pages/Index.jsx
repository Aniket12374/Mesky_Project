import Layout from "../components/Layout/Layout";
import { useMainStore } from "../store/store";

const Index = () => {
  const user = useMainStore((state) => state.user);
  const setUser = useMainStore((state) => state.setUser);
  const setName = useMainStore((state) => state.setName);

  return (
    <Layout>
      <div>Home page </div>
      <div>{JSON.stringify(user)}</div>
      <button
        className="border"
        onClick={() => {
          setUser({ name: "abhi", email: "a@gmail.com" });
        }}
      >
        set user
      </button>

      <button
        className="border"
        onClick={() => {
          setName("kumar");
        }}
      >
        set name
      </button>
    </Layout>
  );
};

export default Index;
