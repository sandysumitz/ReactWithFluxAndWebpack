import React, { Component, createFactory } from "react";
import DashboardActionCreator from "../../actionCreator/DashboardActionCreator";
// import swal from "sweetalert";

class Dashboard extends Component {
  componentDidMount() {}
  handleClick = () => {
    // swal({
    //   title: "Are you sure?",
    //   buttons: true,
    // }).then((value) => {
    //   console.log("valuee---", value);
    // });
  };
  callbackMethod = () => {
    console.log("callbackMethod---");
  };
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
                  onClick={this.handleClick}
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

export default Dashboard;
