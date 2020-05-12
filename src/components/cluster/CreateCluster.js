import React, { Component } from "react";
import axios from "axios";
import ClusterStore from "../../stores/ClusterStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

class CreateCluster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      cloudSrvc: "Azure",
      masterCount: "1",
      nodeCount: "",
      masterSize: "",
      nodeSize: "",
      clusterName: "",
      credentials: "",
      imageName: "",
      dashboard: "",
    };
  }

  afterAdding = (items) => {
    console.log("items added", items);
  };

  componentDidMount() {
    ClusterStore.addEventListener("addedNewItem", this.afterAdding);
  }
  componentWillUnmount() {
    ClusterStore.removeEventListener("addedNewItem", this.afterAdding);
  }

  handleNodeChange = (event) => {
    this.setState({ nodeCount: event.target.value });
  };
  handleClusterNameChange = (event) => {
    this.setState({ clusterName: event.target.value });
  };
  handleSelectChange = (event) => {
    console.log("event.target :", event.target.id);
    this.setState({ cloudSrvc: event.target.value });
  };

  handleAddItem = (event) => {
    event.preventDefault();
    console.log("handleAddItem");
    ClusterActionCreator.addNewItem("testinggg");
  };

  handleReset = () => {};

  handleSubmit = (event) => {
    event.preventDefault();
    const { nodeCount, clusterName, cloudSrvc } = this.state;

    if (!nodeCount || !clusterName) {
      this.setState({
        message: "Please enter valid inputs",
      });
      return false;
    }

    const payload = {
      nodeCount,
      clusterName,
      cloudSrvc,
    };
    axios
      .post(`http://104.211.206.68:8080/api/v1/createClusterAsync`, { payload })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        this.setState({
          nodeCount: "",
          clusterName: "",
          message: `Cluster created successfully : ${res.data.clusterID}`,
        });
      })
      .catch((e) => {
        console.log("errorrrr", e);
        this.setState({
          message: `Something went wrong!!`,
        });
      });
  };

  render() {
    console.log("ClusterStore.items", ClusterStore.items);
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
                          id="cloudSrvc"
                          className="form-control form-control-line"
                          value={this.state.cloudSrvc}
                          onChange={this.handleSelectChange}
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
                          required
                          value={this.state.clusterName}
                          onChange={this.handleClusterNameChange}
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
                          type="text"
                          required
                          value={this.state.nodeCount}
                          onChange={this.handleNodeChange}
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
                            id="masterSize"
                            className="form-control form-control-line"
                            value={this.state.masterSize}
                            onChange={this.handleSelectChange}
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
                          id="nodeSize"
                          className="form-control form-control-line"
                          value={this.state.nodeSize}
                          onChange={this.handleSelectChange}
                        >
                          <option value="Standard_B1ms">Standard_B1ms</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-12">Image Name</label>
                      <div className="col-sm-12">
                        <select
                          id="imageName"
                          className="form-control form-control-line"
                          value={this.state.imageName}
                          onChange={this.handleSelectChange}
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
                          id="dashboard"
                          className="form-control form-control-line"
                          value={this.state.dashboard}
                          onChange={this.handleSelectChange}
                        >
                          <option value="Kubernetes">Kubernetes</option>
                          <option value="K8Dash">K8Dash</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <label className="col-sm-12">Enable Logging</label>
                      <div class="col-sm-12">
                        <input
                          type="radio"
                          name="log"
                          id="log_yes"
                          value="option1"
                          checked
                        />
                        <label for="log_yes">Yes</label>
                      </div>
                      <div class="col-sm-12">
                        <input
                          type="radio"
                          name="log"
                          id="log_no"
                          value="option2"
                        />
                        <label for="log_no">No</label>
                      </div>
                    </div>
                    <div class="form-group">
                      <label className="col-sm-12">Enable Monitoring</label>
                      <div class="col-sm-12">
                        <input
                          type="radio"
                          name="monitor"
                          id="monitor_yes"
                          value="option1"
                          checked
                        />
                        <label for="monitor_yes">Yes</label>
                      </div>
                      <div class="col-sm-12">
                        <input
                          type="radio"
                          name="monitor"
                          id="monitor_no"
                          value="option2"
                        />
                        <label for="monitor_no">No</label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-12">Credentials</label>
                      <div className="col-sm-12">
                        <select
                          id="credentials"
                          className="form-control form-control-line"
                          value={this.state.credentials}
                          onChange={this.handleSelectChange}
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
