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

const items = [
  {
    key: "1",
    label: (
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://www.antgroup.com'
      >
        1st menu item
      </a>
    ),
  },
];

export const OrderTnxHeader = ({
  setModalOpen,
  name,
  showSearch,
  placeholder,
}) => {
  return (
    <div className='flex flex-wrap items-center'>
      <Header text={name || "Transactions"} className='m-2 mr-3' />
      {showSearch && (
        <div className='mt-2 mr-1 cursor-pointer'>
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
                label: <div>Create Order</div>,
              },
            ],
          }}
        >
          <button>
            <i className='fa fa-ellipsis-v' aria-hidden={true} />
          </button>
        </Dropdown>
      )}
    </div>
  );
};
