import { Dropdown } from "antd";
import { Header } from "../../utils";

export const TransactionsOptions = {
  None: "none",
  "Transaction Value": "transaction_value",
  Credit: "credit",
  Debit: "debit",
  "Wallet Recharges": "wallet_recharges",
  "Offers & Promotions": "offers",
  "Promotional Products": "promotional",
  Refunds: "refund",
};

export const OrderOptions = {
  "Product Name": "product_name",
  "Order Value": "order_value",
  "Order Id": "order_id",
  "Promotional Products": "promotional_products",
  "Item Id": "item_id",
};

export const OrderTnxHeader = ({
  setModalOpen,
  name,
  showSearch,
  placeholder,
  handleOC,
}) => {
  return (
    <div className='flex flex-wrap space-x-2 items-center'>
      <div className='font-semibold m-2 mr-3 text-xl'>
        {name || "Transactions"}
      </div>
      {showSearch && (
        <div className='mt-2 mr-2 cursor-pointer'>
          <button
            className='border border-gray-200 text-xs text-gray-300 p-1 rounded-md'
            onClick={() => setModalOpen(true)}
          >
            <span>{placeholder}</span>
            <span className='text-[#645d5d]'>
              <i class='fa-solid fa-magnifying-glass' />
            </span>
          </button>
        </div>
      )}
      {name?.includes("Order") && (
        <Dropdown
          placement='bottomLeft'
          menu={{
            items: [
              {
                key: "1",
                label: <div onClick={handleOC}>Create Order</div>,
              },
            ],
          }}
        >
          <button>
            <i className='fa fa-ellipsis-v ml-2 mt-3' aria-hidden={true} />
          </button>
        </Dropdown>
      )}
    </div>
  );
};

export const refundReasons = [
  "Qty Change Error on App",
  "Delivery Rider Error",
  "Item Delivered in Bad Condition (Dairy)",
  "Item Delivered in Bad Condition (Non-Dairy)",
  "Poor Product Quality",
  "Marked Delivered But Not Received",
  "Short Qty received",
  "Leakage",
  "Spoilt",
  "Expired Received",
];

export const OrderUpdateReasons = [
  "Don't want to use the app",
  "Using app is cumbersome",
  "App not accessible",
  "Order frozen for tomorrow's delivery",
];
