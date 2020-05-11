import Dispatcher from "../dispatcher";
import ActionType from "../constants";

class ClusterActionCreator {
  addNewItem = (item) => {
    console.log("action creator");
    const action = {
      actionType: ActionType.ADD_NEW_ITEM,
      value: item,
    };
    Dispatcher.dispatch(action);
  };
}
export default new ClusterActionCreator();
