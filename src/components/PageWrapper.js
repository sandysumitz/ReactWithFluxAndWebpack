import React, { Component, createFactory } from "react";
import CreateCluster from "./cluster/CreateCluster";
import Security from "./security/Security";
import UnderConstruction from "./UnderConstruction";
import DashBoard from "./dashboard/Dashboard";
import MenuStore from "../stores/MenuStore";
import EventType from "../constants/eventType";

class PageWrapper extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    MenuStore.addEventListener(EventType.MENU_SELECTED, this.menuSeleted);
  }
  componentWillUnmount() {
    MenuStore.removeEventListener(EventType.MENU_SELECTED, this.menuSeleted);
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
        component = <DashBoard />;
        break;
      case "Cluster Management":
        component = <CreateCluster />;
        break;
      case "Security":
        component = <Security />;
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
