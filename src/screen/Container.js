import React, { Component } from 'react';
import '../App.css';
import TodoList from '../component/TodoList';
import { translate } from 'react-i18next';
import { observer, inject } from 'mobx-react';

@translate()
@inject("store")
@observer
export default class Container extends Component {

    render() {
        return (
            <div className="container">
                <div className="menu"></div>
                <div className="todolist">
                    <TodoList />
                </div>
            </div>
        );

    }

}

