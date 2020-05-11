import Dispatcher from "../dispatcher";
import ActionType from "../constants";

class MenuActionCreator {
  selectMenuItem = (item) => {
    console.log("action creator");
    const action = {
      actionType: ActionType.MENU_SELECT,
      value: item,
    };
    Dispatcher.dispatch(action);
  };
}
export default new MenuActionCreator();
