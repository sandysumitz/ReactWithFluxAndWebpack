import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./sideBar/Sidebar";
import PageWrapper from "./PageWrapper";

class App extends Component {
  render() {
    return (
      <div id="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper />
        <Footer />
      </div>
    );
  }
}

export default App;
