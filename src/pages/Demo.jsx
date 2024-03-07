import Layout from "../components/Layout/Layout";
import Card from "../components/Common/Card/Card";
// import AntTable from "../components/Common/AntTable";
import Tabs from "../components/Common/Tabs/Tabs";
// import Ecommerce from "../components/Ecommerce";
// import Social from "../components/Social";

const Demo = () => {
  return (
    <Layout>
      <div>Demo</div>
      <Tabs
        tabHeaders={["Ecommerce", "Social"]}
        tabsContent={[<Ecommerce />, <Social />]}
      />
      {/* <DataTable
        data={colData}
        navigateTo={"/product/edit/"}
        columns={ProductsByUnitSoldColumnData}
      /> */}
    </Layout>
  );
};

//  interface DataTableProps = {
//   data: data,
//   navigateTo: "url - if you want to the navigate to another page on click",
//   columns: "headers data, have to mention dataIndex",
//   pagination: "show the bottom pagination default false",
//   onClick: "any additional functionality",
//   checkbox: "whether the table has checkbox",
//   radio: "whether the table has radio",
//   getSelectedRows: "setstate function to get the selected useItems",
// };

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "NUMBER OF UNITS",
    dataIndex: "id",
    key: "id",
    align: "center",
  },
];

const colData = [
  {
    id: 123,
    name: "overflow-x-auto border-1 border-slate-400 w-2/5",
    address: "1376, adree city, gurgaon",
  },
  {
    id: 124,
    name: "overflow-x-auto border-1 border-slate-400 w-2/5",
    address: "overflow-x-auto border-1 border-slate-400 w-2/5",
  },
];

export default Demo;
