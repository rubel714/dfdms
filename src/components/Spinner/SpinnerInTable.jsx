import React from "react";
import "./Spinner.styles.css";
import Spinner from "./Spinner";

const SpinnerInTable = ({colsLength}) => {
  return (
    <tr>
      <td colSpan={colsLength} style={{ backgroundColor: "#d2c5b4" }}>
        <Spinner />
      </td>
    </tr>
  );
};

export default SpinnerInTable;
