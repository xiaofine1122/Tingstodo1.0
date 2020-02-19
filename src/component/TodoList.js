import React, { Component } from 'react';
import { List } from 'antd';
import ListHeader from './ListHeader';
import TodoItems from './TodoItems';
import { translate } from 'react-i18next';
import { observer, inject, Observer } from 'mobx-react';


@translate()
@inject("store")
@observer
export default class TodoList extends Component {
    render() {
        const change = this.props.store.change
        return (
            <List
                header={<ListHeader />}
                bordered
                dataSource={this.props.store.items}
                renderItem={item =>
                    <List.Item>
                        <TodoItems key={item.id} item={item} />
                    </List.Item>}
            />
        );
    }



}
