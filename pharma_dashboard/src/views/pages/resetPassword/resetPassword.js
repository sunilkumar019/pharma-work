import React, {Component} from "react";
import wave from '../../../assets/images/wave.png'
import { CForm, CInput, CLabel, CButton} from "@coreui/react";
import {NotificationManager} from "react-notifications";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import {AdminResetPassword, TokenExpire} from "../../../api/login/login";
import Login from "../login/Login";
import {Redirect} from "react-router-dom";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',

            isPasswordReset: false,
            isNavigated: false,
        }
        this.resetAdminPassword = this.resetAdminPassword.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.redirectToLoginPage = this.redirectToLoginPage.bind(this);
    }

    async resetAdminPassword(e) {
        e.preventDefault();
        // password and confirmPassword should match. And not enter spaces
        if(!(this.state.password === this.state.confirmPassword && this.state.password.trim() !== '')) {
            return NotificationManager.error("Please fill valid password", "Incorrect password");
        }
        // At least 6 characters
        if(!(this.state.password.length > 5 && this.state.confirmPassword.length > 5)) {
            return NotificationManager.error("Password should have at least 6 characters", "Incorrect password");
        }
        let filter = {};
        filter = this.props.match.params;
        filter.password = this.state.password;
        const response = await AdminResetPassword(filter);
        if(response.data.status === 200) {
            this.setState({isPasswordReset: true})
            return NotificationManager.success("You password has been change", "Success", 3000);
        } else {
            return NotificationManager.error(response.data.message, "Error", 3000);
        }
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    redirectToLoginPage(e) {
        this.setState({isNavigated: true})
    }

    render() {
        if(this.state.isNavigated) {
            return <Redirect to={<Login />} />
        }

        return (
            <div className="login">
                <NotificationContainer />
                <img className="wave" alt="wave" src={wave} style={{zIndex: 100}}/>
                <div className="container-login">
                    <div></div>
                    {
                        this.state.isPasswordReset
                            ?   <div className="login-content">
                                    <div style={{textAlign: "left", marginLeft: -240}} className={'w-75 bg-white p-3 shadow'}>
                                        <p className={'h2 font-weight-bold text-success'}>Password Reset Successfully!</p>
                                        <br/>
                                        <div className={"m-3"}>
                                            <p className={"h6 font-weight-light"}>
                                                Congratulations, You have been changed your login password successfully. To back to home page please click below on the login button.
                                            </p>
                                        </div>
                                        <div>
                                            <CButton onClick={this.redirectToLoginPage} className={"py-2 px-4 rounded"} color={"success"}>Login</CButton>
                                        </div>
                                    </div>
                                </div>
                            : <div className="login-content">
                            <CForm onSubmit={this.resetAdminPassword} style={{textAlign: "left", fontSize: 12, height: 340, marginLeft: -200}} className={'w-50 bg-white p-3 shadow'}>
                                <p className={'h2 font-weight-light'}>RESET PASSWORD</p>
                                <br/>
                                <div className="mb-3">
                                    <CLabel htmlFor="password">New Password</CLabel>
                                    <CInput type="password" onChange={this.onChangeHandler} id="password" aria-describedby="password" name="password" />
                                </div>
                                <div className="mb-3">
                                    <CLabel htmlFor="confirmPassword">Confirm Password</CLabel>
                                    <CInput type="password" onChange={this.onChangeHandler} id="confirmPassword" name="confirmPassword" />
                                </div>
                                <CButton type="submit" className={"py-2 px-4 rounded"} color="primary">
                                    Submit
                                </CButton>
                            </CForm>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ResetPassword;