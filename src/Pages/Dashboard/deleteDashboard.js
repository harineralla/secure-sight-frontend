import React, { useEffect, useState } from "react";

import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

//Import Breadcrumb
import Breadcrumbs, { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { DashboardList, ReportList } from "../ulit/dashboardlist";

import EditModals from "../../components/Common/editModel";
import { Link } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import DeleteModal from "../../components/Common/DeleteModal";

const DeleteDashboard = () => {
  document.title = "Dashboard | trend micro unity";
  const [dashboardList, setDadhboardList] = useState([]);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [searchedVal, setSearchedVal] = useState("");
  const [dashboardId, setDashboardId] = useState("");
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
    ReportList({
      dbName: userInfo.dbName,
      userId: userInfo._id,
      reload: false,
    });
    DashboardList({
      dbName: userInfo.dbName,
      userId: userInfo._id,
      reload: false,
    });
    const userDashboard = localStorage.getItem("dashboard");
    var userDashboardData = userDashboard ? JSON.parse(userDashboard) : [];
    setDadhboardList(userDashboardData);
  }, []);

  // ####################################delete dashboard ####################################
  const DeleteAlert = (item) => {
    setDashboardId(item);
    setDeleteModal(true);
  };
  const DeleteDashboard = async () => {
    setOpenLoader(true);
    let payload = {
      dbName: userData.dbName,
      user_id: userData.user_id,
      id: dashboardId,
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.DeleteDashboard
    );

    toast(response.msg, { autoClose: 2000 });
    DashboardList({
      dbName: userData.dbName,
      userId: userData.user_id,
      reload: true,
    });
    setDeleteModal(false);
    setOpenLoader(false);
  };
  // #################################### edit dashboard ####################################
  const OpenEditModel = ({ id, name }) => {
    setDashboardId(id);
    setDashboardName(name);
    setEditModal(true);
  };
  const onchange = (e) => {
    setDashboardName(e.target.value);
  };
  const UpdateDashboard = async () => {
    setOpenLoader(true);
    let payload = {
      info: {
        dbName: userData.dbName,
        user_id: userData.user_id,
        dashboard_id: dashboardId,
      },
      data: { dashboardName: dashboardName },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.UpdateDashboard
    );
    if (response) {
      toast(response.msg, { autoClose: 2000 });
      DashboardList({
        dbName: userData.dbName,
        userId: userData.user_id,
        reload: true,
      });
    }
    setEditModal(false);
    setOpenLoader(false);
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={DeleteDashboard}
        onCloseClick={() => setDeleteModal(false)}
      />
      <EditModals
        title="Edit Dashboard Title"
        show={editModal}
        onCloseClick={() => setEditModal(false)}
        onClick={UpdateDashboard}
        value={dashboardName}
        onInputChange={onchange}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Dashboard" breadcrumbItem="List" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div>
                    <Breadcrumbsub
                      title="Dashboard List"
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
                          <th>Dashboard Name</th>

                          <th>Created Date</th>
                          <th>Updated Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardList &&
                          dashboardList
                            .filter(
                              (x) =>
                                !searchedVal.length ||
                                x.dashboardName
                                  .toString()
                                  .toLowerCase()
                                  .includes(
                                    searchedVal.toString().toLowerCase()
                                  ) ||
                                x.created_at
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
                                  <Link to={"/dashboard/" + item.dashboardName}>
                                    {" "}
                                    {item.dashboardName}{" "}
                                  </Link>
                                </td>

                                <td>{item.created_at}</td>
                                <td>{item.updated_at}</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      OpenEditModel({
                                        id: item._id,
                                        name: item.dashboardName,
                                      });
                                    }}
                                    type="button"
                                    className="btn  noti-icon  m-0 p-0    "
                                  >
                                    <i className="mdi mdi-playlist-edit"></i>
                                  </button>
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
      </div>
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

export default DeleteDashboard;
