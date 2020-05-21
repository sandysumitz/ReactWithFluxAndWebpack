import React, { Component } from "react";

import SecurityStore from "../../stores/SecurityStore";
import SecurityActionCreator from "../../actionCreator/SecurityActionCreator";
import DashboardStore from "../../stores/DashBoardStore";

import DropDown from "../generic/Dropdown";
import TextBox from "../generic/TextBox";

import Loader from "../loader/Loader";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";

import classNames from "classnames";

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.state.loading = true;
  }

  getInitialState = () => {
    return {
      message: "",
      credentialName: "LOB Azure Ops Credentials",
      componentsToRender: null,
      credentialsType: {
        header: "Credential Type",
        name: "selectedCredential",
        options: SecurityStore.getCredentialTypeOptions(),
      },
      selectedCredential: "",
      credentialList: [
        {
          credentialName: "InfyAzureCredential",
          credentialType: "azureServicePrincipal",
        },
        {
          credentialName: "InfyAWSCredential",
          credentialType: "awsCredential",
        },
        {
          credentialName: "InfyAWSCredential2020",
          credentialType: "awsCredential",
        },
      ],
    };
  };

  securityAdded = (clusterID) => {
    this.setState({
      nodeCount: "",
      clusterName: "",
      message: messages.SECURITY.SECURITY_CREATED,
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
      loading: false,
    });
  };

  getCredentialList = () => {
    return this.state.credentialList.map((credential) => {
      return (
        <tr key={credential.credentialName}>
          <td>{credential.credentialName}</td>
          <td>{credential.credentialType}</td>
          <td>
            <button
              id={credential.credentialName}
              onClick={this.handleDeleteCredential}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

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
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Missing"]: false,
    });
  };
  handleOnChange1 = (event) => {
    console.log("[event.target.id]--", event.target);
    console.log("[event.target.value]--", event.target.value);
    this.setState({
      [event.target.id]: event.target.value,
    });
  };
  handleCredentialsTypeOnChange = (event) => {
    const components = SecurityStore.getCredentialComponents(
      event.target.value
    );
    let newState = { [event.target.name]: event.target.value };
    let componentsToRender = null;
    let that = this;
    if (event.target.value !== "") {
      componentsToRender = components.map((component) => {
        newState[component.name] = "";
        return (
          <TextBox
            key={[component.name] + Date.now}
            id={[component.name]}
            labelName={[component.value]}
            onChange={that.handleOnChange1}
            value={that.state[component.name]}
            required={true}
          />
        );
      });
    }
    console.log("newState :", newState);
    newState["componentsToRender"] = componentsToRender;
    this.setState(newState);
  };
  handleToggle = (event) => {
    this.setState({
      [event.target.id]: !this.state[event.target.id],
    });
  };
  handleDeleteCredential = (event) => {
    event.preventDefault();
    console.log("event.target.id---", event.target.id);
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const {
      cloudSrvc,
      credentialName,
      subscriptionId,
      clientId,
      tenant,
      secret,
    } = this.state;

    if (
      !cloudSrvc ||
      !credentialName ||
      !subscriptionId ||
      !clientId ||
      !tenant ||
      !secret
    ) {
      this.setState({
        message: messages.SECURITY.FIELD_MISSING,
        cloudSrvcMissing: !cloudSrvc,
        credentialNameMissing: !credentialName,
        subscriptionIdMissing: !subscriptionId,
        clientIdMissing: !clientId,
        tenantMissing: !tenant,
        secretMissing: !secret,
      });
      return false;
    }
    //TODO PARAMETER
    SecurityActionCreator.createSecurity({
      userId: "123", //TODO - Lgged in user id, correct after development of login
      provider: this.state.cloudSrvc,
      name: this.state.credentialName,
      credntials: {
        subscriptionID: this.state.subscriptionId,
        clientID: this.state.clientId,
        tenant: this.state.tenant,
        secret: this.state.secret,
      },
    });
  };

  render() {
    console.log("this.state --", this.state);
    // if (this.state.loading || !this.state.provider) {
    //   return <Loader />;
    // }
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">Security</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-xlg-3 col-md-5">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Credential List</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Credential Name</th>
                        <th>Credential Type</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>{this.getCredentialList()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xlg-9 col-md-7">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Security</h4>
                <div className="table-responsive">
                  <form className="form-horizontal form-material">
                    <DropDown
                      data={this.state.credentialsType}
                      value={this.state.selectedCredential}
                      onChange={this.handleCredentialsTypeOnChange}
                      required={true}
                    />
                    <TextBox
                      id={"credentialName"}
                      labelName={"Name"}
                      onChange={this.handleOnChange1}
                      value={this.state.credentialName}
                      required={true}
                    />
                    <TextBox
                      id={"credentialDescription"}
                      labelName={"Description"}
                      onChange={this.handleOnChange1}
                      value={this.state.credentialDescription}
                    />
                    {this.state.componentsToRender}
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
