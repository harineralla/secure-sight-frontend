import React, { useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Space, Table } from 'antd';
import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    Container,
    Label,
    Input,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const languageOptions = [
    { value: "", label: "Select a language" },
    { value: "nodejs", label: "Node js" },
    { value: "python", label: "Python" },
    { value: "rust", label: "Rust" },
    { value: "Java", label: "Java" },
    // Add more language options as needed
];

const columns = [
    {
        title: 'Connector',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Time Uploaded',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Access to',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (_, record) => (
            <Space size="middle">
                <a>Schedule</a>
                {/* <a>Edit {record.name}</a>
                <a>Delete</a> */}
            </Space>
        ),
    },
];
const data = [
    {
        key: 1,
        name: 'Sample Job Connector',
        age: "07-30-2023 19:15",
        address: 'Admin-one',
    },
    {
        key: 2,
        name: 'Azure',
        age: "07-29-2023 10:30",
        address: 'Admin-One',
    },
];

const ScheduleJobScheduler = () => {
    const [scriptFile, setScriptFile] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [code, setCode] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setScriptFile(file);
    };

    const handleLanguageSelect = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleCodeChange = (editor, data, value) => {
        setCode(value);
    };

    const handleSaveScript = () => {
        // Perform API call to save the script
        if (scriptFile && selectedLanguage && code) {
            const formData = new FormData();
            formData.append('script', scriptFile);
            formData.append('language', selectedLanguage);
            formData.append('code', code);

            ApiServices.postData(ApiEndPoints.SAVE_SCRIPT, formData)
                .then((response) => {
                    // Handle success
                    console.log('Script saved successfully:', response.data);
                    toast.success('Script saved successfully');
                })
                .catch((error) => {
                    // Handle error
                    console.error('Failed to save script:', error);
                    toast.error('Failed to save script');
                });
        }
    };

    const handleScheduleJob = () => {
        // Perform API call to schedule the job
        if (startDate && endDate) {
            const data = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };

            ApiServices.postData(ApiEndPoints.SCHEDULE_JOB, data)
                .then((response) => {
                    // Handle success
                    console.log('Job scheduled successfully:', response.data);
                    toast.success('Job scheduled successfully');
                })
                .catch((error) => {
                    // Handle error
                    console.error('Failed to schedule job:', error);
                    toast.error('Failed to schedule job');
                });
        }
    };

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Job Scheduler" breadcrumbItem="Schedule JOb Connector" />
                    <Row style={{ paddingTop: "30px" }}>
                        <Col md={6}>
                            {/* Date range picker */}
                            <Label for="startdate" style={{ paddingRight: "10px" }}>Schedule Date:</Label>
                            <DatePicker
                                selected={startDate}
                                // onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="MMMM d, yyyy HH:mm"
                            />
                            <Space direction="vertical" size={12}>
                                <DatePicker showTime 
                                // onChange={onChange} onOk={onOk}
                                 />
                                {/* <RangePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm" */}
                                    {/* onChange={onChange}
                                    onOk={onOk} */}
                                {/* /> */}
                            </Space>
                        </Col>
                        <Col md={6} className="d-flex justify-content-md-end mt-3 mt-md-0">
                            {/* <button type="button"
                                className="btn btn-success btn-lg ms-2"
                                style={{ height: "fit-content !important" }}
                                onClick={handleSaveScript}>
                                Save Script
                            </button> */}
                            <button type="button"
                                className="btn btn-success btn-lg ms-2"
                                style={{ height: "fit-content !important" }}
                                onClick={handleScheduleJob}>
                                Schedule Job
                            </button>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop: "30px" }}>
                        {/* <Col md={12}>
                            <Label for="code">Type your Code here! :</Label>
                            <CodeMirror
                                value={code}
                                onBeforeChange={handleCodeChange}
                                options={{
                                    mode: 'javascript',
                                    theme: 'material',
                                    lineNumbers: true,
                                }}
                            />
                        </Col> */}
                        <Table
                            columns={columns}
                            // expandable={{
                            //     expandedRowRender: (record) => (
                            //         <p
                            //             style={{
                            //                 margin: 0,
                            //             }}
                            //         >
                            //             {record.description}
                            //         </p>
                            //     ),
                            //     rowExpandable: (record) => record.name !== 'Not Expandable',
                            // }}
                            dataSource={data}
                        />
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default ScheduleJobScheduler;
