import React from "react";
import profileCover from '../../../assets/images/profileCover.png'
import profile from '../../../assets/images/profile.png'
import "./styles.scss"
import { AddUpdateAbout, GetAbout } from "src/api/about/about";
import { NotificationManager } from "react-notifications";
import { UserProfile } from "src/api/user/user";
import upload from 'src/assets/images/upload.jpg'
import { isDescription, isEmail, isPhonenumber } from "src/lib/validator";


class AboutUs extends React.Component {
  state = {
    companyName: "", profileImage: "",
    file: null, image: null, base64: null, objectUrl: null, valid: false, updated: false,
    id: '', about: '', address: '', address2: '', address3: '', phone: '',
    whatsapp: '', whatsapp_greeting: '', website: '', email: '',
    facebook: '', linkedin: '', pinterest: '', twitter: '', corporate_video: '',
    drive_List: [], values: [], loading: true, imgUrls: [], bannerImgs: [],
  };

  // ******************************ON CHANGE DOWNLAOD LINKS*************************************

  handleRolesChange = (id, event, imgType) => {
    event.preventDefault();
    const { drive_List } = this.state;
    let myRowIndex = drive_List.findIndex((row) => row.division_id === id);
    this.setState({ drive_List });
    if (imgType === "PRO") {
      drive_List[myRowIndex].product_list_link = event.target.value;
      this.setState({ drive_List });
    }
    else if (imgType === "VIS") {
      drive_List[myRowIndex].visualaids_link = event.target.value;
      this.setState({ drive_List });
    }
  }


  // ***************** IMAGE FUNCTION ****************************

  removeimage = (imgUrl) => {
    let selectedImages = [];
    let IMAGES = this.state.bannerImgs
    for (let i = 0; i < IMAGES.length; i++) {
      let fileUrl = IMAGES[i].url;
      let fileObj = IMAGES[i]
      if (fileUrl !== imgUrl) {
        selectedImages.push({ url: fileUrl, file: fileObj.file })
      }
    }
    this.setState({ bannerImgs: selectedImages })
  }

  // -----------------------METADATA FUNCTION-----------------------------

  getFileMetadata = file => {
    return {
      lastModified: file.lastModified,
      name: file.name,
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath
    }
  }


  // ******************************ON CHANGE BANNER*************************************

  handleUploadImg = (e) => {
    let newstate = [];
    let selectedImages = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      let url = URL.createObjectURL(file);
      selectedImages.push(file);
      let metadata = this.getFileMetadata(file);
      newstate = [...newstate, { url, metadata, file, type: "upload" }];
    }
    this.setState({ bannerImgs: newstate })
  };

  // ******************************ADD UPDATE*************************************

  submitFormAddUpdate = async (e) => {
    e.preventDefault();
    await this.validation()

    let imageItem = []
    let imgUrls = [this.state.bannerImgs]
    if (imgUrls.length > 0) {
      imgUrls.map((it) =>
          it.map((item) =>
              imageItem.push(item.file)
          )
      )
    }

    if (this.state.valid === true) {
      let rs = AddUpdateAbout({
        image: imageItem,
        phone: this.state.phone,
        whatsapp: this.state.whatsapp,
        website: this.state.website,
        email: this.state.email,
        about: this.state.about,
        address: this.state.address,
        address2: this.state.address2,
        address3: this.state.address3,
        facebook: this.state.facebook,
        linkedin: this.state.linkedin,
        pinterest: this.state.pinterest,
        twitter: this.state.twitter,
        whatsapp_greeting: this.state.whatsapp_greeting,
        corporate_video: this.state.corporate_video,
        download_links: this.state.drive_List
      })
      if (rs) {
        NotificationManager.info("Info Updated Successfully", "Info", 2000);
        this.setState({ updated: true })
      }
      this.setState({ valid: false })
    }
  };

  // ******************************Validation Function*************************************

  validation = () => {
    console.log(this.isValidLink(this.state.facebook), this.state.linkedin, this.state.twitter, this.state.pinterest)
    if (!this.state.phone) { return NotificationManager.error("Enter your Phone No.", "Info", 2000); }
    else if (!isPhonenumber(this.state.phone)) { return NotificationManager.error("InValid Phone No.", "Info", 2000); }
    else if (!this.state.whatsapp) { return NotificationManager.error("Enter your WhatsApp No.", "Info", 2000); }
    else if (!this.state.website) { return NotificationManager.error("Enter your Website", "Info", 2000); }
    else if (!this.state.email) { return NotificationManager.error("Enter your Email", "Info", 2000); }
    else if (!isEmail(this.state.email)) { return NotificationManager.error("invalid Email", "Info", 2000); }
    else if (!isDescription(this.state.about)) { return NotificationManager.error("Enter your Company Info", "Info", 2000); }
    else if (!isDescription(this.state.address)) { return NotificationManager.error("Enter your Address", "Info", 2000); }
    else if (!this.state.imgUrls) { return NotificationManager.error("Upload Banner Image", "Info", 2000); }
    else if (!this.state.drive_List) { return NotificationManager.error("Enter Webhopers Product List Link", "Info", 2000) }
    else if (!(this.isValidLink(this.state.facebook))) { return NotificationManager.error("Enter Valid Facebook link", "Info", 2000) }
    else if (!(this.isValidLink(this.state.twitter))) { return NotificationManager.error("Enter Valid Twitter link", "Info", 2000) }
    else if (!(this.isValidLink(this.state.pinterest))) { return NotificationManager.error("Enter Valid Pinterest link", "Info", 2000) }
    else if (!(this.isValidLink(this.state.linkedin))) { return NotificationManager.error("Enter Valid Linkedin link", "Info", 2000) }
    else { this.setState({ valid: true }) }
  }

  isValidLink = (link) => {
    if(!link) return true;
    var pattern = new RegExp('^(http|https)://'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
        '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(link);
  }

  // ******************************ComponentDidMount Function*************************************

  async componentDidMount() {
    let rs = await GetAbout();
    if (rs.success === true && rs.data !== null) {

      if (rs.data.id !== null) this.setState({id : rs.data.id})
      if (rs.data.about !== null) this.setState({about : rs.data.about})
      if (rs.data.about_img !== null) this.setState({about_img : rs.data.about_img})
      if (rs.data.address !== null) this.setState({address : rs.data.address})
      if (rs.data.address2 !== null) this.setState({address2 : rs.data.address2})
      if (rs.data.address3 !== null) this.setState({address3 : rs.data.address3})
      if (rs.data.phone !== null) this.setState({phone : rs.data.phone})
      if (rs.data.whatsapp !== null) this.setState({whatsapp : rs.data.whatsapp})
      if (rs.data.whatsapp_greeting !== null) this.setState({whatsapp_greeting : rs.data.whatsapp_greeting})
      if (rs.data.website !== null) this.setState({website : rs.data.website})
      if (rs.data.email !== null) this.setState({email : rs.data.email})
      if (rs.data.twitter !== null) this.setState({twitter : rs.data.twitter})
      if (rs.data.facebook !== null) this.setState({facebook : rs.data.facebook})
      if (rs.data.pinterest !== null) this.setState({pinterest : rs.data.pinterest})
      if (rs.data.linkedin !== null) this.setState({linkedin : rs.data.linkedin})
      if (rs.data.corporate_video !== null) this.setState({corporate_video : rs.data.corporate_video})

      // ----------------Images------------

      let selectedImages = [];
      let IMAGES = rs.data.about_img.split(",")
      for (let i = 0; i < IMAGES.length; i++) {
        let fileUrl = IMAGES[i];
        selectedImages.push({ url: fileUrl, type: "uploaded" })
      }

      this.setState({ bannerImgs: selectedImages })
      this.setState({ drive_List: rs.data.download_links })

      let rsProfile = await UserProfile()
      if (rsProfile.success === true) {
        this.setState({ companyName: rsProfile.data.company })
        this.setState({ profileImage: rsProfile.data.profile_pic })
      }
    }
    else {
      this.setState({ companyName: "Demo" })
      this.setState({ profileImage: `${profile}` })
    }
    this.setState({ loading: false })

  }

  // ******************************componentDidUpdate Function*************************************

  async componentDidUpdate() {

    if (this.state.updated === true) {
      let rs = await GetAbout();

      if (rs.success === true) {

        if (rs.data.id !== null) this.setState({id : rs.data.id})
        if (rs.data.about !== null) this.setState({about : rs.data.about})
        if (rs.data.about_img !== null) this.setState({about_img : rs.data.about_img})
        if (rs.data.address !== null) this.setState({address : rs.data.address})
        if (rs.data.address2 !== null) this.setState({address2 : rs.data.address2})
        if (rs.data.address3 !== null) this.setState({address3 : rs.data.address3})
        if (rs.data.phone !== null) this.setState({phone : rs.data.phone})
        if (rs.data.whatsapp !== null) this.setState({whatsapp : rs.data.whatsapp})
        if (rs.data.whatsapp_greeting !== null) this.setState({whatsapp_greeting : rs.data.whatsapp_greeting})
        if (rs.data.website !== null) this.setState({website : rs.data.website})
        if (rs.data.email !== null) this.setState({email : rs.data.email})
        if (rs.data.twitter !== null) this.setState({twitter : rs.data.twitter})
        if (rs.data.facebook !== null) this.setState({facebook : rs.data.facebook})
        if (rs.data.pinterest !== null) this.setState({pinterest : rs.data.pinterest})
        if (rs.data.linkedin !== null) this.setState({linkedin : rs.data.linkedin})
        if (rs.data.corporate_video !== null) this.setState({corporate_video : rs.data.corporate_video})

        // ----------------Images------------

        let selectedImages = [];
        let IMAGES = rs.data.about_img.split(",")
        for (let i = 0; i < IMAGES.length; i++) {
          let fileUrl = IMAGES[i];
          selectedImages.push({ url: fileUrl, type: "uploaded" })
        }
        this.setState({ bannerImgs: selectedImages })
        this.setState({ drive_List: rs.data.download_links })
        this.setState({ updated: false })
      }
    }
  }

  render() {

    return (
        <>
          {this.state.loading ? <div className="loader"></div> :
              <div>
                <div>
                  <div className="container-fluid mt--6">
                    <div className="row">
                      <div className="col-xl-4 order-xl-2">
                        <div className="card card-profile">
                          <img src={profileCover} alt="card placeholder" className="card-img-top" />
                          <div className="row justify-content-center">
                            <div className="col-lg-3 order-lg-2">
                              <div className="card-profile-image">
                                <img src={this.state.profileImage} className="rounded-circle" alt="company logo placeholder" />
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
                            <div className="text-center" style={{ marginTop: '25px' }}>
                              <h5 className="h3" style={{ fontSize: "20px" }}>
                                {this.state.companyName}
                              </h5>
                              <div className="h5 font-weight-300">
                                <p className="ni location_pin mr-2" style={{ fontSize: "14px" }}>{this.state.address}</p>
                                <p className="ni location_pin mr-2" style={{ fontSize: "14px", color: "blue" }}>{this.state.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-8 order-xl-1">
                        <div className="card">
                          <div className="card-header">
                            <div className="row align-items-center">
                              <div className="col-8">
                                <h3 className="mb-0 h3_cstm"><b>Edit Company Info</b></h3>
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
                                    <label className="form-control-label">Phone Number</label>
                                    <input type="tel" value={this.state.phone}
                                           onChange={(e) => this.setState({ phone: e.target.value })} className="form-control" />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label">WhatsApp Number</label>
                                    <input type="tel" className="form-control" value={this.state.whatsapp}
                                           onChange={(e) => this.setState({ whatsapp: e.target.value })} />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label">Email</label>
                                    <input type="email" className="form-control" placeholder="demo@gmail.com" value={this.state.email}
                                           onChange={(e) => this.setState({ email: e.target.value })} />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label">Website</label>
                                    <input type="url" className="form-control" placeholder="www.demo.com" value={this.state.website}
                                           onChange={(e) => this.setState({ website: e.target.value })} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="my-4" />

                            {/* ---------------------------------Contact Info--------------------------------- */}

                            <h6 className="heading-small text-muted mb-4">Contact information</h6>
                            <div className="pl-lg-4">
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label className="form-control-label">Address 1</label>
                                    <input className="form-control" value={this.state.address}
                                           onChange={(e) => this.setState({ address: e.target.value })} placeholder="Company Address" type="text" />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label className="form-control-label" >Address 2</label>
                                    <input className="form-control" value={this.state.address2}
                                           onChange={(e) => this.setState({ address2: e.target.value })} placeholder="Company Address" type="text" />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label className="form-control-label">Address 3</label>
                                    <input className="form-control" value={this.state.address3}
                                           onChange={(e) => this.setState({ address3: e.target.value })} placeholder="Company Address" type="text" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="my-4" />


                            {/* ---------------------------------Link Info--------------------------------- */}

                            <h6 className="heading-small text-muted mb-4">Social Media Link</h6>
                            <div className="pl-lg-4">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label" >Facebook Link</label>
                                    <input type="text" className="form-control" value={this.state.facebook}
                                           onChange={(e) => this.setState({facebook: e.target.value})} />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label" >Twitter Link</label>
                                    <input type="text" className="form-control" value={this.state.twitter}
                                           onChange={(e) => this.setState({ twitter: e.target.value })} />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label" >Pinterest Link</label>
                                    <input type="text" className="form-control" value={this.state.pinterest}
                                           onChange={(e) => this.setState({ pinterest: e.target.value })} />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label" >Linkedin Link</label>
                                    <input type="text" className="form-control" value={this.state.linkedin}
                                           onChange={(e) => this.setState({ linkedin: e.target.value })} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="my-4" />

                            {/* ---------------------------------Other Info--------------------------------- */}

                            <h6 className="heading-small text-muted mb-4">Other information</h6>
                            <div className="pl-lg-4">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label">Video Link</label>
                                    <input type="text" className="form-control" value={this.state.corporate_video}
                                           onChange={(e) => this.setState({ corporate_video: e.target.value })} />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label" >WhatsApp Greeting Message</label>
                                    <input type="text" className="form-control" value={this.state.whatsapp_greeting}
                                           onChange={(e) => this.setState({ whatsapp_greeting: e.target.value })} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="my-4" />
                            {/* ---------------------------------About Info--------------------------------- */}

                            <h6 className="heading-small text-muted mb-4">About</h6>
                            <div className="pl-lg-4">
                              <div className="form-group">
                                <label className="form-control-label">Company Information</label>
                                <textarea type="text" value={this.state.about} className="form-control"
                                          onChange={(e) => this.setState({ about: e.target.value })} rows={4} placeholder="A few words about you ..." />
                              </div>
                            </div>
                            <hr className="my-4" />

                            {/* ---------------------------------Banner Info--------------------------------- */}

                            <h6 className="heading-small text-muted mb-4">Upload Banner</h6>
                            <div className="pl-lg-4">
                              <div className="row">
                                <div className="col-lg-5 mx-auto" >
                                  {
                                    this.state.bannerImgs !== null && this.state.bannerImgs.length > 0 ?
                                        this.state.bannerImgs.map((it) => {
                                          return (
                                              <>
                                                {it.type === "uploaded" ?
                                                    <img src={it.url} alt="upload file" style={{ width: "300px" }} className="d-block mx-auto mb-4 " />
                                                    :
                                                    <>
                                                      <button onClick={() => this.removeimage(it.url)} className="close AClass">
                                                        <span>&times;</span>
                                                      </button>
                                                      <img src={it.url} alt="upload file" style={{ width: "300px" }} className="d-block mx-auto mb-4 " />
                                                    </>
                                                }
                                              </>
                                          )
                                        })
                                        :
                                        <img src={upload} alt="upload file" style={{ width: "300px" }} className="d-block mx-auto mb-4 " />
                                  }
                                </div>
                              </div>
                              <div className="col-lg-5 mx-auto">
                                <input multiple id="customFile" type="file" className="custom-file-input rounded-pill" accept="image/*" onChange={this.handleUploadImg} />
                                <label className="custom-file-label rounded-pill">Choose file</label>
                              </div>
                              <hr className="my-4" />

                              {/* ---------------------------------Google Drive Links--------------------------------- */}

                              <h6 className="heading-small text-muted mb-4">Google Drive Division Links</h6>
                              <div className="pl-lg-4">
                                {this.state.drive_List !== undefined ?
                                    this.state.drive_List.map((it,) =>
                                        <div className="row">
                                          <div className="col-lg-6">
                                            <div className="form-group">
                                              <label className="form-control-label" >Product List link<b> {it.division_name}</b>
                                              </label>
                                              <input
                                                  value={it.product_list_link}
                                                  className="form-control"
                                                  onChange={(e) => this.handleRolesChange(it.division_id, e, "PRO")}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group">
                                              <label className="form-control-label" >Visual-aids link <b> {it.division_name}</b>
                                              </label>
                                              <input
                                                  className="form-control"
                                                  value={it.visualaids_link}
                                                  onChange={(e) => this.handleRolesChange(it.division_id, e, "VIS")}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                    )
                                    :
                                    <></>
                                }
                              </div>
                            </div>
                            <button className="btn btn-primary" onClick={this.submitFormAddUpdate} style={{ backgroundColor: "#55acee", float: "right", marginTop: "20px" }}
                            ><i className="fas fa-save"></i> Save Changes</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                </div>
              </div>
          }
        </>
    );
  };
}

export default AboutUs;