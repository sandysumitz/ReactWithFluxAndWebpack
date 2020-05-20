import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class SecurityStore extends EventEmitter {
  const;
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
    this.credentialsType = [
      {
        description: "Username and Password",
        value: "Username and Password",
      },
      {
        description: "Secret (key:value)",
        value: "Secret (key:value)",
      },
      {
        description: "SSH private key and username",
        value: "SSH private key and username",
      },
      {
        description: "SSH Key pair",
        value: "SSH Key pair",
      },
      {
        description: "Certificate",
        value: "Certificate",
      },
      {
        description: "AWS Credentials",
        value: "AWS Credentials",
      },
      {
        description: "Azure Service principal",
        value: "Azure Service principal",
      },
      {
        description: "GCP Credentials",
        value: "GCP Credentials",
      },
    ];
  }

  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.CREATE_SECURITY_SUCCESS:
        this.emit(EventType.CREATE_SECURITY_SUCCESS, action.value);
        break;
      case ActionType.CREATE_SECURITY_FAILED:
        this.emit(EventType.CREATE_SECURITY_FAILED);
        break;
      default:
        break;
    }
  };

  addEventListener = (eventName, callBack) => {
    this.on(eventName, callBack);
  };
  removeEventListener = (eventName, callBack) => {
    this.removeListener(eventName, callBack);
  };
}

export default new SecurityStore();
