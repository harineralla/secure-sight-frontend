import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  Container,
  Label,
  Input,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { DashboardList, ReportList } from "../ulit/dashboardlist";

const CreateDashboard = () => {
  document.title = "create dashboard | trend micro unity";

  const [dashboardName, setDashboardName] = useState("");
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
  }, []);
  //   #################################### create dashboard ##############################################
  const Submit = async () => {
    let payload = {
      info: { dbName: userData.dbName },
      data: { dashboardName: dashboardName, user_id: userData.user_id },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.UserCreateDashboard
    );
    if (response) {
      toast(response.msg, { autoClose: 2000 });
      DashboardList({
        dbName: userData.dbName,
        userId: userData.user_id,
        reload: true,
      });
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Create Dashboard" />
          <br />
          <Row>
            <Col xl={2}></Col>
            <Col xl={8}>
              <Card>
                <CardBody>
                  <h5 className="card-title">Create Dashboard</h5>
                  {/* <p className="card-title-desc">
                    Create Dashboard for create the chart on the data
                  </p> */}
                  <br />

                  <form action="javascript:void(0)" onSubmit={Submit}>
                    <Row>
                      <Col md={12}>
                        <div className="form-floating mb-3 fullwidth">
                          <input
                            type="text"
                            className="form-control"
                            id="floatingFirstnameInput"
                            placeholder="Enter Your First Name"
                            value={dashboardName}
                            onChange={(e) => {
                              setDashboardName(e.target.value);
                            }}
                          />
                          <label htmlFor="floatingFirstnameInput">
                            Dashboard Name
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <div>
                      <button
                        type="submit"
                        disabled={!dashboardName}
                        className="btn btn-primary w-md"
                      >
                        Create Dashboard
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateDashboard;
