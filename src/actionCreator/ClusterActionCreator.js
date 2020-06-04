import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import WebApi from "../webapiutils/WebApi";

import config from "../../config.json";
import url from "../../url.json";

class ClusterActionCreator {
  createCluster = (parameterList) => {
    WebApi.apiPost(config.API_URL + url.CREATE_CLUSTER_ASYNC, parameterList)
      .then((response) => {
        const action = {
          actionType: ActionType.CREATE_CLUSTER,
          value: response.data.clusterID,
        };
        Dispatcher.dispatch(action);
      })
      .catch((reject) => {
        const action = {
          actionType: ActionType.CREATE_CLUSTER_FAILED,
        };
        Dispatcher.dispatch(action);
      });
  };

  updateClusterData = (data) => {
    const action = {
      actionType: ActionType.GET_LOOKUP_OPTIONS_DATA,
      value: data,
    };
    Dispatcher.dispatch(action);
  };
  loadIframe = () => {
    const action = {
      actionType: ActionType.LOAD_IFRAME,
      value: true,
    };
    Dispatcher.dispatch(action);
  };
}
export default new ClusterActionCreator();
