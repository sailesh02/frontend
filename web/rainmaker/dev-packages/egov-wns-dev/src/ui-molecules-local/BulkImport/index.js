import React, { useState } from "react";
// import "./App.css";
import * as XLSX from "xlsx";

class BulkImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
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
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
}

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
</form>
    );
  }
}

export default BulkImport;