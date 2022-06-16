import React from "react";
import logo from "./img/logo.png"


export default class HeaderApp extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="header__wrapper">
        <img src={logo} alt=""></img>
        <div className="login__wrapper">
          {this.props.admin ? <a className="admin-enter" href="http://samaradrift.ru/cabinet">Админка</a> : <a href="http://samaradrift.ru/cabinet"></a>}
          <p className="login-name">{this.props.user}</p>
          </div>
      </div>
    );
  }
};