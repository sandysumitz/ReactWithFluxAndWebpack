import React, { Component } from "react";
import MenuActionCreator from "../../actionCreator/MenuActionCreator";
import MenuStore from "../../stores/MenuStore";
import Item from "./Item";
import ActionType from "../../constants";

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedOn: null,
    };
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
  hadleClick = (item) => {
    console.log("handle click");
    MenuActionCreator.selectMenuItem(item);
  };
  render() {
    const items = MenuStore.items.map((item, i) => {
      return (
        <Item
          key={item.id}
          onClick={() => {
            this.hadleClick(item);
          }}
          isActive={item.isActive}
          name={item.name}
        />
      );
    });
    return items;
  }
}

export default MenuItem;
