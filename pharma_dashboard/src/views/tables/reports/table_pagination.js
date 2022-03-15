import React, { Component } from "react";
import {
  Pagination,
  Table,
  PaginationItem,
  PaginationLink,
  Button,
} from "reactstrap";
import { getDownloadableData } from "src/api/reports/summary";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

class TestPagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: props.currentPage,
    };
  }

  handleClick = (e, index) => {
    e.preventDefault();
    this.setState({
      currentPage: index,
    });
  };

  downloadHanlder(value) {
    const data = {
      franchisee_id: value.franchisee_id,
      date: value.date,
    };
    getDownloadableData(data).then((value) => {
      const correctData = this.formatData(value.data);
      this.exportToExcel(correctData, data.date);
    });
  }
  formatData(apiData) {
    const formattedData = [];
    for (let data of apiData) {
      const customerName = data.customerName.map(({ name }) => name).join(",");
      const mrName = data.mrName.map(({ name }) => name).join(",");
      const distributorName = data.distributorName
        .map(({ name }) => name)
        .join("");
      formattedData.push({
        Sr: apiData.findIndex((value) => data == value) + 1,
        Date: data.date,
        "Distributor Name": distributorName,
        "MR Name": mrName,
        "Customer Name": customerName,
        place: data.place,
        map: `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`,
      });
    }
    return formattedData;
  }
  exportToExcel(apiData, fileName) {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + ".xlsx");
  }

  render() {
    const { pageSize, pageCount, data } = this.props;
    const { currentPage } = this.state;

    let pageNumbers = [];
    for (let i = 0; i < pageCount; i++) {
      pageNumbers.push(
        <PaginationItem key={i} active={currentPage === i ? true : false}>
          <PaginationLink onClick={(e) => this.handleClick(e, i)} href="#">
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return (
      <React.Fragment>
        <Table size="sm" striped>
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Date</th>
              <th>Visits</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {
            data.slice(
                currentPage * pageSize,
                (currentPage + 1) * pageSize
              ).map((value, i) => (
              <tr className="data-slice" key={i}>
                <td>{ parseInt(value.index) + 1}</td>
                <td>{value.date}</td>
                <td>{value.visits}</td>
                <td className="d-flex justify-content-center">
                  <Button
                    size="sm"
                    color="primary"
                    className="m-0"
                    id={value.index}
                    onClick={() => this.downloadHanlder(value)}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <React.Fragment>
          <Pagination aria-label="Page navigation example">
            <PaginationItem>
              <PaginationLink
                onClick={(e) => this.handleClick(e, currentPage - 1)}
                previous
                href="#"
              />
            </PaginationItem>
            {pageNumbers}

            <PaginationItem disabled={currentPage >= pageCount - 1}>
              <PaginationLink
                onClick={(e) => this.handleClick(e, currentPage + 1)}
                next
                href="#"
              />
            </PaginationItem>
          </Pagination>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default TestPagination;
