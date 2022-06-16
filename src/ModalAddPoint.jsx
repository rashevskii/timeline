import React from "react";
import ReactModal from "react-modal";
import SimpleReactCalendar from 'simple-react-calendar';

ReactModal.setAppElement("#root");

export default class ExampleApp extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <button className="button-add app-btn" onClick={this.props.handleOpenModal}>
          ЗАБРОНИРОВАТЬ
        </button>
        <ReactModal
          isOpen={this.props.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.props.handleCloseModal}
          className="Modal"
          overlayClassName="Overlay"
        >
          <button onClick={this.props.handleCloseModal} className="btn-close-modal">+</button>
          <form>
            <SimpleReactCalendar 
              activeMonth={new Date()}
              onSelect={this.props.handleSelectDay}
              selected={this.props.selected}
            />
            <div className="timeFrom__wrapper input__wrapper">
              <label for="timeFrom">Начало</label>
              <input type="time" name="timeFrom" id="timeFrom"></input>
            </div>
            <div className="timeTo__wrapper input__wrapper">
              <label for="timeTo">Конец</label>
              <input type="time" name="timeTo" id="timeTo"></input>
            </div>
          </form>
          <div className="button__wrapper">
            {this.props.is_edit ? 
            <button onClick={this.props.handleEditData} type="submit" className="app-btn">ПОДТВЕРЖДАЮ</button> :
            <button onClick={this.props.handleSetNewData} type="submit" className="app-btn">ПОДТВЕРЖДАЮ</button>
            }
            <button onClick={this.props.handleCloseModal} type="submit" className="close-modal-mobile app-btn">ЗАКРЫТЬ</button>
          </div>
          <div className="confirm">Нажимая кнопку Подтвердить, вы соглашаетесь с договором оферты и попадаете в рабство</div>
        </ReactModal>
      </div>
    );
  }
}