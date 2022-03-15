import React from "react";
import "../aboutUs/styles.scss"
import { NotificationManager } from "react-notifications";
import { UserChangePassword, UserInfoUpdate, UserProfile } from "src/api/user/user";
// import Constants from "src/secrets";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { isAddress, isEmail, isName, isPhonenumber } from "src/lib/validator";
import User from '../../../assets/images/user.png'
import { AdminLogin } from "src/api/login/login";


async function readDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(reader.result);
        reader.onerror = e => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

class Profile extends React.Component {
    state = {
        info: {}, id: "",
        name: "", email: "", phone: "", company: "",
        oldPassword: "", newPassword: "", confirmNewPassword: "", currentPassword: "",
        file: null, image: null, base64: null, objectUrl: null, valid: false, updated: false,
        checkImg: false, modal: false, loading: false
    };


    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }


    // ******************************ON CHANGE Image*************************************

    inputFileRef = null;
    handleChangePhotoButton = e => {
        e.preventDefault();
        this.inputFileRef.click();
    };

    handleChangePhotoFileInput = e => {
        const target = e.currentTarget;
        const file = target.files.item(0);
        // validate file as image
        if (!file.type.startsWith("image/")) {
            return NotificationManager.error("Image Format Not Supported", "Info", 2000)
        }
        // store reference to the File object and a base64 representation of it
        readDataUrl(file).then(dataUrl => {
            this.setState({
                ...this.state,
                file,
                base64: dataUrl,
                objectUrl: URL.createObjectURL(file)
            });
        });
    };

    // ****************************** SAVE INFO *************************************

    saveInfo = async (e) => {
        e.preventDefault();
        if (!this.state.currentPassword.trim()) {
            return NotificationManager.error("Please Enter Your Current Password", "Info", 2000)
        }
        await this.validation("INFO")
        if (this.state.valid === true) {

            // update user info
            this.setState({ loading: true })

            let rs = await UserInfoUpdate({
                id: this.state.id,
                profile_pic: this.state.file,
                name: this.state.name,
                email: this.state.email,
                company: this.state.company,
                phone: this.state.phone
            })

            // login user

            let rsLogin = await AdminLogin({
                email: this.state.email,
                password: this.state.currentPassword
            })



            if (rs.success === true && rsLogin.success === true) {
                NotificationManager.info("Info Updated Successfully", "Info", 2000);
                localStorage.setItem("token", rsLogin.data.token)
                window.location.reload()
            }
            else {
                // NotificationManager.error(rs.message, "Info", 2000)
                NotificationManager.error(rsLogin.message, "Info", 2000)
                this.setState({ valid: false })
            }

            // if (rs.success === true) {
            //     NotificationManager.info("Info Updated Successfully", "Info", 2000);
            //     localStorage.removeItem("token")
            //     window.location.assign("/")
            // }
        }
        this.setState({ loading: false })

    };

    // ****************************** CHANGE PASSWORD *************************************

    savePassword = async (e) => {
        e.preventDefault();
        await this.validation("PASS")
        if (this.state.valid === true) {
            let rs = await UserChangePassword({
                id: this.state.id,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
            })
            if (rs.success === true) {
                NotificationManager.success("Password Changed Successfully", "Info", 2000);
            }
            else {
                NotificationManager.error("Incorrect Password", "Info", 2000);
            }
        }
    };

    // ******************************Validation Function*************************************

    validation = (type) => {
        if (type === "INFO") {
            if (! isName(this.state.name)) { return NotificationManager.error("Enter your Name", "Info", 2000) }
            if (! isAddress(this.state.company)) { return NotificationManager.error("Enter your Company", "Info", 2000) }
            if (!isPhonenumber(this.state.phone)) { return NotificationManager.error("Enter your Phone", "Info", 2000) }
            if (!isEmail(this.state.email)) { return NotificationManager.error("Enter your Email", "Info", 2000) }
            this.setState({ valid: true })
        }
        else {
            if (!this.state.oldPassword) { return NotificationManager.error("Enter your Password", "Info", 2000) };
            if (!this.state.newPassword) { return NotificationManager.error("Enter new Password", "Info", 2000) };
            if (!this.state.confirmNewPassword) { return NotificationManager.error("Confirm your Password", "Info", 2000) };
            if (this.state.newPassword !== this.state.confirmNewPassword) { return NotificationManager.error("Password did not Match", "Info", 2000) };
            this.setState({ valid: true })
        }

    }

    // ******************************ComponentDidMount Function*************************************

    async componentDidMount() {
        let rs = await UserProfile();
        if (rs.success === true) {
            const { company, email, id, name, phone } = rs.data;
            this.setState({ company, email, id, name, phone })
            if (rs.data.profile_pic !== null) {
                this.setState({ base64: rs.data.profile_pic })
                this.setState({ checkImg: true })
            }
            let infoRs = {
                name: rs.data.name,
                email: rs.data.email,
                company: rs.data.company,
                image: rs.data.profile_pic
            }
            this.setState({ info: infoRs })
        }
    }

    render() {
        let { base64 } = this.state;
        let defaultImage
        if (this.state.checkImg !== true) {
            defaultImage = User
        }
        else {
            defaultImage = base64
        }
        let profileImg
        if (this.state.checkImg !== true) {
            profileImg = User
        }
        else {
            profileImg = this.state.info.image
        }
        return (
            <div className="container-fluid mt--6">
                <div className="row">
                    <div className="col-xl-4 order-xl-1">
                        <div className="card card-profile">
                            <div className="row justify-content-center">
                                <div className="col-lg-3 order-lg-2"   >
                                    <div className="card-profile-image" style={{ marginTop: "120px" }}>
                                        <img src={profileImg || this.state.info.image} alt="upload file" style={{ width: "150px", height : "150px", borderRadius: "50%" }} className="d-block mx-auto mb-4 " />
                                    </div>
                                </div>
                            </div>
                            <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            </div>
                            <div className="card-body pt-0">
                                <div className="row">
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center">
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h5 className="h3" style={{ fontSize: "20px" }}>
                                        {this.state.info.name}
                                    </h5>
                                    <div className="h5 font-weight-300">
                                        <p className="ni location_pin mr-2" style={{ fontSize: "14px" }}>{this.state.info.company}</p>
                                        <p className="ni location_pin mr-2" style={{ fontSize: "14px", color: "#4285f4" }}>{this.state.info.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8 order-xl-2">
                        <div className="card">
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col-8">
                                        <h3 className="mb-0 h3_cstm"><b>Edit Profile</b></h3>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">

                                {/* ************************************FORM******************************************* */}
                                <h6 className="heading-small text-muted mb-4">Basic information</h6>
                                <div className="pl-lg-4">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="form-control-label">Name</label>
                                                <input type="text" value={this.state.name}
                                                    onChange={(e) => this.setState({ name: e.target.value })} className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="form-control-label">Email</label>
                                                <input type="email" className="form-control" value={this.state.email} placeholder="demo@gmail.com"
                                                    onChange={(e) => this.setState({ email: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="form-control-label">Phone</label>
                                                <input type="tel" className="form-control" value={this.state.phone}
                                                    onChange={(e) => this.setState({ phone: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="form-control-label">Company</label>
                                                <input type="url" className="form-control" value={this.state.company}
                                                    onChange={(e) => this.setState({ company: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ---------------------------------Banner Info--------------------------------- */}

                                <h6 className="heading-small text-muted mb-4" style={{ marginTop: "20px" }}>Upload Image</h6>
                                <div className="pl-lg-4">
                                    <div className="row">
                                        <div className="col-lg-5 mx-auto" >
                                            <img src={base64 || defaultImage} alt="upload file" style={{ width: "100px", height: "100px", borderRadius: "50%" }} className="d-block mx-auto mb-4 " />
                                        </div>
                                    </div>
                                    <div className="col-lg-5 mx-auto">
                                        <input id="customFile" type="file" className="custom-file-input rounded-pill" accept="image/x-png,image/gif,image/jpeg"
                                            onChange={this.handleChangePhotoFileInput} ref={input => (this.inputFileRef = input)} />
                                        <label className="custom-file-label rounded-pill" style={{ fontSize: "10px", margin: "20px" }}>Choose file</label>
                                    </div>
                                    {/* <hr className="my-4" /> */}

                                    <div style={{ marginBottom: "100px", marginTop: "40px" }}>
                                        <button className="prof_save_button" onClick={this.toggle}
                                        ><i className="fas fa-save"></i> Save Changes</button>
                                    </div>
                                </div>
                                <hr className="my-4" />


                                {/* ---------------------------------Password & Security----------------------------------- */}
                                {/* ************************************FORM******************************************* */}

                                <h6 className="heading-small text-muted mb-4" >Password & Security</h6>
                                <div className="row">
                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label className="form-control-label">Old Password</label>
                                            <input type="password" className="form-control" value={this.state.oldPassword}
                                                onChange={(e) => this.setState({ oldPassword: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label className="form-control-label">New Password</label>
                                            <input type="password" className="form-control" value={this.state.newPassword}
                                                onChange={(e) => this.setState({ newPassword: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="col-sm">
                                        <div className="form-group">
                                            <label className="form-control-label">Confirm Password</label>
                                            <input type="password" className="form-control" value={this.state.confirmNewPassword}
                                                onChange={(e) => this.setState({ confirmNewPassword: e.target.value })} />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ marginTop: "40px" }} />
                                <button className="prof_save_button" onClick={this.savePassword}
                                ><i className="fa fa-lock" style={{ color: "white" }}></i> Save Password</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Save User Info</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="currentPassword"  >Enter Password</Label>
                            <Input type="password" name="currentPassword" value={this.state.currentPassword}
                                onChange={(e) => this.setState({ currentPassword: e.target.value })} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.saveInfo}>
                            {this.state.loading ? <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {" "} Loading... </> : <>Save Info</>}
                        </Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        );
    };
}

export default Profile;