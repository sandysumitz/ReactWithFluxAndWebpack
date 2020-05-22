import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import WebApi from "../webapiutils/WebApi";

import config from "../../config.json";
import url from "../../url.json";

class SecurityActionCreator {
  createSecurity = (parameterList) => {
    WebApi.apiPost(config.API_URL + url.SAVE_CREDENTIALS, parameterList)
      .then((response) => {
        const action = {
          actionType: ActionType.CREATE_SECURITY_SUCCESS
        };
        Dispatcher.dispatch(action);
      })
      .catch((reject) => {
        const action = {
          actionType: ActionType.CREATE_SECURITY_FAILED,
        };
        Dispatcher.dispatch(action);
      });
  };
  getCredentialList = (parameterList) => {
    WebApi.apiPost(config.API_URL + url.GET_CREDENTIALS, parameterList)
      .then((response) => {
        const action = {
          actionType: ActionType.GET_CREDENTIALS_SUCCESS,
          data: response
        };
        Dispatcher.dispatch(action);
      })
      .catch((reject) => {
        const action = {
          actionType: ActionType.GET_CREDENTIALS_FAILED,
        };
        Dispatcher.dispatch(action);
      });
    // let 
    // credentialList = [
    //   // ToDo--- from db
    //   {
    //     credentialName: "InfyAzureCredential",
    //     credentialType: "azureServicePrincipal",
    //   },
    //   {
    //     credentialName: "InfyAzureCredential",
    //     credentialType: "azureServicePrincipal2020",
    //   },
    //   {
    //     credentialName: "InfyAWSCredential",
    //     credentialType: "awsCredential",
    //   },
    //   {
    //     credentialName: "InfyAWSCredential2020",
    //     credentialType: "awsCredential",
    //   }
    // ];
    // const action = {
    //   actionType: ActionType.GET_CREDENTIALS_SUCCESS,
    //     data: credentialList
    //   };
    // Dispatcher.dispatch(action);
  };
  deleteCredential = (parameterList) => {
    WebApi.apiPost(config.API_URL + url.DELETE_CREDENTIALS, parameterList)
      .then((response) => {
        const action = {
          actionType: ActionType.CREDENTIAL_DELETED
        };
        Dispatcher.dispatch(action);
      })
      .catch((reject) => {
        const action = {
          actionType: ActionType.CREDENTIAL_DELETE_FAILED,
        };
        Dispatcher.dispatch(action);
      });
  };
}
export default new SecurityActionCreator();
