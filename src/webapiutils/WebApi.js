import axios from "axios";

class WebAPi {

    apiPost = ( uri, parameterList) => {
      var response;
        return new Promise((resolve, reject) => {
           response = axios.post(uri, parameterList)
           .then((response) => {return resolve(response)})
           .catch((e) => {return reject(e)});
        });
        
    }
}

export default new WebAPi();