import React, { Component, createFactory } from "react";
import CreateCluster from "./cluster/CreateCluster";
import UnderConstruction from "./UnderConstruction";
import MenuStore from "../stores/MenuStore";
import ActionType from "../constants";

class PageWrapper extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    MenuStore.addEventListener(ActionType.MENU_SELECTED, this.menuSeleted);
  }
  componentWillUnmount() {
    MenuStore.removeEventListener(ActionType.MENU_SELECTED, this.menuSeleted);
  }
  menuSeleted = () => {
    this.setState({
      renderedOn: Date.now(),
    });
  };
  componentToRender = () => {
    let component = <UnderConstruction />;
    const selectedMenu = MenuStore.getSelectedMenu();
    switch (selectedMenu.name) {
      case "DashBoard":
        break;
      case "Cluster Management":
        component = <CreateCluster />;
        break;
      default:
        break;
    }
    return component;
  };
  render() {
    return <div className="page-wrapper">{this.componentToRender()}</div>;
  }
}

export default PageWrapper;
