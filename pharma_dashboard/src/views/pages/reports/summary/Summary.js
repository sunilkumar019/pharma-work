import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Select
} from "reactstrap";
import DatePicker from "react-datepicker";
import { subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncTypeahead, Highlighter, Typeahead } from "react-bootstrap-typeahead";

import "./Summary.css";
import SummaryTable from "src/views/tables/reports/summary";
import {
  getAllMrs,
  getByName,
} from "src/api/reports/summary";


class Summary extends React.Component {
  typeahead = AsyncTypeahead;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isDisabled: true,
      startDate: "",
      endDate: "",
      select: "",
      mrSelectedId: "",
      mrList: [],
      formData: {},
      options: [],
      selectedDistributorId: "",
      isMr: false,
      isBtnDisable: false
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.firstSelectHandler = this.firstSelectHandler.bind(this);
    this.secondSelectHandler = this.secondSelectHandler.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    const { startDate, endDate, select, selectedDistributorId, mrSelectedId } =
      this.state;
    let fData = {
      startDate,
      endDate,
      select,
      mrSelectedId,
      selectedDistributorId,
    };
    console.log(fData)
    this.setState({ formData: fData });
    fData = {};
  }

  firstSelectHandler(event) {
    this.typeahead.state.text = ""
    this.typeahead.state.selected = []
    
    const selectedValue = event.target.value;
    this.setState({ select: selectedValue });

    if (selectedValue === "selected") {
      this.setState({ isDisabled: true, isMr: false, isBtnDisable: false });
      return;
    }
    this.setState({ isDisabled: false, isBtnDisable: true });
    if (selectedValue === "distributor") {
      this.setState({ isMr: false });
    }
  }

  secondSelectHandler(value) {
    this.setState({ mrSelectedId: value[0]?._id, isBtnDisable: false });
  }

  render() {
  
    return (
      <>
        <Container>
          <Form className="bg-white text-dark p-2" onSubmit={this.onFormSubmit}>
            <Row>
              <Col xs="auto">
                <FormGroup>
                  <Row>
                    <Col xs="auto">
                      <Label>From</Label>
                    </Col>
                    <Col xs="auto">
                      <DatePicker
                        name="startDate"
                        selected={this.state.startDate ? this.state.startDate : false}
                        onChange={(date) =>
                          this.setState({
                            startDate: date,
                          })
                        }
                        maxDate={new Date()}
                        minDate={subDays(new Date(), 120)}
                        className="shadow-sm border font-sm p-1"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Start Date"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Row>
                    <Col xs="auto">
                      <Label>To</Label>
                    </Col>
                    <Col xs="auto">
                      <DatePicker
                        selected={
                          this.state.endDate ? this.state.endDate : false
                        }
                        name="endDate"
                        onChange={(date) => this.setState({ endDate: date })}
                        maxDate={new Date()}
                        minDate={subDays(new Date(), 120)}
                        className="shadow-sm border font-sm p-1"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="End Date"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="2">
                <FormGroup>
                  <Input
                    type="select"
                    name="select"
                    onChange={this.firstSelectHandler}
                    className="border shadow-sm"
                    size="sm"
                  >
                    <option value="selected"> Fetch By </option>
                    <option value="distributor">By Distributor</option>
                    <option value="mr">By MR</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col xs="5">
                <AsyncTypeahead
                  isLoading={this.state.isLoading}
                  onChange={(value) => {
                    this.setState({mrList: []})
                    getAllMrs(value[0]?._id).then((value) => {
                      this.setState({mrList: value})
                    })

                    this.setState({ selectedDistributorId: value[0]?._id});

                    if(this.state.select === "distributor") {
                      this.setState({ isBtnDisable: false });
                      return;
                    }

                    if(this.state.select === "mr") {
                      this.setState({isMr: true})
                    }
                  }}
                  id="asynctypeahead"
                  labelKey="name"
                  minLength={3}
                  onSearch={(query) => {
                    this.setState({ isLoading: true });
                    getByName(query)
                      .then((result) => result)
                      .then((json) =>
                        this.setState({ isLoading: false, options: json })
                      )
                      .catch((err) =>
                        console.log(err, " in distributor query function")
                      );
                  }}
                  options={this.state.options}
                  className="shadow-sm"
                  size="small"
                  disabled={this.state.isDisabled}
                  placeholder="Search Distributor ...... "
                  ref={typeahead => this.typeahead = typeahead}
                  renderMenuItemChildren={(option, props) => (
                    <>
                      <Highlighter key={props.text} search={props.text}>
                        {option[props.labelKey]}
                      </Highlighter>
                      <span className="float-right badge badge-secondary shadow-none">
                        {option.email}
                      </span>
                    </>
                  )}
                />
              </Col>
              {this.state.isMr ? (
                <Col xs="3">
                  <FormGroup>
                    <Typeahead placeholder="Select MR" onChange={this.secondSelectHandler} id="mrs" options={this.state.mrList} labelKey="name" size="small" ></Typeahead>
                  </FormGroup>
                </Col>
              ) : (
                false
              )}
              <Col xs="2">
                <Button disabled={this.state.isBtnDisable} color="primary m-0" type="submit" size="sm">
                  GO
                </Button>
              </Col>
            </Row>
            <Row className="m-2 shadow text-center">
              <SummaryTable data={this.state.formData}></SummaryTable>
            </Row>
          </Form>
        </Container>
      </>
    );
  }
}

export default Summary;
