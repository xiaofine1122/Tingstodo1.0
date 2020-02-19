import React, { Component } from 'react';
import { Icon } from 'antd';
import { Checkbox } from 'antd';
import ClickToEdit from "react-click-to-edit"
import { translate } from 'react-i18next';
import { observer, inject } from 'mobx-react';

@translate()
@inject("store")
@observer
export default class TodoItems extends Component {

    handleChange(e) {
        this.props.store.changeStatus(this.props.item.id, e.target.checked);
    }
    checkplay() {
        this.props.store.changePlay(this.props.item.id, this.props.item.playing);
    }

    render() {

        return (
            <div className={(this.props.item.completed) ? "todoitems linethrough" : "todoitems"} key={this.props.item.id}>
                <div className="checkbox">
                    <Checkbox checked={this.props.item.completed} onChange={this.handleChange.bind(this)}></Checkbox></div>
                <ClickToEdit wrapperClass="edittext" value={this.props.item.text}
                    endEditing={(value) => this.props.store.changeText(this.props.item.id, value)} />
                <div className="play" onClick={this.checkplay.bind(this)} >
                    {
                        !this.props.item.playing ? <Icon type="caret-right" style={{ fontSize: '18px', color: '#08c' }} /> : <Icon type="pause" style={{ fontSize: '18px', color: '#08c' }} />
                    }
                </div>
            </div>
        );
    }

}