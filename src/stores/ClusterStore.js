import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class ClusterStore extends EventEmitter {
  const;
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
    this.items = ["santhosh", "kumar"];
  }
  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.CREATE_CLUSTER:
        this.emit(EventType.CLUSTER_ITEM_SUCCESS, action.value);
        break;
      case ActionType.CREATE_CLUSTER_FAILED:
        this.emit(EventType.CREATE_CLUSTER_FAILED);
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

export default new ClusterStore();
