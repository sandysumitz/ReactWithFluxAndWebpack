import Dispatcher from "../dispatcher";
import ActionType from "../constants/actionType";
import WebApi from "../webapiutils/WebApi";

import config from "../../config.json";
import url from "../../url.json";

class SecurityActionCreator {
  createSecurity = (parameterList) => {
    WebApi.apiPost(config.API_URL + url.CREATE_SECURITY_ASYNC, parameterList)
      .then((response) => {
        const action = {
          actionType: ActionType.CREATE_SECURITY_SUCCESS,
          value: response.data.clusterID,
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
}
export default new SecurityActionCreator();
