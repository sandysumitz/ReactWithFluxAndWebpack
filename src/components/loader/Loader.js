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
          className={classNames(
            !this.props.position ? "loaderBig" : "loaderSmall"
          )}
          src="../src/styles/images/loader1.gif"
          alt="loader"
        />
      </div>
    );
  }
}

export default Loader;
