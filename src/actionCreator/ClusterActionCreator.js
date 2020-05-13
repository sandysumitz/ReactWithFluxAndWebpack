import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import WebApi from "../webapiutils/WebApi";

import config from "../../config.json";
import url from "../../url.json";

class ClusterActionCreator {
  addNewItem = (parameterList) => {

    WebApi.apiPost(config.API_URL + url.CREATE_CLUSTER_ASYNC, parameterList)
    .then ((response) => {
      const action = {
        actionType: ActionType.ADD_NEW_ITEM,
        value: response.data.clusterID
      };
      Dispatcher.dispatch(action);
      }) 
    .catch ((reject) => {
      const action = {
        actionType: ActionType.ADD_CLUSTER_FAILED
      };
      Dispatcher.dispatch(action);
    });
  }
}
export default new ClusterActionCreator();
