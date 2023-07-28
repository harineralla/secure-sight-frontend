import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
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

const CreateReport = () => {
    document.title = "create report | trend micro unity";

    const [openLoader, setOpenLoader] = React.useState(false);
    const [reportName, setReportName] = useState("");
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
    }, []);
    //   #################################### create report ##############################################
    const Submit = async () => {
        setOpenLoader(true);
        let payload = {
            info: { dbName: userData.dbName },
            data: { reportName: reportName, user_id: userData.user_id },
        };
        const response = await ApiServices(
            "post",
            payload,
            ApiEndPoints.CreateReport
        );
        toast(response.msg, { autoClose: 2000 });
        if (response) {
            ReportList({
                dbName: userData.dbName,
                userId: userData.user_id,
                reload: true,
            });
            window.location.reload();
        }
        setOpenLoader(false);
    };

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Report" breadcrumbItem="Create Report" />
                    <br />

                    <Row>
                        <Col xl={2}> </Col>
                        <Col xl={8}>
                            <Card>
                                <CardBody>
                                    <h5 className="card-title">Create Report</h5>
                                    <p className="card-title-desc"></p>
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
                                                        value={reportName}
                                                        onChange={(e) => {
                                                            setReportName(e.target.value);
                                                        }}
                                                    />
                                                    <label htmlFor="floatingFirstnameInput">
                                                        Report Name
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                        <br />
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={!reportName}
                                                className="btn btn-primary w-md"
                                            >
                                                Create Report
                                            </button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
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

export default CreateReport;
