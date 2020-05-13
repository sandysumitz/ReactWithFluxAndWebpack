import React, { Component } from "react";
import classNames from "classnames";

class Item extends Component {
  constructor(props) {
    super(props);
  }
  generateOptions = () => {
    const { data } = this.props;
    console.log("data.options :", data.options);
    const options = data.options.map((option) => {
      return <option value={option.value}>{option.description}</option>;
    });
    return options;
  };
  render() {
    const options = this.generateOptions();
    const { data, onChange } = this.props;
    return (
      <div className="form-group">
        <label className="col-sm-12">{data.header}</label>
        <div className="col-sm-12">
          <select
            name={data.name}
            className="form-control form-control-line"
            value={data.value}
            onChange={onChange}
          >
            {options}
          </select>
        </div>
      </div>
    );
  }
}

export default Item;
