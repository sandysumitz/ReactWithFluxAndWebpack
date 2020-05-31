import React, { Component } from "react";
import classNames from "classnames";

import DropDown from "../generic/Dropdown";
import Loader from "../loader/Loader";
import ClusterStore from "../../stores/ClusterStore";
import DashboardStore from "../../stores/DashBoardStore";
import ClusterActionCreator from "../../actionCreator/ClusterActionCreator";

import EventType from "../../constants/eventType";
import messages from "../../messges.json";
import ClusterStatus from "./ClusterStatus";
import CreateCluster from "./CreateCluster";

class ClusterWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isStatus: true,
      isIframe: false,
      iFrameUrl: null,
      searchValue: "",
      loading: true,
    };
    this.eventSource = new EventSource(
      "http://104.211.206.68:8080/api/v1/clusterStatus"
    );
  }

  getInitialState = () => {
    return {};
  };

  handleToggle = () => {
    this.setState({
      isStatus: !this.state.isStatus,
    });
  };
  handleOnChange = (event) => {
    this.setState({
      searchValue: event.target.value,
    });
  };
  handleNavigate = (event) => {
    console.log(event.target.dataset.url);
    this.setState({
      isIframe: true,
      iFrameUrl: event.target.dataset.url,
    });
  };
  iframeLoaded = () => {
    console.log("iframeLoaded----");
    var iFrameID = document.getElementById("idIframe");
    if (iFrameID) {
      iFrameID.height = "";
      iFrameID.height =
        iFrameID.contentWindow.document.body.scrollHeight + "px";
      iFrameID.width = "";
      iFrameID.width = iFrameID.contentWindow.document.body.scrollWidth + "px";
    }
  };
  getIframe = () => {
    const { iFrameUrl } = this.state;
    const ifrm =
      "<iframe id='idIframe' onload='iframeLoaded()' height='100%' style='width: 500%;' scrolling='no' title='fx.' src='https://40.121.45.23/' frameborder='no' allowtransparency='true' allowfullscreen='true'>Dashboard</iframe>";

    return <div dangerouslySetInnerHTML={{ __html: ifrm }} />;
  };
  getFilteredData = () => {
    const { data, searchValue } = this.state;
    const filteredData = data
      ? data.filter((item) => {
          return (
            (item.createStatus &&
              item.createStatus
                .toLowerCase()
                .startsWith(searchValue.toLowerCase())) ||
            (item.clusterName &&
              item.clusterName
                .toLowerCase()
                .startsWith(searchValue.toLowerCase()))
          );
        })
      : [];
    console.log("filteredData---", filteredData);
    return filteredData;
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
      loading: false,
    });
  };
  componentDidMount() {
    this.eventSource.onmessage = (e) =>
      this.updateClusterStatus(JSON.parse(e.data));
  }
  componentWillUnmount() {}

  renderComponents = () => {
    const { isStatus, isIframe, searchValue, loading } = this.state;
    let toRender = null;
    if (isIframe) {
      toRender = this.getIframe();
    } else if (isStatus) {
      const filteredData = this.getFilteredData();
      toRender = (
        <ClusterStatus
          onClick={this.handleToggle}
          onChange={this.handleOnChange}
          data={filteredData}
          searchValue={searchValue}
          loading={loading}
          navigate={this.handleNavigate}
        />
      );
    } else {
      toRender = <CreateCluster onClick={this.handleToggle} />;
    }
    return toRender;
  };

  render() {
    let toRender = this.renderComponents();
    return toRender;
  }
}

export default ClusterWrapper;
