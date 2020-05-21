import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class SecurityStore extends EventEmitter {
  const;
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
    this.lookupOptionData = {
      credComponentsList: [
        {
          credentialType: "AzureServicePrinciple",
          components: [
            {
              name: "subscriptionId",
              value: "Subscription ID",
              isRequired: true
            },
            { name: "clientId", value: "Client ID", isRequired: true },
            { name: "tenant", value: "Tenant", isRequired:true },
            { name: "secret", value: "Secret", isRequired: false },
          ],
        },
        {
          credentialType: "awsCredntial",
          components: [
            {
              name: "accessKey",
              value: "Access Key",
              isRequired: true
            },
            { name: "scretKey", value: "Secret Key", isRequired: false },
          ],
        },
      ],
    };
  }

  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.CREATE_SECURITY_SUCCESS:
        this.emit(EventType.CREATE_SECURITY_SUCCESS, action.value);
        break;
      case ActionType.CREATE_SECURITY_FAILED:
        this.emit(EventType.CREATE_SECURITY_FAILED);
        break;
      case ActionType.GET_LOOKUP_OPTIONS_DATA:
        // this.lookupOptionData = action.value;
        this.getCredentialComponents("AzureServicePrinciple");
        break;
      default:
        break;
    }
  };

  getCredentialComponents(credentialType) {
    const credentialsList = this.lookupOptionData.credComponentsList;
    const credential = credentialsList.find(
      (item) => item.credentialType === credentialType
    );

    return credential && credential.components;
  }

  getCredentialTypeOptions = () => {
    return this.lookupOptionData.credComponentsList.map((item) => {
      return {
        description: item.credentialType,
        value: item.credentialType,
      };
    });
  };

  addEventListener = (eventName, callBack) => {
    this.on(eventName, callBack);
  };
  removeEventListener = (eventName, callBack) => {
    this.removeListener(eventName, callBack);
  };
}

export default new SecurityStore();
