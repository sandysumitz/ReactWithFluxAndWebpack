import React, { Component, createFactory } from "react";
import CreateCluster from "./cluster/CreateCluster";
import MenuStore from "../stores/MenuStore";
import ActionType from "../constants/actionType";

class UnderConstruction extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor m-b-0 m-t-0">Under Construction</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-block">
                <img
                  src="../src/styles/images/UnderConstruction_xlarge.jpg"
                  alt="under construction"
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UnderConstruction;
