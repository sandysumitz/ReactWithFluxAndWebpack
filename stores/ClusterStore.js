import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants";

class ClusterStore extends EventEmitter {
  constructor() {
    super();
    console.log("store constructor");
    Dispatcher.register(this.registerToActions);
    this.items = ["santhosh", "kumar"];
  }
  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.ADD_NEW_ITEM:
        console.log("store case");
        this.items.push("sandy");
        this.emit("addedNewItem");
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
