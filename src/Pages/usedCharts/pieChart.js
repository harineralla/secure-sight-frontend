import { MoreVert } from "@mui/icons-material";
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Card,
  CardBody,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import { flattenObj, getFields, uniqs } from "../ulit/commonFunction";

const PieChart = ({ data }) => {
  const [columns, setColumns] = useState(data.column);
  const [btnprimary1, setBtnprimary1] = useState(false);

  // const singleColumnKeys = Object.keys(uniqs(data?.data));
  // const singleColumnValues = Object.values(uniqs(data?.data));

  // const DATA = data?.data.map((item) =>
  //   item.reduce(function (a, b) {
  //     return +a + +b;
  //   })
  // );
  // const label = columns.map((item) => item);

  // const chartData = {
  //   labels: columns.length > 1 ? label : singleColumnKeys,
  //   datasets: [
  //     {
  //       data: columns.length > 1 ? DATA : singleColumnValues,
  //       backgroundColor: ["#0db4d6", "#f1b44c", "#fb4d53", "#343a40"],
  //       borderColor: ["#0db4d6", "#f1b44c", "#fb4d53", "#343a40"],
  //       hoverBackgroundColor: ["#34c38f", "#ff3d60", "#4aa3ff", "#212529"],
  //       hoverBorderColor: "#fff",
  //     },
  //   ],
  // };

  const dataFilter = data?.data.map((i) => flattenObj(i));

  const filter = data?.column.map((item, index) => getFields(dataFilter, item));
  const singleColumnKeys = Object.keys(uniqs(filter));
  const singleColumnValues = Object.values(uniqs(filter));
  const label = columns && columns.map((item) => item);

  var newCol = columns.map((item, index) => ({
    label: item,
    data: columns.length > 1 ? filter[index] : singleColumnValues,
    fill: true,
    backgroundColor: [
      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",
      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",
      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",
      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",

      "#0db4d6",
      "#f1b44c",
      "#fb4d53",
    ],
    pointRadius: 2,
    color: "#17202A",
  }));
  const chartData = {
    labels: columns.length > 1 ? filter[0] : singleColumnKeys,
    datasets: newCol,
  };
  return (
    <React.Fragment>
      <Pie width={537} height={268} data={chartData} />
    </React.Fragment>
  );
};

export default PieChart;
