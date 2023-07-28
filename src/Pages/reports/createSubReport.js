import { Download } from "@mui/icons-material";
import { Backdrop, Box, CircularProgress, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "reactstrap";
import Breadcrumbs, { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import MaterialTable from "../Tables/Table";
import {
  Columns,
  allReplace,
  deepKeys,
  flattenObj,
  formatCapilize,
  getFields,
  hidencolumn,
} from "../ulit/commonFunction";
import ExportCSV from "../ulit/exportCSV";

const CreateSubReport = ({ reportId, GetReportData }) => {
  const theme = useTheme();
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [connectorList, setConnectorList] = useState([]);
  const [indexList, setIndexList] = useState([]);
  const [checkbox, setCheckbox] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportTitle, setReportTitle] = useState("");
  const [indexName, setIndexName] = useState("");
  const [filterIndexName, setFilterIndexName] = useState("");
  const [filterColumnValue, setFilterColumnValue] = useState("");
  const [dataModal, setDataModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [hour, setHour] = useState(0);
  const [userData, setUserData] = React.useState({
    email: "",
    dbName: "",
    user_id: "",
  });
  useEffect(() => {
    let userObject = localStorage.getItem("authUser");
    var userInfo = userObject ? JSON.parse(userObject) : "";
    setUserData(() => ({
      email: userInfo.email,
      dbName: userInfo.dbName,
      user_id: userInfo._id,
    }));
    connectorData(userInfo.dbName);
  }, []);

  // ############################################ get report data ########################################
  const HandleConnectorChange = async (event) => {
    setOpenLoader(true);
    setIndexList([]);
    setIndexName("");
    let payload = { name: allReplace(event.target.value, { _: "-" }) };
    const response = await ApiServices(
      "POST",
      payload,
      ApiEndPoints.ElasticIndexList
    );
    if (response) {
      setIndexList(response);
    }
    setReportTitle("");
    setOpenLoader(false);
  };

  // ############################################ connector list  ########################################
  const connectorData = async (item) => {
    setOpenLoader(true);
    const payload = {
      headers: { "Access-Control-Allow-Origin": "*" },
      info: { dbName: item },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.ConectoreList
    );
    setConnectorList(response);
    setOpenLoader(false);
  };
  // ############################################ data for report  ########################################
  function getAllKeys(data) {
    const keys = [];

    function collectKeys(obj, prefix = "") {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          collectKeys(item, `${prefix}[${index}]`);
        });
      } else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
          const newPrefix = prefix ? `${prefix}.${key}` : key;
          collectKeys(obj[key], newPrefix);
        });
      } else {
        keys.push(prefix);
      }
    }

    collectKeys(data);
    return keys;
  }
  var keys = tableData && Array.from(deepKeys(tableData[0]));
  var columns = tableData && Columns(keys);
  // keys.map((name) => ({
  //   accessorKey: name,
  //   header: name,

  //   Cell: ({ cell }) =>
  //     name == "Risk" || name == "severity" || name == "risk-level" ? (
  //       <Box
  //         component="span"
  //         sx={(theme) => ({
  //           backgroundColor:
  //             cell.getValue() == "High" || cell.getValue() == "high"
  //               ? theme.palette.error.dark
  //               : cell.getValue() == "low" || cell.getValue() == "Low"
  //               ? theme.palette.warning.dark
  //               : cell.getValue() == "Medium" || cell.getValue() == "medium"
  //               ? theme.palette.warning.dark
  //               : cell.getValue() == "critical" ||
  //                 cell.getValue() == "Critical"
  //               ? theme.palette.success.dark
  //               : "",
  //           borderRadius: "0.25rem",
  //           // color: "#fff",
  //           maxWidth: "9ch",
  //           p: "0.25rem",
  //         })}
  //       >
  //         {cell.getValue()?.toLocaleString?.("", {
  //           style: "currency",
  //           currency: "USD",
  //           minimumFractionDigits: 0,
  //           maximumFractionDigits: 0,
  //         })}
  //       </Box>
  //     ) : (
  //       cell.getValue()
  //     ),
  // }));

  const hidecolumn = keys && hidencolumn(keys);
  // ############################################ handek checkbox ########################################

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setCheckbox((prev) => [
        ...prev,
        allReplace(e.target.value, { "_source.": "" }),
      ]);
    } else {
      setCheckbox(checkbox.filter((item) => item !== e.target.value));
    }
  };

  useEffect(() => {
    postData();
  }, [checkbox]);
  const postData = () => {
    const flatData = tableData && tableData.map((i) => flattenObj(i));
    const datafilter = checkbox.map((item, index) => getFields(flatData, item));
    setReportData(datafilter);
  };
  // ############################################ FilterData  ########################################

  const filterColumnChange = (e) => {
    setFilterIndexName(e.target.value);
  };

  const FilterData = async ({ clear }) => {
    const dateNow = new Date();
    const thirtyMinutesAgo = new Date(
      dateNow.getTime() - `${hour * 60 * 1000}`
    );
    const datetimeString = thirtyMinutesAgo.toISOString().slice(0, -1);
    setOpenLoader(true);
    setTableData([]);
    const search = { [filterIndexName]: filterColumnValue };

    let payload = {
      index: indexName,
      column: clear ? checkbox : [],
      curruntTime: dateNow.toISOString().slice(0, -1),
      lessTime: datetimeString,
    };
    let payloadsearch = {
      index: indexName,
      column: checkbox,
      search,
      curruntTime: dateNow.toISOString(),
      lessTime: datetimeString,
    };

    const response = await ApiServices(
      "post",
      filterColumnValue ? payloadsearch : payload,
      ApiEndPoints.SearchData
    );
    toast(response.msg);
    setTableData(response);
    setOpenLoader(false);
    setCheckbox([]);
    setFilterColumnValue("");
  };
  // ############################################ post report data ########################################

  const ceateReport = async () => {
    setOpenLoader(true);
    let payload = {
      info: {
        dbName: userData.dbName,
        report_id: reportId,
        user_id: userData.user_id,
        title: reportTitle,
        column: checkbox,
        headerName: checkbox,
      },
      data: { data: tableData, column: checkbox },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.AddReportData
    );
    toast(response.msg);
    GetReportData(reportId);
    setCheckbox([]);
    setReportTitle("");
    setOpenLoader(false);
  };
  const ImportCSVData = () => {};
  const onFileLoad = (data) => {
    setTableData(data);
    setDataModal(false);
  };
  return (
    <React.Fragment>
      {/* <ImportCSVDataModals
        title="Import CSV Data"
        show={dataModal}
        onCloseClick={() => setDataModal(false)}
        onFileLoad={onFileLoad}
      /> */}
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <form
                action="javascript:void(0)"
                onSubmit={() => {
                  FilterData({ clear: true });
                }}
              >
                <Row>
                  <Col md={6}>
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="floatingSelectGrid"
                        aria-label="Floating label select example"
                        onChange={HandleConnectorChange}
                      >
                        <option value="">Select Report</option>
                        {connectorList &&
                          connectorList.map((item, index) => (
                            <option value={item.display_name}>
                              {index + 1 + "  "}
                              {formatCapilize(
                                allReplace(item.display_name, {
                                  _: " ",
                                  "-": " ",
                                })
                              )}
                            </option>
                          ))}
                      </select>
                      <label htmlFor="floatingSelectGrid">
                        Select Connector
                      </label>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="floatingSelectGrid"
                        aria-label="Floating label select example"
                        onChange={(e) => {
                          setIndexName(e.target.value);
                        }}
                      >
                        <option value="">Select Table</option>
                        {indexList &&
                          indexList.map((i) => <option value={i}>{i}</option>)}
                      </select>
                      <label htmlFor="floatingSelectGrid">Select Index</label>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="floatingSelectGrid"
                        aria-label="Floating label select example"
                        onChange={(e) => {
                          setHour(e.target.value);
                        }}
                      >
                        <option value="">Select Time</option>
                        {hourData &&
                          hourData.map((i) => (
                            <option value={i.value}>{i.lable}</option>
                          ))}
                      </select>
                      <label htmlFor="floatingSelectGrid">Select Time</label>
                    </div>
                  </Col>{" "}
                  <Col md={6}>
                    <div>
                      <button type="submit" className="btn btn-primary w-md">
                        Submit
                      </button>
                    </div>
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {tableData.length > 0 && keys.length > 0 && (
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <form action="javascript:void(0)">
                  <Row>
                    <Col md={6}>
                      <Card>
                        <CardBody>
                          <h4 className="mb-0 pb-0 font-size-18">
                            Select Columns{" "}
                          </h4>
                          <p>Select Columns for Create the new Report</p>
                          <ul
                            className="message-list mb-0 maxh-3"
                            style={{
                              maxHeight: "500px",
                              overflow: "scroll",
                              scrollbarWidth: "0 !impotent",
                            }}
                          >
                            {keys &&
                              keys.map((i) => (
                                <li>
                                  <span className="col-mail-1">
                                    <span className="checkbox-wrapper-mail">
                                      <input
                                        type="checkbox"
                                        id={i}
                                        value={i}
                                        onChange={handleCheckboxChange}
                                      />
                                      <label
                                        htmlFor={i}
                                        className="toggle"
                                      ></label>
                                    </span>
                                  </span>

                                  <option value={i}>{i}</option>
                                </li>
                              ))}
                          </ul>
                          <br />
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingFirstnameInput"
                          placeholder="Enter Chart Title"
                          value={reportTitle}
                          onChange={(e) => {
                            setReportTitle(e.target.value);
                          }}
                        />
                        <label htmlFor="floatingFirstnameInput">
                          Enter Report Title
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          id="floatingSelectGrid"
                          aria-label="Floating label select example"
                          onChange={filterColumnChange}
                        >
                          <option value="">Select Filter Column</option>
                          {keys &&
                            keys.map((i) => <option value={i}>{i}</option>)}
                        </select>
                        <label htmlFor="floatingSelectGrid">Select Index</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingFirstnameInput"
                          placeholder="Enter Chart Title"
                          value={filterColumnValue}
                          onChange={(e) => {
                            setFilterColumnValue(e.target.value);
                          }}
                        />
                        <label htmlFor="floatingFirstnameInput">
                          Enter Filter Value
                        </label>
                      </div>

                      <div>
                        <Breadcrumbsub
                          title={
                            <button
                              onClick={() => {
                                FilterData({ clear: true });
                              }}
                              className="btn btn-primary w-md"
                            >
                              Filter Data
                            </button>
                          }
                          breadcrumbItem={
                            <button
                              onClick={ceateReport}
                              className="btn btn-primary w-md"
                            >
                              Create Report
                            </button>
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
      {tableData.length > 0 && (
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <Breadcrumbsub
                  title={indexName}
                  breadcrumbItem={
                    <Dropdown
                      isOpen={btnprimary1}
                      toggle={() => setBtnprimary1(!btnprimary1)}
                    >
                      <DropdownToggle tag="button" className="btn ">
                        <Download />
                      </DropdownToggle>
                      <DropdownMenu>
                        {/* <DropdownItem>fgfdgdg</DropdownItem> */}
                        <ExportCSV data={tableData} title={indexName} />
                      </DropdownMenu>
                    </Dropdown>
                  }
                />
                <MaterialTable
                  data={tableData}
                  columns={columns}
                  hidecolumn={hidecolumn}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}{" "}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoader}
        onClick={() => setOpenLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default CreateSubReport;
const hourData = [
  { lable: "Last 5 min Data", value: 5 },
  { lable: "Last 10 min Data", value: 10 },
  { lable: "Last 30 min Data", value: 30 },
  { lable: "Last 60 min Data", value: 60 },
  { lable: "Last 5 hour Data", value: 300 },
  { lable: "Last 12 hour Data", value: 600 },
  { lable: "Last 1 day Data", value: 1200 },
  { lable: "Last 5 day Data", value: 6000 },
  { lable: "Last 10 day Data", value: 12000 },
  { lable: "Last 30 day Data", value: 36000 },
];
