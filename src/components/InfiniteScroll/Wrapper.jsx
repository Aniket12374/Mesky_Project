import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function InfiniteScrollWrapper({
  isInfiniteScrollOn,
  lengthData,
  functionNext,
  children,
  totalLength,
}) {
  if (!isInfiniteScrollOn) return <>{children}</>;

  return (
    <div
      style={{ marginTop: "50px", marginBottom: "50px", height: "400px" }}
      className="infinite-scroll"
    >
      <InfiniteScroll
        dataLength={lengthData} //This is important field to render the next data
        next={() => functionNext(lengthData)}
        hasMore={totalLength > lengthData ? true : false}
        loader={totalLength > lengthData ? <h4>Loading...</h4> : null}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {children} {/** !!! DO NOT TOUCH !!! => It wraps the table */}
      </InfiniteScroll>
    </div>
  );
}

export default InfiniteScrollWrapper;
