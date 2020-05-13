import { EventEmitter } from "events";
import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import EventType from "../constants/eventType";

class MenuStore extends EventEmitter {
  constructor() {
    super();
    Dispatcher.register(this.registerToActions);
    this.items = [
      {
        id: 1,
        name: "DashBoard",
        isActive: true,
      },
      {
        id: 2,
        name: "Cluster Management",
        isActive: false,
      },
    ];
  }
  registerToActions = (action) => {
    switch (action.actionType) {
      case ActionType.MENU_SELECT:
        this.updateMenu(action.value);
        this.emit(EventType.MENU_SELECTED);
        break;
      default:
        break;
    }
  };
  updateMenu = (item) => {
    const _items = Object.assign([], this.items).map((i) => {
      i.isActive = false;
      if (i.id === item.id) {
        i.isActive = true;
      }
      return i;
    });
  };
  getSelectedMenu = () => {
    return this.items.find((i) => i.isActive);
  };
  addEventListener = (eventName, callBack) => {
    this.on(eventName, callBack);
  };
  removeEventListener = (eventName, callBack) => {
    this.removeListener(eventName, callBack);
  };
}

export default new MenuStore();
