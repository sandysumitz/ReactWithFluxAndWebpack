import React, { Component } from "react";
import DropDown from "../generic/Dropdown";
import ClusterStore from "../../stores/ClusterStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

class CreateCluster extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      message: "",
      cloudSrvc: "Azure",
      masterCount: "1",
      nodeCount: "",
      masterSize: "Standard_B2s",
      nodeSize: "Standard_B1ms",
      clusterName: "",
      credentials: "Operations",
      imageName: "Ubuntu",
      dashboard: "Kubernetes",
      enableLogging: false,
      enableMonitoring: false,
      loading: true,
    };
  };

  clusterAdded = (clusterID) => {
    this.setState({
      nodeCount: "",
      clusterName: "",
      message: messages.CLUSTER.CLUSTER_CREATED + " : " + clusterID,
    });
  };

  lookupOptionsDataLoaded = (lookupData) => {
    console.log("lookupData :", lookupData);
    this.setState({
      loading: false,
    });
  };

  clusterAddingFailed = () => {
    this.setState({
      message: messages.CLUSTER.SOMETHING_WRONG,
    });
  };

  componentDidMount() {
    ClusterActionCreator.loadOptionsData();
    ClusterStore.addEventListener(
      EventType.CREATE_CLUSTER_SUCCESS,
      this.clusterAdded
    );
    ClusterStore.addEventListener(
      EventType.CREATE_CLUSTER_FAILED,
      this.clusterAddingFailed
    );
    ClusterStore.addEventListener(
      EventType.GET_LOOKUP_OPTIONS_DATA_SUCCESS,
      this.lookupOptionsDataLoaded
    );
  }
  componentWillUnmount() {
    ClusterStore.removeEventListener(
      EventType.CREATE_CLUSTER_SUCCESS,
      this.clusterAdded
    );
    ClusterStore.removeEventListener(
      EventType.CREATE_CLUSTER_FAILED,
      this.clusterAddingFailed
    );
    ClusterStore.removeEventListener(
      EventType.GET_LOOKUP_OPTIONS_DATA_SUCCESS,
      this.lookupOptionsDataLoaded
    );
  }

  handleReset = (event) => {
    event.preventDefault();
    this.setState(this.getInitialState());
  };
  handleOnChange = (event) => {
    console.log("event.target :", event.target.name);
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { nodeCount, clusterName, cloudSrvc } = this.state;

    if (!nodeCount || !clusterName) {
      this.setState({
        message: messages.CLUSTER.FIELD_MISSING,
      });
      return false;
    }

    ClusterActionCreator.createCluster({
      nodeCount: this.state.nodeCount,
      clusterName: this.state.clusterName,
      cloudSrvc: this.state.cloudSrvc,
    });
  };
  getDropdownData = (header, name, value, items) => {
    return {
      header,
      name,
      value,
      options: items,
    };
  };
  render() {
    console.log("this.state.enableLogging", this.state);
    const dropDownDataForProvider = this.getDropdownData(
      "Provider",
      "cloudSrvc",
      this.state.cloudSrvc,
      [
        {
          description: "Azure - Native",
          value: "Azure",
        },
        {
          description: "AKS",
          value: "AKS",
        },
      ]
    );
    const dropDownDataForMasterInstanceType = this.getDropdownData(
      "Master Instance Type",
      "masterSize",
      this.state.masterSize,
      [
        {
          description: "Standard_B2s",
          value: "Standard_B2s",
        },
      ]
    );
    const dropDownDataForWorkerInstanceType = this.getDropdownData(
      "Worker Instance Type",
      "nodeSize",
      this.state.nodeSize,
      [
        {
          description: "Standard_B1ms",
          value: "Standard_B1ms",
        },
      ]
    );
    const dropDownDataForImageName = this.getDropdownData(
      "Image Name",
      "imageName",
      this.state.imageName,
      [
        {
          description: "Ubuntu",
          value: "Ubuntu",
        },
        {
          description: "Centos",
          value: "Centos",
        },
      ]
    );
    const dropDownDataForDashboard = this.getDropdownData(
      "Dashboard",
      "dashboard",
      this.state.dashboard,
      [
        {
          description: "Kubernetes",
          value: "Kubernetes",
        },
        {
          description: "K8Dash",
          value: "K8Dash",
        },
      ]
    );
    const dropDownDataForCredentials = this.getDropdownData(
      "Credentials",
      "credentials",
      this.state.credentials,
      [
        {
          description: "Operations",
          value: "Operations",
        },
      ]
    );
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">Cluster Creation</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Cluster Management</h4>
                <div className="table-responsive">
                  {this.state.loading ? null : (
                    <form className="form-horizontal form-material">
                      <DropDown
                        data={dropDownDataForProvider}
                        onChange={this.handleOnChange}
                      />
                      <div className="form-group">
                        <label className="col-md-12">Cluster Name</label>
                        <div className="col-md-12">
                          <input
                            type="text"
                            name="clusterName"
                            required
                            value={this.state.clusterName}
                            onChange={this.handleOnChange}
                            className="form-control form-control-line"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-md-12">
                          Number of Worker Nodes
                        </label>
                        <div className="col-md-12">
                          <input
                            name="nodeCount"
                            type="text"
                            required
                            value={this.state.nodeCount}
                            onChange={this.handleOnChange}
                            className="form-control form-control-line"
                          />
                        </div>
                      </div>
                      {this.state.cloudSrvc === "Azure" ? (
                        <div className="form-group">
                          <label className="col-md-12">
                            Number of Master Nodes
                          </label>
                          <div className="col-md-12">
                            <input
                              type="text"
                              required
                              disabled
                              value={this.state.masterCount}
                              onChange={this.handleNodeChange}
                              className="form-control form-control-line"
                            />
                          </div>
                        </div>
                      ) : null}
                      {this.state.cloudSrvc === "Azure" ? (
                        <DropDown
                          data={dropDownDataForMasterInstanceType}
                          onChange={this.handleOnChange}
                        />
                      ) : null}
                      <DropDown
                        data={dropDownDataForWorkerInstanceType}
                        onChange={this.handleOnChange}
                      />
                      <DropDown
                        data={dropDownDataForImageName}
                        onChange={this.handleOnChange}
                      />
                      <DropDown
                        data={dropDownDataForDashboard}
                        onChange={this.handleOnChange}
                      />
                      <div className="form-group">
                        <label className="col-sm-12">Enable Logging</label>
                        <div className="col-sm-12">
                          <input
                            type="radio"
                            name="enableLogging"
                            id="log_yes"
                            value={true}
                            onChange={this.handleOnChange}
                          />
                          <label htmlFor="log_yes">Yes</label>
                        </div>
                        <div className="col-sm-12">
                          <input
                            type="radio"
                            name="enableLogging"
                            id="log_no"
                            value={false}
                            defaultChecked
                            onChange={this.handleOnChange}
                          />
                          <label htmlFor="log_no">No</label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-12">Enable Monitoring</label>
                        <div className="col-sm-12">
                          <input
                            type="radio"
                            name="enableMonitoring"
                            id="monitor_yes"
                            value={true}
                            onChange={this.handleOnChange}
                          />
                          <label htmlFor="monitor_yes">Yes</label>
                        </div>
                        <div className="col-sm-12">
                          <input
                            type="radio"
                            name="enableMonitoring"
                            id="monitor_no"
                            value={false}
                            defaultChecked
                            onChange={this.handleOnChange}
                          />
                          <label htmlFor="monitor_no">No</label>
                        </div>
                      </div>
                      <DropDown
                        data={dropDownDataForCredentials}
                        onChange={this.handleOnChange}
                      />

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
                        <h5 className="text-themecolor">
                          {this.state.message}
                        </h5>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateCluster;
