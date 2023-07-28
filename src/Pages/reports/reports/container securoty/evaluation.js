import React, { useEffect, useState } from "react";

import { Row, Col, Card, CardBody } from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Backdrop, CircularProgress, IconButton } from "@mui/material";
import ApiEndPoints from "../../../../Network_call/ApiEndPoints";
import ApiServices from "../../../../Network_call/apiservices";
import Breadcrumbs, {
  Breadcrumbsub,
} from "../../../../components/Common/Breadcrumb";
import MaterialTable from "../../../Tables/Table";
import { Columns, deepKeys } from "../../../ulit/commonFunction";
import { Refresh } from "@mui/icons-material";
import { timedata } from "../../../ulit/timeforGertData";

const Evaluation = () => {
  document.title = "Report | trend micro unity";
  const [openLoader, setOpenLoader] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    getEvaluationData();
  }, []);
  React.useEffect(() => {
    getEvaluationData();
  }, [time]);

  const dateNow = new Date();
  const lessTime = new Date(dateNow.getTime() - time)
    .toISOString()
    .slice(0, -1);


  const getEvaluationData = async () => {
    setOpenLoader(true);
    const payload = {
      curruntTime: dateNow.toISOString(),
      lessTime: lessTime,
    };
    const response = await ApiServices(
      "post",
      time > 0 ? payload : "",
      ApiEndPoints.ContainerEvaluation
    );
    setData(response);
    setOpenLoader(false);
    // toast(response.msg, { autoClose: 2000 });
  };
  const key = Array.from(deepKeys(data.length > 0 && data[0]));
  const columns = Columns(key);
  return (
    <React.Fragment>
      <ToastContainer />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Container Security" breadcrumbItem="Evaluation" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Breadcrumbsub
                    title="Container Security Evaluation"
                    breadcrumbItem={
                      
                        <div className="d-flex">
                        <select
                          className="form-select"
                          id="floatingSelectGrid"
                          aria-label="Floating label select example"
                          onChange={(e) => {
                            setTime(e.target.value);
                          }}
                        >
                          <option value="">Select Time</option>
                          {timedata &&
                            timedata.map((i) => (
                              <option value={i.value}>{i.lable}</option>
                            ))}
                        </select>
                        {/* <label htmlFor="floatingSelectGrid">Select Time</label> */}
                        <button
                          type="button"
                          className="btn btn-success btn-lg ms-2 w-sm"
                          onClick={getEvaluationData}
                        >
                          <Refresh color="inherit" />
                        </button>
                      </div>
                    }
                  />
                  {data.length > 0 && (
                    <MaterialTable columns={columns} data={data} title="Container Security Evaluation" />
                  )}
                  {data.length === 0 && <div>Data Not Found!</div>}
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

export default Evaluation;
