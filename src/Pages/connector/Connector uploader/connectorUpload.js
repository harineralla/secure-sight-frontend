import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  Container,
  Label,
  Input,
  Form,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Dropzone from "react-dropzone";

// Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import { Link } from "react-router-dom";
import JSZip from "jszip";
import ApiServices from "../../../Network_call/apiservices";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import ConnectorList from "../connectorList";
import axios from "axios";


const chunkSize = 10000 * 1000;
const ConnectorUploader = () => {
  document.title =
    "Connector Upload | Upzet - React Admin & Dashboard Template";
  const [selectedFiles, setselectedFiles] = useState([]);
  const [connectortData, setConnectortData] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [state, setState] = useState({
    currentFile: undefined,
    previewImage: undefined,
    progress: 0,
    message: "",
    imageInfos: [],
    files: [],
    multiConnectorInfo: [],
    btnLoader: false,
    currentFileIndex: null,
    lastUploadedFileIndex: null,
    currentChunkIndex: null,
    selectedFileInfo: null,
    calculatePercentage: 0,
    totalHit: 0,
  });
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
  }, []);
  const info = { email: userData.email, dbName: userData.dbName };

  const handleAcceptedFiles = async (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
    let multiConnectorInfo = [];
    for (let file of files) {
      try {
        const response = await JSZip.loadAsync(file)
          .then(async (content) => {
            return await new Promise((resolve) => {
              content.forEach((relativePath, zipEntry) => {
                if (relativePath.split("/").includes("integration.json"))
                  resolve(content.files[zipEntry.name].async("text"));
              });
            });
          })
          .then((p) => p);
        setConnectortData([JSON.parse(response)]);

        multiConnectorInfo = [...multiConnectorInfo, JSON.parse(response)];
      } catch (err) {
        setState((prevState) => ({
          ...prevState,
          multiConnectorInfo: [],
        }));
        setConnectortData([]);

        return;
      }
    }
    setState((prevState) => ({
      ...prevState,
      multiConnectorInfo,
      files,
    }));
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const onSubmit = async () => {
    setOpenLoader(true);
    const payload = {
      info: { email: userData.email, dbName: userData.dbName },
      data: connectortData,
    };
    const response = ApiServices(
      "post",
      payload,
      ApiEndPoints.InsertMultiConnector
    );
    if (!response.error) {
      setState((prevState) => ({
        ...prevState,
        btnLoader: true,
        selectedFileInfo: state.files[state.currentFileIndex],
      }));
      if (state.currentFileIndex !== null) {
        setState((prevState) => ({ ...prevState, currentChunkIndex: 0 }));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
      }));
    }
    setselectedFiles([]);
    setConnectortData([]);
  };

  useEffect(() => {
    if (state.lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile = state.lastUploadedFileIndex === state.files.length - 1;
    const nextFileIndex = isLastFile ? null : state.currentFileIndex + 1;
    setState((prevState) => ({
      ...prevState,
      currentFileIndex: nextFileIndex,
    }));
  }, [state.lastUploadedFileIndex]);

  useEffect(() => {
    if (state.files.length > 0) {
      if (state.currentFileIndex === null) {
        setState((prevState) => ({
          ...prevState,
          currentFileIndex:
            state.lastUploadedFileIndex === null
              ? 0
              : state.lastUploadedFileIndex + 1,
        }));
      }
    }
  }, [state.files.length]);

  useEffect(() => {
    if (state.currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [state.currentChunkIndex]);

  function readAndUploadCurrentChunk() {
    const reader = new FileReader();
    const file = state.files[state.currentFileIndex];
    if (!file) {
      return;
    }
    const from = state.currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  }

  const uploadChunk = async (readerEvent) => {
    setOpenLoader(!openLoader);
    const file = state.files[state.currentFileIndex];
    const data = readerEvent.target.result;
    const params = new URLSearchParams();
    params.set("name", file.name);
    params.set("size", file.size);
    params.set("currentChunkIndex", state.currentChunkIndex);
    params.set("totalChunks", Math.ceil(file.size / chunkSize));
    params.set("email", info.email);
    params.set("dbName", info.dbName);

    let selectedConnecter = state.multiConnectorInfo[state.currentFileIndex];
    params.set("display_name", selectedConnecter.display_name);
    params.set("category", selectedConnecter.category);
    params.set("nameWithoutExtension", selectedConnecter.name);

    const headers = { "Content-Type": "application/octet-stream" };

    const response = await axios
      .post(`${ApiEndPoints.UploadConnector}${params}`, data, {
        headers,
      })
      .then((res) => res.data);
    const respFile = state.files[state.currentFileIndex];
    const filesize = state.files[state.currentFileIndex].size;
    const chunks = Math.ceil(filesize / chunkSize) - 1;
    const isLastChunk = state.currentChunkIndex === chunks;
    setOpenLoader(false);
    toast("Connector Add Seccessfull!");

    if (isLastChunk) {
      respFile.finalFilename = response.finalFilename;
      setState((prevState) => ({
        ...prevState,
        btnLoader: false,
        lastUploadedFileIndex: state.currentFileIndex,
        currentChunkIndex: null,
        // calculatePercentage: calculatePercentageFn(),
        totalHit: prevState.totalHit + 1,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        currentChunkIndex: state.currentChunkIndex + 1,
        // calculatePercentage: calculatePercentageFn(),
        totalHit: prevState.totalHit + 1,
      }));
    }
  };

  const languageOptions = [
    { value: "nodejs", label: "Node js" },
    { value: "python", label: "Python" },
    { value: "rust", label: "Rust" },
    { value: "Java", label: "Java" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLanguageSelect = (event) => {
    setSelectedLanguage(event.target.value);
  };


  return (
    <React.Fragment>
      {/* <ToastContainer /> */}

      <div className="page-content">
        {/* <Container fluid={true}>
          <Breadcrumbs title="Connector" breadcrumbItem="Connector Upload" /> */}
        <Row>
          <Col className="col-12 col-md-6">
            <Card>
              <CardBody>
                <Form className="dropzone">
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      handleAcceptedFiles(acceptedFiles);
                    }}
                    style={{ width: "800px !important" }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div style={{ textAlign: "center" }}>
                        <div
                          className="dz-message needsclick"
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <div className="mb-3">
                            <i className="display-4 text-muted mdi mdi-cloud-upload-outline"></i>
                          </div>
                          <h4>Drop files here to upload</h4>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <div className="dropzone-previews mt-3" id="file-previews">
                    {selectedFiles.map((f, i) => {
                      return (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                <img
                                  data-dz-thumbnail=""
                                  height="80"
                                  className="avatar-sm rounded bg-light"
                                  alt={f.name}
                                  src={f.preview}
                                />
                              </Col>
                              <Col>
                                <Link
                                  to="#"
                                  className="text-muted font-weight-bold"
                                >
                                  {f.name}
                                </Link>
                                <p className="mb-0">
                                  <strong>{f.formattedSize}</strong>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col className="col-12 col-md-3">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="d-inline-block">
              <DropdownToggle caret>
                {selectedLanguage || "Select a language"}
              </DropdownToggle>
              <DropdownMenu>
                {languageOptions.map((option) => (
                  <DropdownItem key={option.value} onClick={() => handleLanguageSelect(option.value)}>
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="d-line-block mt-4">
              <button
                type="button"
                disabled={!connectortData.length > 0}
                onClick={onSubmit}
                className="btn btn-primary "
              >
                Upload Connector
              </button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="col-12 col-md-12">
            <ConnectorList />
          </Col>
        </Row>
      </div>
    </React.Fragment >
  );
};

export default ConnectorUploader;
