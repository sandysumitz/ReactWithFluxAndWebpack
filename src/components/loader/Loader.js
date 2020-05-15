import React, { Component } from "react";

class Loader extends Component {
  render() {
    return (
      <div
        style={{
          zIndex: "999999",
          width: "100%",
          height: "100%",
          position: "fixed",
        }}
      >
        <img
          src="../src/styles/images/loader1.gif"
          alt="loader"
          style={{
            width: "100px",
            top: "50%",
            height: "100px",
            position: "relative",
            left: "40%",
          }}
        />
      </div>
    );
  }
}

export default Loader;
