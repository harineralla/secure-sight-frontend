import PropTypes from "prop-types";
import React, { useEffect } from "react";
import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";
import logo from "../../assets/images/logo/Images/TM_Logo_Primary_2c_reverse_1200x255.png";
import {
	Row,
	Col,
	CardBody,
	Card,
	Alert,
	Container,
	Form,
	Input,
	FormFeedback,
	Label,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// actions
import { loginUser, socialLogin } from "../../store/actions";

//Import config
import { facebook, google } from "../../config";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const Login = (props) => {
	document.title = "Login | Trend Micro Unity";

	const dispatch = useDispatch();

	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			email: "" || "",
			password: "" || "",
		},
		validationSchema: Yup.object({
			email: Yup.string().required("Please Enter Your Email"),
			password: Yup.string().required("Please Enter Your Password"),
		}),
		onSubmit: (values) => {
			dispatch(loginUser(values, props.router.navigate));
		},
	});

	const { error } = useSelector((state) => ({
		error: state.login.error,
	}));

	useEffect(() => {
		document.body.className = "bg-pattern";
		// remove classname when component will unmount
		return function cleanup() {
			document.body.className = "";
		};
	});

	return (
		<React.Fragment>
			<ToastContainer />
			<div className="bg-overlay"></div>
			<div className="account-pages my-5 pt-5">
				<Container>
					<Row className="justify-content-center">
						<Col lg={8} md={12} xl={8}>
							<h4>
								Generate custom reports for your CloudOne/Deep Security
								infrastructure
							</h4>
							<br />
							<h4>
								Trend Micro Unity tool is a web-based reporting application.
								Unity extracts customised reports from Trend Micro CloudOne/Deep
								Security Servers via API calls.
							</h4>
							<br />
							<h4>
								Currently the tool hosts a series of custom reports for CloudOne
								Workload Security, CloudOne Container Security, Smart Scan Deep
								Security and CloudOne Conformity.
							</h4>{" "}
						</Col>
						<Col lg={4} md={8} xl={4}>
							<Card>
								<CardBody className="p-4">
									<div>
										<div className="text-center">
											<Link to="/">
												<img
													src={logo}
													alt=""
													height="24"
													className="auth-logo logo-dark mx-auto"
												/>
												<img
													src={logo}
													alt=""
													height="24"
													className="auth-logo logo-light mx-auto"
												/>
											</Link>
										</div>
										<h4 className="font-size-18 text-muted mt-2 text-center">
											Secure Sight
										</h4>
										<br />
										<p className="mb-5 text-center">
											Sign up to continue to Upzet.
										</p>
										<Form
											className="form-horizontal"
											onSubmit={(e) => {
												e.preventDefault();
												validation.handleSubmit();
												return false;
											}}
										>
											{error ? (
												<Alert color="danger">
													<div>{error}</div>
												</Alert>
											) : null}
											<Row>
												<Col md={12}>
													<div className="mb-4">
														<Label className="form-label">User ID</Label>
														<Input
															name="email"
															className="form-control"
															placeholder="Enter User ID"
															onChange={validation.handleChange}
															onBlur={validation.handleBlur}
															value={validation.values.email || ""}
															invalid={
																validation.touched.email &&
																	validation.errors.email
																	? true
																	: false
															}
														/>
														{validation.touched.email &&
															validation.errors.email ? (
															<FormFeedback type="invalid">
																<div>{validation.errors.email}</div>
															</FormFeedback>
														) : null}
													</div>
													<div className="mb-4">
														<Label className="form-label">Password</Label>
														<Input
															name="password"
															value={validation.values.password || ""}
															type="password"
															placeholder="Enter Password"
															onChange={validation.handleChange}
															onBlur={validation.handleBlur}
															invalid={
																validation.touched.password &&
																	validation.errors.password
																	? true
																	: false
															}
														/>
														{validation.touched.password &&
															validation.errors.password ? (
															<FormFeedback type="invalid">
																<div> {validation.errors.password} </div>
															</FormFeedback>
														) : null}
													</div>

													<Row>
														<Col>
															<div className="form-check">
																<input
																	type="checkbox"
																	className="form-check-input"
																	id="customControlInline"
																/>
																<label
																	className="form-label form-check-label"
																	htmlFor="customControlInline"
																>
																	Remember me
																</label>
															</div>
														</Col>
														<Col className="col-7">
															<div className="text-md-end mt-3 mt-md-0">
																<Link
																	to="/auth-recoverpw"
																	className="text-muted"
																>
																	<i className="mdi mdi-lock"></i> Forgot your
																	password?
																</Link>
															</div>
														</Col>
													</Row>
													<div className="d-grid mt-4">
														<button
															className="btn btn-primary waves-effect waves-light"
															type="submit"
														>
															Log In
														</button>
													</div>
													<div className="mt-4 text-center">
														{/* <h5 className="font-size-14 mb-3">Sign in with</h5>

														<ul className="list-inline">
															<li className="list-inline-item">
																<FacebookLogin
																	appId={facebook.APP_ID}
																	autoLoad={false}
																	// callback={facebookResponse}
																	render={(renderProps) => (
																		<Link
																			to="#"
																			className="social-list-item bg-primary text-white border-primary"
																			onClick={renderProps.onClick}
																		>
																			<i className="mdi mdi-facebook" />
																		</Link>
																	)}
																/>
															</li>

															<li className="list-inline-item">
																<GoogleLogin
																	clientId={google.CLIENT_ID}
																	render={(renderProps) => (
																		<Link
																			to="#"
																			className="social-list-item bg-danger text-white border-danger"
																			onClick={renderProps.onClick}
																		>
																			<i className="mdi mdi-google" />
																		</Link>
																	)}
																	// onSuccess={googleResponse}
																	onFailure={() => { }}
																/>
															</li>
														</ul> */}
														<p className="text-white-50">
															Don't have an account ?{" "}
															<Link to="/register" className="fw-medium text-primary">
																{" "}
																Register{" "}
															</Link>{" "}
														</p>
													</div>
												</Col>
											</Row>
										</Form>
									</div>
								</CardBody>
							</Card>
							<div className="mt-3 text-center">
								{/* <p className="text-white-50">
									Don't have an account ?{" "}
									<Link to="/register" className="fw-medium text-primary">
										{" "}
										Register{" "}
									</Link>{" "}
								</p> */}
								<p className="text-white-50">
									© {new Date().getFullYear()} Upzet. Crafted with{" "}
									<i className="mdi mdi-heart text-danger"></i> by Themesdesign
								</p>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default withRouter(Login);

Login.propTypes = {
	history: PropTypes.object,
};
