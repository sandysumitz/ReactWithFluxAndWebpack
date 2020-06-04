import React, { Component } from "react";
import classNames from "classnames";
import Loader from "../loader/Loader";
import TextBox from "../generic/TextBox";
import ClusterStore from "../../stores/ClusterStore";
import DashboardStore from "../../stores/DashBoardStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";
import DropDown from "../generic/Dropdown";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

class CreateNameSpace extends Component {
  // renderNetworkConfigurationParametes = [];

  constructor(props) {
    super(props);
    this.state = this.getInitialStatessss();    
    this.state.loading = false;
    this.index = 0;
    this.handleNetworkConfigurationChecked = this.handleNetworkConfigurationChecked.bind(this);
  }

  getInitialStatessss = () => {
    return {
      renderNetworkConfigurationParametes: [],
      isNetworkConfigurationChecked: false,
      message: "",
      namespaceName: "",
      clusterName: "",
      networkConfigurationParameters: null,
      minReqMem: "",
      maxReqMem: "",
      minReqCPU: "",
      maxReqCPU: "",
      maxPod: "",
      maxClaims: "",
      maxStorage: "",
      minPodStorage: "",
      maxPodStorage: "",
      minPodCPU: "",
      maxPodCPU: "",
      minPodMem: "",
      maxPodMem: "",
    };
  };

  componentDidMount() {}
  componentWillUnmount() {}

  handleReset = (event) => {
    event.preventDefault();
    this.setState(this.getInitialState());
  };
  handleOnChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
      message: "",
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
  };

  handleNetworkConfigurationParameterOnChange = (event) => {
    let configurationParameter = Object.assign({}, this.state.networkConfigurationParameters);
    if(event && event.target){
    let selectedRowId = event.target.parentElement.parentElement.parentElement.parentElement.id
    selectedRowId = selectedRowId.substring(3);

    let selectedTargetId = event.target.id;
    let selectedParameter = selectedTargetId.substring(0, selectedTargetId.length-1);

    let selectdNetworkConfiguration = configurationParameter[selectedRowId];

    if(selectdNetworkConfiguration){
    selectdNetworkConfiguration.applicationLabel = 
      selectedParameter == "applicationLabel" ? event.target.value : selectdNetworkConfiguration.applicationLabel;

    selectdNetworkConfiguration.applicationPort = 
      selectedParameter == "applicationPort" ? event.target.value : selectdNetworkConfiguration.applicationPort;
    } else{
    configurationParameter[selectedRowId] = {
      applicationLabel: (selectedParameter == "applicationLabel" ? event.target.value : ""),
      applicationPort: (selectedParameter == "applicationPort" ? event.target.value : "")
    };
    }

    this.setState({ networkConfigurationParameters: configurationParameter });
  }
  }

  getNetworkConfigurationParameters = () => {
    
    let policy = (
      <tr 
        id={"row"+this.index}
        className={classNames(this.index % 2 == 0 ? "even-row" : "odd-row")}>
        <th>
          <TextBox
            id={"applicationLabel"+this.index}
            labelName={"Application Label Name"}
            onChange={this.handleNetworkConfigurationParameterOnChange}
            value={this.state.applicationLabelName}
            required={true}
          />
        </th>
        <th>
          <TextBox
            id={"applicationPort"+this.index}
            labelName={"Application Port"}
            onChange={this.handleNetworkConfigurationParameterOnChange}
            value={this.state.applicationPort}
            required={true}
          />
        </th>
        <th>
        <input 
          className="bin-icon"
          type="image" 
          src={"../src/styles/images/bin-icon.png"} 
          alt="Submit"
          onClick={this.deleteNetworkConfigurationParametes} />
        </th>
      </tr>
); this.index++;
 return policy;
  }

  addNetworkConfigurationParametes = (event) => {
    event.preventDefault();
    
    let toRender = [...this.state.renderNetworkConfigurationParametes];
    let policy = this.getNetworkConfigurationParameters();
    let configurationParameter = Object.assign({}, this.state.networkConfigurationParameters);

    toRender.push(policy);

    this.setState({
      renderNetworkConfigurationParametes: toRender,
      networkConfigurationParameters: (this.state.networkConfigurationParameters ? 
        configurationParameter : null)
    });
  }

  deleteNetworkConfigurationParametes = (event) => {
    event.preventDefault();

    if(this.state.renderNetworkConfigurationParametes.length > 0){
      let selectedRowId = event.target.parentElement.parentElement.id.substring(3);

      let toRender = [...this.state.renderNetworkConfigurationParametes];
      let parameters = null;
      
      delete toRender[selectedRowId];
      if(this.state.networkConfigurationParameters) {
        parameters = Object.assign({}, this.state.networkConfigurationParameters);
        // delete parameters[this.index-1];
        delete parameters[selectedRowId];
      }

      this.setState({
        renderNetworkConfigurationParametes: toRender,
        networkConfigurationParameters: parameters,
      });
    }
  }

  handleNetworkConfigurationChecked(event) {
    let toRender = [];
    let parameters = null;

    if(!this.state.isNetworkConfigurationChecked) {
      toRender = [...this.state.renderNetworkConfigurationParametes];
      let policy = this.getNetworkConfigurationParameters();
      parameters = Object.assign({}, this.state.networkConfigurationParameters);
      toRender.push(policy);
    } 
    this.setState({
      isNetworkConfigurationChecked: event.target.checked,
      renderNetworkConfigurationParametes: toRender,
      networkConfigurationParameters: parameters
    });
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">NameSpace Creation</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">NameSpace Creation</h4>
                <div className="table-responsive">
                  <form className="form-horizontal form-material">
                    <TextBox
                      id={"clusterName"}
                      labelName={"Cluster Name"}
                      onChange={this.handleOnChange}
                      value={this.state.clusterName}
                      required={true}
                    />
                    <TextBox
                      id={"namespaceName"}
                      labelName={"Namespace Name"}
                      onChange={this.handleOnChange}
                      value={this.state.namespaceName}
                      required={true}
                    />
                    {/* <TextBox
                      id={"requiredQuota"}
                      labelName={"Required Quota"}
                      required={true}
                      
                    />                     */}
                    <div className="form-group">
                            <label
                      className={classNames("col-sm-12")}>
                      <input 
                        className="input-checkbox"
                        type="checkbox"
                        onChange={(event) => this.handleNetworkConfigurationChecked(event)}
                        >
                      </input>
                      Network Configuration
                    </label>      
                    </div>
                    {this.state.isNetworkConfigurationChecked ? (
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          {this.state.renderNetworkConfigurationParametes}
                        </tbody>
                      </table>
                    <div className="form-group">
                      <div className="col-sm-10">
                      <input 
                        className="btn add-more-button"
                        type="button"
                        onClick={this.addNetworkConfigurationParametes}
                        value="Add More" />
                        </div></div>
                    </div> ) : null}
                    {/* <TextBox
                      id={"minReqMem"}
                      labelName={"minReqMem"}
                      onChange={this.handleOnChange}
                      value={this.state.minReqMem}
                      required={true}
                    />
                    <TextBox
                      id={"maxReqMem"}
                      labelName={"maxReqMem"}
                      onChange={this.handleOnChange}
                      value={this.state.maxReqMem}
                      required={true}
                    />
                    <TextBox
                      id={"minReqCPU"}
                      labelName={"minReqCPU"}
                      onChange={this.handleOnChange}
                      value={this.state.minReqCPU}
                      required={true}
                    />
                    <TextBox
                      id={"maxReqCPU"}
                      labelName={"maxReqCPU"}
                      onChange={this.handleOnChange}
                      value={this.state.maxReqCPU}
                      required={true}
                    />
                    <TextBox
                      id={"maxPod"}
                      labelName={"maxPod"}
                      onChange={this.handleOnChange}
                      value={this.state.maxPod}
                      required={true}
                    />
                    <TextBox
                      id={"maxClaims"}
                      labelName={"maxClaims"}
                      onChange={this.handleOnChange}
                      value={this.state.maxClaims}
                      required={true}
                    />
                    <TextBox
                      id={"maxStorage"}
                      labelName={"maxStorage"}
                      onChange={this.handleOnChange}
                      value={this.state.maxStorage}
                      required={true}
                    />
                    <TextBox
                      id={"minPodStorage"}
                      labelName={"minPodStorage"}
                      onChange={this.handleOnChange}
                      value={this.state.minPodStorage}
                      required={true}
                    />
                    <TextBox
                      id={"maxPodStorage"}
                      labelName={"maxPodStorage"}
                      onChange={this.handleOnChange}
                      value={this.state.maxPodStorage}
                      required={true}
                    />
                    <TextBox
                      id={"minPodCPU"}
                      labelName={"minPodCPU"}
                      onChange={this.handleOnChange}
                      value={this.state.minPodCPU}
                      required={true}
                    />
                    <TextBox
                      id={"maxPodCPU"}
                      labelName={"maxPodCPU"}
                      onChange={this.handleOnChange}
                      value={this.state.maxPodCPU}
                      required={true}
                    />
                    <TextBox
                      id={"minPodMem"}
                      labelName={"minPodMem"}
                      onChange={this.handleOnChange}
                      value={this.state.minPodMem}
                      required={true}
                    />
                    <TextBox
                      id={"maxPodMem"}
                      labelName={"maxPodMem"}
                      onChange={this.handleOnChange}
                      value={this.state.maxPodMem}
                      required={true}
                    /> */}

                    <div className="form-group float-left">
                      <div className="col-sm-10">
                        <button
                          onClick={this.handleSubmit}
                          className="btn btn-success"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-10">
                        <button
                          onClick={this.handleReset}
                          className="btn btn-danger"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <h5 className="text-themecolor">{this.state.message}</h5>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateNameSpace;
