import React, { Component } from "react";
import classNames from "classnames";

import DropDown from "../generic/Dropdown";
import Loader from "../loader/Loader";
import ClusterStore from "../../stores/ClusterStore";
import DashboardStore from "../../stores/DashBoardStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

class CreateCluster extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.state.lookupData = {
      provider: [],
      masterInstTypes: [],
      workerInstTypes: [],
      imageName: [],
      dashboard: [],
      credentials: [],
    };
    this.state.loading = true;
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
      imageName: "ubuntu",
      kubeDashboard: "KubernetesDashboard",
      loggingEnabled: "Y",
      monitoringEnabled: "N",
      cloudSrvcMissing: false,
      masterCountMissing: false,
      clusterNameMissing: false,
      credentialsMissing: false,
    };
  };

  clusterAdded = (clusterID) => {
    this.setState({
      nodeCount: "",
      clusterName: "",
      message: messages.CLUSTER.CLUSTER_CREATED + " : " + clusterID,
    });
  };

  loadLookupOptionsData = () => {
    const provider = DashboardStore.getDropdownData("Provider", "cloudSrvc");
    const masterInstTypes = DashboardStore.getDropdownData(
      "Master Instance Type",
      "masterSize"
    );
    const workerInstTypes = DashboardStore.getDropdownData(
      "Worker Instance Type",
      "nodeSize"
    );
    const imageName = DashboardStore.getDropdownData("Image Name", "imageName");
    const dashboard = DashboardStore.getDropdownData("Dashboard", "dashboard");
    const credentials = DashboardStore.getDropdownData(
      "Credentials",
      "credentials"
    );

    const lookupData = {
      provider,
      masterInstTypes,
      workerInstTypes,
      imageName,
      dashboard,
      credentials,
    };

    this.setState({
      loading: false,
      lookupData,
    });
  };

  clusterAddingFailed = () => {
    this.setState({
      message: messages.CLUSTER.SOMETHING_WRONG,
    });
  };

  componentDidMount() {
    this.loadLookupOptionsData();

    ClusterStore.addEventListener(
      EventType.CREATE_CLUSTER_SUCCESS,
      this.clusterAdded
    );
    ClusterStore.addEventListener(
      EventType.CREATE_CLUSTER_FAILED,
      this.clusterAddingFailed
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
  }

  handleReset = (event) => {
    event.preventDefault();
    this.setState(this.getInitialState());
  };
  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Missing"]: false,
      message: "",
    });
  };
  handleOnProviderChange = (event) => {
    let nodeSize = "";
    switch (event.target.value) {
      case "Azure":
        nodeSize = "Standard_B1ms";
        break;
      case "AKS":
        nodeSize = "Standard_B2s";
        break;
      default:
        break;
    }
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Missing"]: !nodeSize,
      nodeSize,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { nodeCount, clusterName, cloudSrvc, credentialName } = this.state;

    if (!nodeCount || !clusterName || !cloudSrvc) {
      // || !credentialName) { TODO - correct when lookupoption api return the value
      this.setState({
        message: messages.CLUSTER.FIELD_MISSING,
        nodeCountMissing: !nodeCount,
        cloudSrvcMissing: !cloudSrvc,
        clusterNameMissing: !clusterName,
        // credentialsMissing: !credentialName -- TODO: waiting for api correction
      });
      return false;
    }

    const requestParams = {
      cloudSrvc: this.state.cloudSrvc,
      masterCount:
        this.state.cloudSrvc === "Azure" ? this.state.masterCount : undefined,
      nodeCount: this.state.nodeCount,
      masterSize:
        this.state.cloudSrvc === "Azure" ? this.state.masterSize : undefined,
      nodeSize: this.state.nodeSize,
      clusterName: this.state.clusterName,
      imageName: this.state.imageName,
      kubeDashboard: this.state.kubeDashboard,
      loggingEnabled: this.state.loggingEnabled,
      monitoringEnabled: this.state.monitoringEnabled,
      credentialName: this.state.credentials,
    };
    Object.keys(requestParams).map(
      (key) => requestParams[key] === undefined && delete requestParams[key]
    );
    ClusterActionCreator.createCluster(requestParams);
  };

  render() {
    console.log("this.state.lookupData ---", this.state.lookupData.provider);
    if (this.state.loading || !this.state.lookupData.provider) {
      return <Loader />;
    }
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
                  <form className="form-horizontal form-material">
                    <DropDown
                      data={this.state.lookupData.provider}
                      value={this.state.cloudSrvc}
                      onChange={this.handleOnProviderChange}
                      mandatory={this.state.cloudSrvcMissing}
                      required={true}
                    />
                    <div className="form-group">
                      <label className="col-md-12 required">Cluster Name</label>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="clusterName"
                          required
                          value={this.state.clusterName}
                          onChange={this.handleOnChange}
                          className={classNames(
                            "form-control form-control-line",
                            this.state.clusterNameMissing ? "mandatory" : ""
                          )}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-12 required">
                        Number of Worker Nodes
                      </label>
                      <div className="col-md-12">
                        <input
                          name="nodeCount"
                          type="text"
                          required
                          value={this.state.nodeCount}
                          onChange={this.handleOnChange}
                          className={classNames(
                            "form-control form-control-line",
                            this.state.nodeCountMissing ? "mandatory" : ""
                          )}
                        />
                      </div>
                    </div>
                    {this.state.cloudSrvc === "Azure" ? (
                      <div className="form-group">
                        <label className="col-md-12 required">
                          Number of Master Nodes
                        </label>
                        <div className="col-md-12">
                          <input
                            type="text"
                            required
                            disabled
                            value={this.state.masterCount}
                            onChange={this.handleOnChange}
                            className={classNames(
                              "form-control form-control-line",
                              this.state.masterCountMissing ? "mandatory" : ""
                            )}
                          />
                        </div>
                      </div>
                    ) : null}
                    {this.state.cloudSrvc === "Azure" ? (
                      <DropDown
                        data={this.state.lookupData.masterInstTypes}
                        value={this.state.masterSize}
                        onChange={this.handleOnChange}
                      />
                    ) : null}
                    <DropDown
                      data={this.state.lookupData.workerInstTypes}
                      value={this.state.nodeSize}
                      onChange={this.handleOnChange}
                    />
                    <DropDown
                      data={this.state.lookupData.imageName}
                      value={this.state.imageName}
                      onChange={this.handleOnChange}
                    />
                    <DropDown
                      data={this.state.lookupData.dashboard}
                      value={this.state.kubeDashboard}
                      onChange={this.handleOnChange}
                    />
                    <div className="form-group">
                      <label className="col-sm-12">Enable Logging</label>
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          name="loggingEnabled"
                          id="log_yes"
                          value={"Y"}
                          defaultChecked
                          onChange={this.handleOnChange}
                        />
                        <label htmlFor="log_yes">Yes</label>
                      </div>
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          name="loggingEnabled"
                          id="log_no"
                          value={"N"}
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
                          name="monitoringEnabled"
                          id="monitor_yes"
                          value={"Y"}
                          onChange={this.handleOnChange}
                        />
                        <label htmlFor="monitor_yes">Yes</label>
                      </div>
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          name="monitoringEnabled"
                          id="monitor_no"
                          value={"N"}
                          defaultChecked
                          onChange={this.handleOnChange}
                        />
                        <label htmlFor="monitor_no">No</label>
                      </div>
                    </div>
                    <DropDown
                      data={this.state.lookupData.credentials}
                      value={this.state.credentials}
                      onChange={this.handleOnChange}
                      mandatory={this.state.credentialsMissing}
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

export default CreateCluster;
