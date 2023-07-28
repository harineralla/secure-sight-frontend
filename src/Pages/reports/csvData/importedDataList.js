import React, { useEffect, useState } from "react";

import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

//Import Breadcrumb
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material"; 
import Breadcrumbs, {
  Breadcrumbsub,
} from "../../../components/Common/Breadcrumb";
import { DashboardList, ReportList } from "../../ulit/dashboardlist";
import ApiServices from "../../../Network_call/apiservices";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";
import DeleteModal from "../../../components/Common/DeleteModal";

const CSVDataList = () => {
  document.title = "CSV Data | trend micro unity";
  const [csvList, setCSVList] = useState([]);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [reportsName, setReportName] = useState("");
  const [searchedVal, setSearchedVal] = useState("");
  const [csvDataId, setCSVDataId] = useState("");
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
    getCSVData({ user_id: userInfo._id, dbName: userInfo.dbName });
  }, []);

  // ####################################delete dashboard ####################################
  const DeleteAlert = (item) => {
    setCSVDataId(item);
    setDeleteModal(true);
  };
  const DeleteCSVData = async () => {
    setOpenLoader(true);
    let payload = {
      dbName: userData.dbName,
      user_id: userData.user_id,
      _id: csvDataId,
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.FileDelete
    );
    setDeleteModal(false);
    toast(response.msg, { autoClose: 2000 });
    getCSVData({ user_id: userData.user_id, dbName: userData.dbName });
    setOpenLoader(false);
  };
  // ####################################delete dashboard ####################################
  const getCSVData = async ({ dbName, user_id }) => {
    setOpenLoader(true);
    let payload = {
      dbName: dbName,
      user_id: user_id,
    };
    const response = await ApiServices("post", payload, ApiEndPoints.FileList);

    setCSVList(response?.data);
    setOpenLoader(false);
  };
  // #################################### edit report ####################################

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <div className="container-fluid">
          <DeleteModal
            show={deleteModal}
            onDeleteClick={DeleteCSVData}
            onCloseClick={() => setDeleteModal(false)}
          />

          <Breadcrumbs title="Report" breadcrumbItem="List" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div>
                    <Breadcrumbsub
                      title="Report List"
                      breadcrumbItem={
                        <div className="input-group">
                          <button
                            onClick={() => {
                              setSearchedVal("");
                            }}
                            className="input-group-text"
                          >
                            <CloseOutlined />
                          </button>
                          <input
                            type="text"
                            className="form-control"
                            id="autoSizingInputGroup"
                            placeholder="Search"
                            value={searchedVal}
                            onChange={(e) => {
                              setSearchedVal(e.target.value);
                            }}
                          />
                        </div>
                      }
                    />
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>File Name</th>
                          <th>Created Date</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {csvList &&
                          csvList
                            .filter(
                              (x) =>
                                !searchedVal.length ||
                                x.document_name

                                  .toString()
                                  .toLowerCase()
                                  .includes(
                                    searchedVal.toString().toLowerCase()
                                  ) ||
                                x.document_name
                                  .toString()
                                  .toLowerCase()
                                  .includes(
                                    searchedVal.toString().toLowerCase()
                                  )
                            )
                            .map((item, index) => (
                              <tr>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  <Link
                                    to={`/csv-data/test?document_name=${item.document_name}&_id=${item._id}`}
                                  >
                                    {item.document_name}
                                  </Link>
                                </td>

                                <td>{item.created_at}</td>

                                <td>
                                  {/* <button
                                    onClick={() => {
                                      OpenEditModel({
                                        id: item._id,
                                        name: item.document_name,
                                      });
                                    }}
                                    type="button"
                                    className="btn  noti-icon  m-0 p-0    "
                                  >
                                    <i className="mdi mdi-playlist-edit"></i>
                                  </button> */}
                                  {/* <button
                                    onClick={() => {
                                      DeleteAlert(item._id);
                                    }}
                                    type="button"
                                    className="btn  noti-icon  m-0 p-0    "
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button> */}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>{" "}
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

export default CSVDataList;
