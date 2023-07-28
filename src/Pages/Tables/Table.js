import React, { useMemo, useState } from "react";

import {
  Container,
  Col,
  Row,
  CardBody,
  CardTitle,
  Card,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Table,
} from "reactstrap";
import MaterialReactTable from "material-react-table";
import { Download } from "@mui/icons-material";

import { CSVLink } from "react-csv";

//Import Breadcrumb
import Breadcrumbs, { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import { Columns, deepKeys } from "../ulit/commonFunction";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Tbody, Th, Thead, Tr } from "react-super-responsive-table";

const MaterialTable = ({
  data,
  columns,
  hidecolumn,
  title,
  enableExpanding,
  ExpandingColumn,
}) => {
  //   document.title = "Report | trend micro unity";
  const [btnprimary1, setBtnprimary1] = useState(false);

  //should be memoized or stable

  return (
    <React.Fragment>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowSelection
        enableColumnResizing
        enableGrouping
        enableRowVirtualization
        columnResizeMode="onChange"
        enableColumnOrdering
        initialState={{ columnVisibility: hidecolumn }}
        enableExpanding={enableExpanding}
        muiTableBodyProps={{
          sx: {
            //stripe the rows, make odd rows a darker color
            "& tr:nth-of-type(odd)": {
              backgroundColor: "#fff",
            },
          },
        }}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div>
              <ExportCSV data={data} title={title} />
            </div>
          );
        }}
      />
    </React.Fragment>
  );
};

const MaterialTableBasic = ({ data }) => {
  const keys = Array.from(deepKeys(data && data?.data[0]));
  const columns = Columns(data?.column);
  const modifiedData = data?.data.map((obj) => {
    const newObj = {};
    data.column.forEach((key) => {
      const keyParts = key.split(".");
      let value = obj;
      keyParts.forEach((part) => {
        value = value[part];
      });
      newObj[key] = value;
    });
    return newObj;
  });
  return (
    <React.Fragment>
      <MaterialTable
        data={data.data}
        columns={columns}

        // hidecolumn={hidecolumn}
      />
    </React.Fragment>
  );
};

export default MaterialTable;
export { MaterialTableBasic };

const ExportCSV = ({ data, title }) => {
  const headerKeys = Array.from(deepKeys(data && data[0]));
  const mainHeader =
    headerKeys && headerKeys.map((name) => ({ label: name, key: name }));
  return (
    <CSVLink headers={mainHeader} data={data} filename={title}>
      <Tooltip title="Download CSV">
        <IconButton>
          <Download />
        </IconButton>
      </Tooltip>
      {/* <DropdownItem>Export CSV</DropdownItem> */}
    </CSVLink>
  );
};
