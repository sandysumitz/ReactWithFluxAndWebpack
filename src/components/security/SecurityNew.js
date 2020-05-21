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
      credentialName: "",
      credentialsType: {
        // ToDo--- from db
        header: "Credential Type",
        name: "selectedCredential",
        options: SecurityStore.getCredentialTypeOptions(),
      },
      selectedCredential: "",
      credentialList: [],
      credentialData: {},
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

  credentialsReturned = () => {
    this.setState({
      credentialList: SecurityStore.credentialsList,
    });
  };

  credentialsDeleted = () => {
    SecurityActionCreator.getCredentialList(123);
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
    SecurityActionCreator.getCredentialList(123);
    this.loadLookupOptionsData();
    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_SUCCESS,
      this.securityAdded
    );
    SecurityStore.addEventListener(
      EventType.CREATE_SECURITY_FAILED,
      this.securityAddingFailed
    );
    SecurityStore.addEventListener(
      EventType.GET_CREDENTIALS_SUCCESS,
      this.credentialsReturned
    );
    SecurityStore.addEventListener(
      EventType.DELETE_CREDENTIAL_SUCCESS,
      this.credentialsDeleted
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
    SecurityStore.removeEventListener(
      EventType.GET_CREDENTIALS_SUCCESS,
      this.credentialsReturned
    );
    SecurityStore.removeEventListener(
      EventType.DELETE_CREDENTIAL_SUCCESS,
      this.credentialsDeleted
    );
  }

  handleReset = (event) => {
    event.preventDefault();
    this.setState(this.getInitialState());
  };
  handleOnChange = (event) => {
    console.log("[event.target.id]--", event.target);
    console.log("[event.target.value]--", event.target.value);

    let credentialData = Object.assign({}, this.state.credentialData);
    credentialData[event.target.id] = event.target.value;
    this.setState({ credentialData: credentialData });
  };
  isInValid = () => {
    const { credentialData, selectedCredential } = this.state;
    const components = SecurityStore.getCredentialComponents(
      selectedCredential
    );
    if (!components) {
      return true;
    }
    return components.some((component) => {
      return (component.isRequired && !credentialData[component.name]);
    });
  };
  handleCredentialsTypeOnChange = (event) => {
    this.setState({
      credentialData: {},
      [event.target.name]: event.target.value,
    });
  };

  getComponentsToRender = () => {
    const components = SecurityStore.getCredentialComponents(
      this.state.selectedCredential
    );
    if (!components) {
      return null;
    }
    let toRender = [];
    let credentialNameComp = (
      <TextBox
        id={"credentialName"}
        labelName={"Name"}
        onChange={this.handleOnChange}
        value={this.state.credentialData.credentialName}
        required={true}
      />
    );
    let credentialDescComp = (
      <TextBox
        id={"credentialDescription"}
        labelName={"Description"}
        onChange={this.handleOnChange}
        value={this.state.credentialData.credentialDescription}
      />
    );
    toRender.push(credentialNameComp);
    toRender.push(credentialDescComp);
    let dynamicComp = components.map((component) => {
      return (
        <TextBox
          key={[component.name] + Date.now}
          id={[component.name]}
          labelName={[component.value]}
          onChange={this.handleOnChange}
          value={this.state.credentialData[component.name]}
          required={true}
        />
      );
    });
    toRender.push(dynamicComp);
    return toRender;
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
    if ( this.isInValid() ) {
      this.setState({
        message: messages.SECURITY.FIELD_MISSING
      });
      return false;
    }
    let that = this;
    let selectedComponentItems = {};
    let selectedCredentialComponents = SecurityStore.getCredentialComponents(
      this.state.selectedCredential
    );
    selectedCredentialComponents.map(component => {
      selectedComponentItems[component.name] = that.state.credentialData[component.name];
    })
    //TODO PARAMETER
    SecurityActionCreator.createSecurity({
      userId: "123", //TODO - Lgged in user id, correct after development of login
      name: this.state.credentialData.credentialName,
      azurePrincipal: selectedComponentItems
    });
  };
  render() {
    console.log("this.state---", this.state);
    if (this.state.loading) {
      return <Loader />;
    }
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

                    {this.getComponentsToRender()}
                    <div className="form-group float-left">
                      <div className="col-sm-10">
                        <button
                          disabled={this.isInValid()}
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
