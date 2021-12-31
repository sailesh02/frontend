import React, { useState } from "react";
// import "./App.css";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

class BulkImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      data : []
    };
  }

readUploadFile = (e) => {
  var file = e.target.files[0];
  this.setState({ file });
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log(json);
            this.setState({
              data:json
            })
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
}
 exportToCSV = (apiData, fileName) => {
  const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(apiData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

  render() {
    return (
      // <div>
      //   <input
      //     type="file"
      //     id="file"
      //     ref="fileUploader"
      //     onChange={this.filePathset.bind(this)}
      //   />
      //   <button
      //     onClick={() => {
      //       this.readFile();
      //     }}
      //   >
      //     Read File
      //   </button>
      // </div>
      <form>
    <label htmlFor="upload">Upload File</label>
    <input
        type="file"
        name="upload"
        id="upload"
        onChange={this.readUploadFile}
    />
    <div className="App">
    <button onClick={(e) => this.exportToCSV(this.state.data, 'fileName')}>Export</button>
    </div>
</form>

    );
  }
}

export default BulkImport;