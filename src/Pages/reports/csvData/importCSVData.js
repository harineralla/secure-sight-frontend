import React, { useEffect, useState } from "react";
import {
	Row,
	Col,
	Card,
	Form,
	CardBody,
	CardTitle,
	CardSubtitle,
	Container,
	Spinner,
} from "reactstrap";
import Dropzone from "react-dropzone";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Papa from "papaparse";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import MaterialTable from "../../Tables/Table";
import {
	deepKeys,
	formatCapilize,
	replaceDot,
} from "../../ulit/commonFunction";
import { useMemo } from "react";
import { allReplace } from "../../ulit/commonFunction";
import ApiServices from "../../../Network_call/apiservices";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";

const ImportCSVData = () => {
	document.title = "CSV Upload | Trend Micro Unity";
	const navigate = useNavigate()
	const [openLoader, setOpenLoader] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const [fileName, setFileName] = useState([]);
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

	const handleAcceptedFiles = async (files) => {
		const jsonFile = new FileReader()
		if (files) {
			setFileName(files);
			jsonFile.readAsText(files[0])
			files[0]?.type === "application/json" ? jsonFile.onload = async (e) => {
				const jsonData = await JSON.parse(e.target.result);
				console.log("table data", jsonData)
				setData(jsonData)
			}
				:
				Papa.parse(files[0], {
					header: true,
					complete: function (results) {
						setData(results.data);
					},
				});
		}
	};

	const keys = data && Array.from(deepKeys(data && data[0]));
	const columns = useMemo(
		() =>
			keys &&
			keys.map((name) => ({
				accessorKey: name,
				header: formatCapilize(
					replaceDot(
						allReplace(name, {
							"source.": " ",
							"attributes.": " ",
							"-": " ",
							_: " ",
						})
					)
				),
			}))
	);

	//##########################################   upload data  ########################################################
	const UploadFileData = async () => {
		setIsLoading(true);
		let payload = {
			info: {
				dbName: userData.dbName,
				user_id: userData.user_id,
				document_name: fileName && fileName[0].name,
			},
			data: { data: data },
		};
		const respons = await ApiServices(
			"post",
			payload,
			ApiEndPoints.UploadFileData
		);
		if (respons.success) {
			setData([]);
			navigate("/csv-list")
		}
		toast(respons.msg);
		setIsLoading(false);
	};

	return (
		<React.Fragment>
			<ToastContainer />

			<div className="page-content">
				<Container fluid={true}>
					<Breadcrumbs title="CSV" breadcrumbItem="CSV Upload" />

					<Row>
						<Col className="col-12">
							<Card>
								<CardBody>
									{/* <CardTitle>CSV File </CardTitle> */}
									{/* <CardSubtitle className="mb-3"></CardSubtitle> */}
									<Form className="dropzone">
										<Dropzone
											onDrop={(acceptedFiles) => {
												handleAcceptedFiles(acceptedFiles);
											}}
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
											{fileName &&
												fileName.map((f, i) => {
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

									<div className="text-center mt-4">
										<button
											type="button"
											className="btn btn-primary "
											onClick={UploadFileData}
											disabled={!data.length > 0}
										>
											{isLoading ? (
												<Spinner size="sm" color="light" />
											) : (
												" Upload Files "
											)}
										</button>
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>

					{data.length > 0 && (
						<Row>
							<Col className="col-12">
								<Card>
									<CardBody>
										<CardTitle>CSV Data</CardTitle>
										<MaterialTable
											data={data}
											columns={columns}
											hidecolumn={""}
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
				</Container>
			</div>
		</React.Fragment>
	);
};

export default ImportCSVData;
