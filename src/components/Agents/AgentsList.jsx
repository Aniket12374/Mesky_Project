import React from "react";

function AgentsList({
  riders,
  HistoryHeaders,
  setSelectedRowData,
  setShowAgentCreation,
  currentPage,
  totalDataCount,
  handlePageChange,
  handlePageSizeChange,
  pageSizeOptions,
}) {
  return (
    <div>
      <DataTable
        data={riders}
        fileName="Agents_Listing.csv"
        columns={HistoryHeaders}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              setSelectedRowData(record);
              setShowAgentCreation(false);
            },
          };
        }}
        scroll={{
          y: "calc(100vh - 360px)",
        }}
        // pagination={paginationConfig}
      />
      <div className="flex justify-end px-4 py-2">
        <Pagination
          current={currentPage}
          total={totalDataCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${totalDataCount} items`
          }
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={pageSizeOptions}
          onShowSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

export default AgentsList;
