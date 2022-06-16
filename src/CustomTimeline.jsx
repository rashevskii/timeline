import React, { Component } from "react";


import Timeline, {
  TimelineHeaders,
  DateHeader,
} from "react-calendar-timeline/lib";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  /**
   * Обработка двойного клика (редактирование записи)
   * @param {number} itemId 
   * @param {object} e 
   * @param {number(?)} time 
   */
  handleDoubleClick(itemId, e, time) {
    const id_arr = [];
    id_arr.push(itemId);
    this.props.handleGetDate(id_arr);
    // this.props.handleOpenModal();
    this.props.handleIsEditing(itemId);
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.props;

    return (
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        sidebarContent={<div>Above The Left</div>}
        itemsSorted
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        showCursorLine
        canMove={false}
        canResize={false}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        onItemDoubleClick={this.handleDoubleClick}
      >
        <TimelineHeaders className="sticky">
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
      </Timeline>
    );
  }
}
