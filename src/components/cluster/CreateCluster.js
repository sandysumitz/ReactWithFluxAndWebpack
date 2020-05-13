import React, { Component } from "react";
import axios from "axios";

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
    };
  };
  
  clusterAdded = (clusterID) => {
    this.setState({
      nodeCount: "",
      clusterName: "",
      message: messages.CLUSTER.CLUSTER_CREATED + " : " + clusterID,
    });
  };

  clusterAddingFailed = () => {
    this.setState({
      message: messages.CLUSTER.SOMETHING_WRONG,
    });
  }

  componentDidMount() {
    ClusterStore.addEventListener(EventType.CLUSTER_ITEM_ADDED, this.clusterAdded);
    ClusterStore.addEventListener(EventType.ADD_CLUSTER_FAILED, this.clusterAddingFailed);
  }
  componentWillUnmount() {
    ClusterStore.removeEventListener(EventType.CLUSTER_ITEM_ADDED, this.clusterAdded);
    ClusterStore.removeEventListener(EventType.ADD_CLUSTER_FAILED, this.clusterAddingFailed);
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

    ClusterActionCreator.addNewItem({ "nodeCount": this.state.nodeCount,
      "clusterName": this.state.clusterName, "cloudSrvc": this.state.cloudSrvc });
  };

  render() {
    console.log("this.state.enableLogging", this.state);
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
                    <div className="form-group">
                      <label className="col-sm-12">Provider</label>
                      <div className="col-sm-12">
                        <select
                          name="cloudSrvc"
                          className="form-control form-control-line"
                          value={this.state.cloudSrvc}
                          onChange={this.handleOnChange}
                        >
                          <option value="Azure">Azure - Native</option>
                          <option value="AKS">AKS</option>
                        </select>
                      </div>
                    </div>
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
                      <div className="form-group">
                        <label className="col-sm-12">
                          Master Instance Type
                        </label>
                        <div className="col-sm-12">
                          <select
                            name="masterSize"
                            className="form-control form-control-line"
                            value={this.state.masterSize}
                            onChange={this.handleOnChange}
                          >
                            <option value="Standard_B2s">Standard_B2s</option>
                          </select>
                        </div>
                      </div>
                    ) : null}
                    <div className="form-group">
                      <label className="col-sm-12">Worker Instance Type</label>
                      <div className="col-sm-12">
                        <select
                          name="nodeSize"
                          className="form-control form-control-line"
                          value={this.state.nodeSize}
                          onChange={this.handleOnChange}
                        >
                          <option value="Standard_B1ms">Standard_B1ms</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-12">Image Name</label>
                      <div className="col-sm-12">
                        <select
                          name="imageName"
                          className="form-control form-control-line"
                          value={this.state.imageName}
                          onChange={this.handleOnChange}
                        >
                          <option value="Ubuntu">Ubuntu</option>
                          <option value="Centos">Centos</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-12">Dashboard</label>
                      <div className="col-sm-12">
                        <select
                          name="dashboard"
                          className="form-control form-control-line"
                          value={this.state.dashboard}
                          onChange={this.handleOnChange}
                        >
                          <option value="Kubernetes">Kubernetes</option>
                          <option value="K8Dash">K8Dash</option>
                        </select>
                      </div>
                    </div>
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
                    <div className="form-group">
                      <label className="col-sm-12">Credentials</label>
                      <div className="col-sm-12">
                        <select
                          name="credentials"
                          className="form-control form-control-line"
                          value={this.state.credentials}
                          onChange={this.handleOnChange}
                        >
                          <option value="Operations">Operations</option>
                        </select>
                      </div>
                    </div>

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
