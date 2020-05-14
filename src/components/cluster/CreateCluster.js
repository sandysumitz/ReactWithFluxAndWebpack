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
    this.state.lookupData = {
      provider: [],
      masterInstTypes: [],
      workerInstTypes: [],
      imageName: [],
      dashboard: [],
      credentials: [],
    };
  }

  getInitialState = () => {
    return {
      message: "",
      cloudSrvc: "",
      masterCount: "1",
      nodeCount: "",
      masterSize: "",
      nodeSize: "",
      clusterName: "",
      credentials: "",
      imageName: "",
      dashboard: "",
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

  lookupOptionsDataLoaded = () => {
    const provider = this.getDropdownData("Provider", "cloudSrvc");
    const masterInstTypes = this.getDropdownData(
      "Master Instance Type",
      "masterSize"
    );
    const workerInstTypes = this.getDropdownData(
      "Worker Instance Type",
      "nodeSize"
    );
    const imageName = this.getDropdownData("Image Name", "imageName");
    const dashboard = this.getDropdownData("Dashboard", "dashboard");
    const credentials = this.getDropdownData("Credentials", "credentials");

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
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { nodeCount, clusterName, cloudSrvc } = this.state;
    console.log("this.state --- ", this.state);

    // if (!nodeCount || !clusterName) {
    //   this.setState({
    //     message: messages.CLUSTER.FIELD_MISSING,
    //   });
    //   return false;
    // }

    // ClusterActionCreator.createCluster({
    //   nodeCount: this.state.nodeCount,
    //   clusterName: this.state.clusterName,
    //   cloudSrvc: this.state.cloudSrvc,
    // });
  };
  getDropdownData = (header, name, value) => {
    let options = [];
    const optionsData = this.getOptions();
    switch (header) {
      case "Provider":
        const _filter = optionsData.find((option) => {
          return Object.keys(option)[0] === "provider";
        });
        options = _filter["provider"];
        console.log("options", options);
        break;
      case "Master Instance Type":
        const _filter1 = optionsData.find((option) => {
          return Object.keys(option)[0] === "masterInstTypes";
        });
        options = _filter1["masterInstTypes"];
        console.log("options", options);
        break;
      case "Worker Instance Type":
        const _filter2 = optionsData.find((option) => {
          return Object.keys(option)[0] === "workerInstTypes";
        });
        options = _filter2["workerInstTypes"];
        console.log("options", options);
        break;
      case "Image Name":
        const _filter3 = optionsData.find((option) => {
          return Object.keys(option)[0] === "imageName";
        });
        options = _filter3["imageName"];
        console.log("options", options);
        break;
      case "Dashboard":
        const _filter4 = optionsData.find((option) => {
          return Object.keys(option)[0] === "dashboard";
        });
        options = _filter4["dashboard"];
        console.log("options", options);
        break;
      case "Credentials":
        const _filter5 = optionsData.find((option) => {
          return Object.keys(option)[0] === "credentials";
        });
        options = _filter5 && _filter5["credentials"];
        console.log("options", options);
        break;
    }

    return {
      header,
      name,
      value,
      options,
    };
  };

  getOptions = () => {
    const options = ClusterStore.lookupOptionData;
    const data = Object.keys(options).map((_key) => {
      const item = options[_key];
      console.log(_key);
      return {
        [_key]: Object.keys(item).map((key) => {
          return {
            description: item[key],
            value: key,
          };
        }),
      };
    });
    console.log("providerdata :", data);
    return data;
  };

  render() {
    //this.getOptions();
    console.log("this.state---- render", this.state);
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
                        data={this.state.lookupData.provider}
                        value={this.state.cloudSrvc}
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
                        value={this.state.dashboard}
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
                        data={this.state.lookupData.credentials}
                        value={this.state.credentials}
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
