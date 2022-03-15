import React, { useState, useEffect } from "react";
import { getCustomVisits } from "src/api/reports/summary";
import TestPagination from "./table_pagination";
import { Table } from "reactstrap";

const SummaryTable = (props) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0)

  useEffect(() => {
    getCustomVisits(props.data).then((value) => {
      setPageCount(Math.ceil(value.data?.length / 6))
      for(let i in value.data) {
        value.data[i] = {
          ...value.data[i],  index: i 
        }
      }
     console.log(value.data)
      setData(value.data);
    }).catch(err => console.log(err))
    props = [];
  }, [props]);

  return (
    <>
      {data.length ? (
        <TestPagination
          pageSize={6}
          pageCount={pageCount}
          currentPage={0}
          data={data}
        />
      ) : (
        <>
          <Table size="sm">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Date</th>
                <th>Visits</th>
                <th>Download</th>
              </tr>
            </thead>
          </Table>

          <p className="p-1 w-100 my-5"> Data is not availabe </p>
        </>
      )}
    </>
  );
};

export default SummaryTable;
