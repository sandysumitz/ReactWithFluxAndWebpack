import React, { Component } from "react";
import axios from "axios";

import ClusterStore from "../../stores/ClusterStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      message: "",
      cloudSrvc: "Azure",
      credentialName: "LOB Azure Ops Credentials",
      subscriptionId: "",
      clientId: "",
      tenant: "",
      secret: "",
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
  };

  componentDidMount() {
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

  render() {
    console.log("this.state.enableLogging", this.state);
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">Security</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Security</h4>
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
                      <label className="col-md-12">Credential Name</label>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="credentialName"
                          required
                          value={this.state.credentialName}
                          onChange={this.handleOnChange}
                          className="form-control form-control-line"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-12">Subscription ID</label>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="subscriptionId"
                          required
                          value={this.state.subscriptionId}
                          onChange={this.handleOnChange}
                          className="form-control form-control-line"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-12">Client ID</label>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="clientId"
                          required
                          value={this.state.clientId}
                          onChange={this.handleOnChange}
                          className="form-control form-control-line"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-12">Tenant</label>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="tenant"
                          required
                          value={this.state.tenant}
                          onChange={this.handleOnChange}
                          className="form-control form-control-line"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-12">Secret</label>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="secret"
                          required
                          value={this.state.secret}
                          onChange={this.handleOnChange}
                          className="form-control form-control-line"
                        />
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

export default Security;
