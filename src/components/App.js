import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./sideBar/Sidebar";
import PageWrapper from "./PageWrapper";
import Loader from "./loader/Loader";
import DashboardActionCreator from "../actionCreator/DashboardActionCreator";
import DashboardStore from "../stores/DashBoardStore";
import ClusterStore from "../stores/ClusterStore";
import EventType from "../constants/eventType";
import config from "../../config.json";
import url from "../../url.json";
import classNames from "classnames";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      isMenuHidden: false,
    };
    this.eventSource = new EventSource(config.API_URL + url.GET_CLUSTER_STATUS);
  }
  lookupOptionDataLoaded = () => {
    this.setState({
      loading: false,
    });
  };
  iframeLoaded = () => {
    console.log("iframeLoaded");
    this.setState({
      isMenuHidden: true,
    });
  };
  toggleMenu = () => {
    this.setState({
      isMenuHidden: !this.state.isMenuHidden,
    });
  };
  updateClusterStatus = (result) => {
    const { data } = this.state;
    const updatedData = Object.assign([], data);
    const output =
      updatedData &&
      updatedData.find((item) => {
        return item.clusterReqId === result.clusterReqId;
      });
    if (!output) {
      updatedData.push(result);
    } else {
      let item = Object.assign({}, output);
      item.clusterName = result.clusterName;
      item.createStatus = result.createStatus;
      item.createTime = result.createTime;
      item.createUser = result.createUser;
      item.id = result.id;
      item.k8sDashboardUrl = result.k8sDashboardUrl;
      item.clusterReqId = result.clusterReqId;
      updatedData[result.clusterReqId] = item;
    }
    this.setState({
      data: Object.assign([], updatedData),
    });
  };
  componentDidMount() {
    console.log(this.state);
    DashboardActionCreator.loadOptionsData();
    DashboardStore.addEventListener(
      EventType.GET_LOOKUP_OPTIONS_DATA_SUCCESS,
      this.lookupOptionDataLoaded
    );
    ClusterStore.addEventListener(EventType.LOAD_IFRAME, this.iframeLoaded);
    this.eventSource.onmessage = (e) =>
      this.updateClusterStatus(JSON.parse(e.data));
  }
  componentWillUnmount() {
    DashboardStore.removeEventListener(
      EventType.GET_LOOKUP_OPTIONS_DATA_SUCCESS,
      this.lookupOptionDataLoaded
    );
    ClusterStore.removeEventListener(EventType.LOAD_IFRAME, this.iframeLoaded);
  }
  render() {
    console.log("this.state.isMenuHidden---", this.state.isMenuHidden);
    const toRender = this.state.loading ? (
      <div id="main-wrapper">
        <Header />
        <Loader />
      </div>
    ) : (
      <div
        id="main-wrapper"
        className={classNames(this.state.isMenuHidden ? "hide-sidebar" : "")}
      >
        <Header onClick={this.toggleMenu} />
        <PageWrapper clusterData={this.state.data} />
        <Sidebar />
      </div>
    );
    return toRender;
  }
}

export default App;
