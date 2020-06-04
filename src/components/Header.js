import React, { Component } from "react";

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleToggelMenu = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };
  render() {
    return (
      <header className="topbar is_stuck">
        <nav className="navbar top-navbar navbar-toggleable-sm navbar-light">
          <div className="navbar-header">
            <a className="navbar-brand">
              <b>
                <img
                  height="25px"
                  width="25px"
                  src="./styles/images/kubernetes_1.png"
                  alt="homepage"
                  className="light-logo"
                />
              </b>
            </a>
          </div>
          <div className="navbar-collapse">
            <ul className="navbar-nav mr-auto mt-md-0">
              <li className="nav-item">
                <a
                  onClick={this.handleToggelMenu}
                  title="Toggel Menu"
                  className="nav-link nav-toggler text-muted waves-effect waves-dark"
                >
                  <i className="mdi mdi-menu"></i>
                </a>
              </li>
            </ul>
            <ul className="navbar-nav my-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-muted waves-effect waves-dark"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src="./styles/images/users/profile.png"
                    alt="user"
                    className="profile-pic m-r-10"
                  />
                  Santhosh
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
