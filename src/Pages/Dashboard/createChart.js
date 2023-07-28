import { CheckBox, Download } from "@mui/icons-material";
import {
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "reactstrap";

import Breadcrumbs, { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import Loader from "../../components/Common/loader";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import MaterialTable from "../Tables/Table";
import {
  Columns,
  deepKeys,
  flattenObj,
  getFields,
  hidencolumn,
} from "../ulit/commonFunction";
import ExportCSV from "../ulit/exportCSV";

const CreateChart = ({ dashboardId, updateFun }) => {
  const [reportList, setReportList] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [checkbox, setCheckbox] = useState([]);
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [chartData, setChartData] = useState([]);
  const [reportTitle, setReportTitle] = useState("");
  const [loader, setLoader] = useState(false);
  const [switchCSVData, setSwitchCSVData] = useState(false);
  const [CSVDataList, setCSVDataList] = useState([]);
  const [chartTitle, setChartTitle] = useState({
    charttitle: "",
    chartType: "Bar Chart",
  });
  const [tableId, setTableId] = useState("");
  const [tableData, setTableData] = useState([]);
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
    const userReport = localStorage.getItem("report");
    var userReportData = userReport ? JSON.parse(userReport) : [];
    setReportList(userReportData);
    getCSVDataList({ user_id: userInfo._id, dbName: userInfo.dbName });
  }, []);

  useEffect(() => {
    setCheckbox([]);
    setReportData([]);
    setChartData([]);
    setTableData([]);
  }, [dashboardId]);
  // ############################################ get report data ########################################

  const HandleReportChange = async (event) => {
    setOpenLoader(true);
    let payload = {
      info: { dbName: userData.dbName },
      data: { report_id: event.target.value, user_id: userData.user_id },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.GetReportData
    );
    if (response) {
      setReportData(response?.data);
    }
    // setCheckbox([]);
    setChartTitle({ charttitle: "", chartType: "" });
    setOpenLoader(false);
  };
  // ############################################ data for report  ########################################

  const getTableData = () => {
    reportData
      .filter((id) => id._id === tableId)
      .map((data) => setTableData(data.data) + setReportTitle(data.title));
  };

  var keys = tableData && Array.from(deepKeys(tableData[0]));
  var columns = tableData && Columns(keys);
  // tableData &&
  // keys.map((name) => ({
  //   accessorKey: name,
  //   header: name,
  // }));

  const hidecolumn = keys && hidencolumn(keys);
  // ############################################ handek checkbox ########################################

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setCheckbox((prev) => [...prev, e.target.value]);
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
    // setChartData(datafilter);
  };
  // ############################################ get csv data list ########################################

  const getCSVDataList = async ({ dbName, user_id }) => {
    setOpenLoader(true);
    let payload = {
      dbName: dbName,
      user_id: user_id,
    };
    const response = await ApiServices("post", payload, ApiEndPoints.FileList);

    setCSVDataList(response?.data);
    setOpenLoader(false);
  };
  // ############################################ get csv data list ########################################

  const getCSVData = async (event) => {
    const id = event.target.value;
    const document_name =
      event.target.options[event.target.selectedIndex].dataset.additionalData;
    setOpenLoader(true);
    let payload = {
      dbName: userData.dbName,
      user_id: userData.user_id,
      _id: id,
      document_name: document_name,
    };
    const response = await ApiServices("post", payload, ApiEndPoints.FileGet);
    if (response.data) {
      setTableData(response.data[0]?.data);
    }
    toast(response.msg, { autoClose: 2000 });
    setOpenLoader(false);
  };

  // ############################################ handek checkbox ########################################

  const createChart = async (item) => {
    setOpenLoader(true);

    let payload = {
      info: {
        dbName: userData.dbName,
        dashboard_id: dashboardId,
        user_id: userData.user_id,
        type: chartTitle.chartType,
        title: chartTitle.charttitle,
        column: checkbox,
      },
      data: { data: tableData },
    };
    const respons = await ApiServices(
      "post",
      payload,
      ApiEndPoints.AddDashboardData
    );
    toast(respons.msg);
    setCheckbox([]);
    setChartTitle({ charttitle: "", chartType: "Bar Chart" });
    updateFun(dashboardId);
    setOpenLoader(false);
  };

  return (
    <React.Fragment>
      <Loader load={loader} />
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <Row>
                <Col sm={4}>
                  <div className="mt-4 mt-lg-0">
                    <div className="form-check form-switch form-switch-md mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="customSwitchsizemd"
                        onChange={() => {
                          setSwitchCSVData(!switchCSVData);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customSwitchsizemd"
                      >
                        Get CSV Data
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
              <form action="javascript:void(0)" onSubmit={getTableData}>
                {!switchCSVData && (
                  <Row>
                    <Col md={6}>
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          id="floatingSelectGrid"
                          aria-label="Floating label select example"
                          onChange={HandleReportChange}
                        >
                          <option value="">Select Report</option>
                          {reportList &&
                            reportList.map((item, index) => (
                              <option value={item._id}>
                                {index + 1 + "  "}
                                {item.reportName}
                              </option>
                            ))}
                        </select>
                        <label htmlFor="floatingSelectGrid">
                          Select Report
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
                            setTableId(e.target.value);
                          }}
                        >
                          <option value="">Select Table</option>
                          {reportData &&
                            reportData.map((i) => (
                              <option value={i._id}>{i.title}</option>
                            ))}
                        </select>
                        <label htmlFor="floatingSelectGrid">Select Table</label>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div>
                        <button type="submit" className="btn btn-primary w-md">
                          Submit
                        </button>
                      </div>
                    </Col>
                  </Row>
                )}
              </form>
              {switchCSVData && (
                <Row>
                  <Col md={6}>
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="floatingSelectGrid"
                        aria-label="Floating label select example"
                        onChange={getCSVData}
                      >
                        <option value="">Select Table</option>
                        {CSVDataList &&
                          CSVDataList.map((i) => (
                            <option
                              value={i._id}
                              data-additional-data={i.document_name}
                            >
                              {i.document_name}
                            </option>
                          ))}
                      </select>
                      <label htmlFor="floatingSelectGrid">Select Table</label>
                    </div>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {tableData.length > 0 && keys.length > 0 && (
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <form action="javascript:void(0)" onSubmit={createChart}>
                  <Row>
                    <Col md={6}>
                      <Card>
                        <CardBody>
                          <h4 className="mb-0 pb-0 font-size-18">
                            Select Columns{" "}
                          </h4>
                          <p>Select Columns for Create the new chart</p>
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
                                        checked={checkbox.find((e) => e === i)}
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
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <div className="form-floating mb-3">
                        <select
                          className="form-select"
                          id="floatingSelectGrid"
                          aria-label="Select Chart Type"
                          value={chartTitle.chartType}
                          onChange={(e) => {
                            setChartTitle((prev) => ({
                              ...prev,
                              chartType: e.target.value,
                            }));
                          }}
                        >
                          {chartList &&
                            chartList.map((i) => (
                              <option value={i}>{i}</option>
                            ))}
                        </select>
                        <label htmlFor="floatingSelectGrid">
                          Select Chart Type
                        </label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingFirstnameInput"
                          placeholder="Enter Chart Title"
                          value={chartTitle.charttitle}
                          onChange={(e) => {
                            setChartTitle((prev) => ({
                              ...prev,
                              charttitle: e.target.value,
                            }));
                          }}
                        />
                        <label htmlFor="floatingFirstnameInput">
                          Enter Chart Title
                        </label>
                      </div>
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
      )}
      {tableData.length > 0 && (
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <Breadcrumbsub
                  title={reportTitle}
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
                        <ExportCSV data={tableData} title={reportTitle} />
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
      )}
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

export default CreateChart;
const chartList = [
  "Bar Chart",
  "Bar Chart with group",
  // "Line Chart",
  "Doughnut chart",
  "Pie Chart",
  // "Radial Chart",
  "Table",
  "Table Chart",
  "Table Cluster",
];
