import React, { Component } from "react";

import SecurityStore from "../../stores/SecurityStore";
import SecurityActionCreator from "../../actionCreator/SecurityActionCreator";
import DashboardStore from "../../stores/DashBoardStore";

import DropDown from "../../components/generic/Dropdown";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.state.provider =[];
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
      loading: true
    };
  };

  securityAdded = (clusterID) => {
    this.setState({
      nodeCount: "",
      clusterName: "",
      message: messages.SECURITY.SECURITY_CREATED
    });
  };

  securityAddingFailed = () => {
    this.setState({
      message: messages.SECURITY.SOMETHING_WRONG,
    });
  };
  
  loadLookupOptionsData = () => {
    const provider = DashboardStore.getDropdownData("Provider", "cloudSrvc");

    this.setState({
      provider,
      loading: false
    });
  }

  componentDidMount() {
    this.loadLookupOptionsData();
    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_SUCCESS,
      this.securityAdded
    );
    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_FAILED,
      this.securityAddingFailed
    );
  }
  componentWillUnmount() {
    SecurityStore.removeEventListener(
      EventType.CREATE_SECURITY_SUCCESS,
      this.securityAdded
    );
    SecurityStore.removeEventListener(
      EventType.CREATE_SECURITY_FAILED,
      this.securityAddingFailed
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
    const { cloudSrvc, credentialName, subscriptionId, clientId, tenant, secret} = this.state;

    if (!cloudSrvc || !credentialName || !subscriptionId || !clientId || !tenant || !secret) {
      this.setState({
        message: messages.SECURITY.FIELD_MISSING,
      });
      return false;
    }
//TODO PARAMETER
    SecurityActionCreator.createSecurity({
      userId: "123",//TODO - Lgged in user id, correct after development of login 
      provider: this.state.cloudSrvc,
      name: this.state.credentialName,
      credntials: {
        subscriptionID: this.state.subscriptionId,
        clientID: this.state.clientId,
        tenant: this.state.tenant,
        secret: this.state.secret
      }
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
                  { this.state.loading ? null : (
                      <DropDown
                        data={this.state.provider}
                        value={this.state.cloudSrvc}
                        onChange={this.handleOnChange}
                      />) }
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
                          type="password"
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
                          type="password"
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
                          type="password"
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
                          type="password"
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
