import React, { Component } from "react";
import classNames from "classnames";

class Loader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={classNames(
          !this.props.position ? "loaderWithPosFixed" : "loaderWithoutPosFixed"
        )}
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
