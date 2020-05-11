import React, { Component } from "react";
import axios from "axios";
import ClusterStore from "../../stores/ClusterStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

class CreateCluster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeCount: "",
      clusterName: "",
      message: "",
      cloudSrvc: "Azure",
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
    this.setState({ cloudSrvc: event.target.value });
  };

  handleAddItem = (event) => {
    event.preventDefault();
    console.log("handleAddItem");
    ClusterActionCreator.addNewItem("testinggg");
  };

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
                <h4 className="card-title">Create New Cluster</h4>
                <div className="table-responsive">
                  <form className="form-horizontal form-material">
                    <div className="form-group">
                      <label className="col-md-12">No of Nodes</label>
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
                      <label className="col-sm-12">Cloud Provider</label>
                      <div className="col-sm-12">
                        <select
                          className="form-control form-control-line"
                          value={this.state.cloudSrvc}
                          onChange={this.handleSelectChange}
                        >
                          <option value="Azure">Azure</option>
                          <option value="AKS">AKS</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
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
