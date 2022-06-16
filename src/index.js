import React, { Component } from "react";
import { render } from "react-dom";
import moment from "moment";
import "moment/locale/ru";
import CustomTimeline from "./CustomTimeline";
import ModalAddPoint from "./ModalAddPoint";
import HeaderApp from "./HeaderApp";
import "react-calendar-timeline/lib/Timeline.css";
import "./style.css";

class App extends Component {
  constructor(props) {
    super(props);
    const groups = [
      { id: 1, title: "" },
    ];
  
    const items = [];

    const user = "";
    const id_user = 0;
    const is_admin = false;

    const defaultTimeStart = moment().startOf("day").toDate();
    const defaultTimeEnd = moment().startOf("day").add(1, "day").toDate();

    this.state = {
      groups,
      items,
      user,
      defaultTimeStart,
      defaultTimeEnd,
      showModal: false,
      selected: moment().startOf("date").toDate(),
      editing: false,
      currentItemId: "",
    };

    this.setNewLock = this.setNewLock.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSelectDay = this.handleSelectDay.bind(this);
    this.handleSetNewData = this.handleSetNewData.bind(this);
    this.handleIsEditing = this.handleIsEditing.bind(this);
    this.handleEditData = this.handleEditData.bind(this);
    this.handleGetDate = this.handleGetDate.bind(this);
  }
/**
 * Первый запрос данных при загрузке приложени
 * Данные: данные о пользователе, все пользователи, вся бронь
 * 
 */
  componentDidMount() {
    fetch("http://samaradrift.ru/api", {
      method: 'POST',
      body: JSON.stringify({
        action: 'getUser',
      })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.data.priv == "1") {
        this.setState({is_admin: data.data.priv});  
      }
      this.setState({user: data.data.name});
      this.setState({id_user: +data.data.id});
    } )
    .catch(err => console.log(err));

    fetch("http://samaradrift.ru/api", {
      method: 'POST',
      body: JSON.stringify({
        action: 'getUsers',
      })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({groups: data.data})
    })

    fetch("http://samaradrift.ru/api", {
      method: 'POST',
      body: JSON.stringify({
        action: 'getReserv',
      })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      let item = [];
      data.data.forEach(el => {
        item.push({
          id: +el.id,
          group: +el.user,
          title: el.user_name,
          start: +el.date_begin,
          end: +el.date_end,
        })
      });
      this.setState({items: item});
    } )
    .catch(err => console.log(err));
  }

  /**
   * Получение данных, их валидация и установка а модальном окне
   * @param {number} id 
   */
  handleGetDate(id) {
    if(id) {
      fetch("http://samaradrift.ru/api", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'getReserv',
          ids: id,
        })
      }).then(response => {
        return response.json();
      }).then(res => {
        if(this.state.id_user == +res.data[0].user) {
          this.handleOpenModal();
          const timeFrom = moment(+res.data[0].date_begin).format("LT");
          const timeTo = moment(+res.data[0].date_end).format("LT");
          let timeFromArray = timeFrom.split(":");
          let timeToArray = timeTo.split(":");
          let zero = "0";
          if(timeFromArray[0].length < 2 && timeToArray[0].length == 2) {
            timeFromArray[0] = zero + timeFromArray[0];
            let currentTimeFrom = timeFromArray.join(":");
            document.querySelector("#timeFrom").value = currentTimeFrom;
            document.querySelector("#timeTo").value = timeTo;
          } else if(timeFromArray[0].length < 2 && timeToArray[0].length < 2) {
            timeFromArray[0] = zero + timeFromArray[0];
            timeToArray[0] = zero + timeToArray[0];
            let currentTimeFrom = timeFromArray.join(":");
            let currentTimeTo = timeToArray.join(":");
            document.querySelector("#timeFrom").value = currentTimeFrom;
            document.querySelector("#timeTo").value = currentTimeTo;
          } else if(timeFromArray[0].length == 2 && timeToArray[0].length < 2) {
            timeToArray[0] = zero + timeToArray[0];
            let currentTimeTo = timeToArray.join(":");
            document.querySelector("#timeFrom").value = timeFrom;
            document.querySelector("#timeTo").value = currentTimeTo;
          }
          else {
            document.querySelector("#timeFrom").value = timeFrom;
            document.querySelector("#timeTo").value = timeTo;
          }
          this.setState({selected: moment(+res.data[0].date_begin).startOf("date").toDate()});
        }
      }).catch(err => console.log(err));
    } else {
      alert("Что-то пошло не так...");
    }
  }

  /**
   * Установка в стейт флага редактирования и установка id текущей записи
   * @param {number} id 
   */
  handleIsEditing(id) {
    this.setState({editing: true});
    this.setState({currentItemId: id});
  }

  /**
   * Открытие модалки
   */
  handleOpenModal() {
    this.setState({ showModal: true });
  }

  /**
   * Закрытие модалки
   */
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  /**
   * Установка дня (даты)
   * @param {string} date 
   */
  handleSelectDay(date) {
    this.setState({selected: date});
  }

  /**
   * Установка новой записи
   */
  handleSetNewData() {
    let timeTo = document.querySelector("#timeTo").value.split(":");
    let isMidnight = false;
    if(timeTo[0] == "00" && timeTo[1] == "00") {
      isMidnight = true;
      timeTo = ["23", "59"];
    }
    let data = {
      id: "",
      group: this.state.id_user,
      title: this.state.user,
      start: moment(this.state.selected).add(document.querySelector("#timeFrom").value.split(":")[0], "hours").add(document.querySelector("#timeFrom").value.split(":")[1], "minutes").valueOf(),
      end: isMidnight ? moment(this.state.selected).add(timeTo[0], "hours").add(timeTo[1], "minutes").valueOf() : 
                        moment(this.state.selected).add(document.querySelector("#timeTo").value.split(":")[0], "hours").add(document.querySelector("#timeTo").value.split(":")[1], "minutes").valueOf(),
    }
    if(data.end > data.start) {
      fetch("http://samaradrift.ru/api", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'action': 'setReserv',
        },
        body: JSON.stringify({
          action: 'setReserv',
          data: data,
        })
      }).then(response => {
        return response.json();
      }).then(res => {
        data.id = res.newid;
      });
      this.handleCloseModal();
      this.setNewLock(data);
    } else {
      alert("Введите корректное время!");
    }
  }

  /**
   * Редактирование записи
   */
  handleEditData() {
    let timeTo = document.querySelector("#timeTo").value.split(":");
    let isMidnight = false;
    if(timeTo[0] == "00" && timeTo[1] == "00") {
      isMidnight = true;
      timeTo = ["23", "59"];
    }
    let data = {
      id: this.state.currentItemId,
      group: this.state.id_user,
      title: this.state.user,
      start: moment(this.state.selected).add(document.querySelector("#timeFrom").value.split(":")[0], "hours").add(document.querySelector("#timeFrom").value.split(":")[1], "minutes").valueOf(),
      end: isMidnight ? moment(this.state.selected).add(timeTo.join("."), "hours").valueOf() : 
                        moment(this.state.selected).add(document.querySelector("#timeTo").value.split(":")[0], "hours").add(document.querySelector("#timeTo").value.split(":")[1], "minutes").valueOf(),
    };
    if(data.end - data.start > 0) {
      fetch("http://samaradrift.ru/api", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'action': 'setReserv',
        },
        body: JSON.stringify({
          action: 'setReserv',
          data: data,
        })
      }).then(response => {
        return response.json();
      }).then(res => {
        console.log(res);
      });
      this.handleCloseModal();
      this.setNewLock(data);
      this.setState({editing: false});
    } else {
      alert("Введите корректный диапазон времени!");
    }
  }

  /**
   * Внесение данных в state
   * @param {object} data 
   */
  setNewLock(data) {
    const items = this.state.items.slice();
    items.push(data);
    this.setState({items: items});
  }

  render() {
    return (
      <div>
        <HeaderApp 
          user={this.state.user} 
          admin={this.state.is_admin}
        />
        <CustomTimeline 
          showModal={this.state.showModal}
          handleCloseModal={this.handleCloseModal}
          handleOpenModal={this.handleOpenModal}
          groups={this.state.groups}
          items={this.state.items}
          defaultTimeStart={this.state.defaultTimeStart}
          defaultTimeEnd={this.state.defaultTimeEnd}
          handleIsEditing={this.handleIsEditing}
          handleGetDate={this.handleGetDate}
        />
        <ModalAddPoint 
          selected={this.state.selected}
          showModal={this.state.showModal}
          handleCloseModal={this.handleCloseModal}
          handleOpenModal={this.handleOpenModal}
          handleSelectDay={this.handleSelectDay}
          handleSetNewData={this.handleSetNewData}
          handleEditData={this.handleEditData}
          is_edit={this.state.editing}
         />
      </div>
    )
  }
}

render(<App />, document.getElementById("root"));