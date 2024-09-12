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
}) => (
  <div className='flex flex-wrap items-center'>
    <Header text={name || "Transactions"} className='m-2 mr-5' />
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
  </div>
);
