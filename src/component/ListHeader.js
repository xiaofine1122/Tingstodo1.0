import React from 'react';

import { Input, Icon } from 'antd';
import ReactTooltip from 'react-tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import { observer, inject } from 'mobx-react';

@translate()
@inject("store")
@observer
export default class ListHeader extends React.Component {

    handleChange(e) {
        this.props.store.handleChange(e);
    }

    handleKeyUp(e) {
        this.props.store.handleKeyUp(e);
    }

    clickdel() {
        this.props.store.delselect();
    }

    changebackground() {
        this.props.store.changebackground();
    }

    changeLock() {
        this.props.store.changeLock();
    }
    render() {
        return (
            <div className="listheader">
                {this.props.store.title}
                <ReactTooltip />
                <Icon type="delete" style={{ fontSize: '22px', color: '#08c' }} data-tip="删除勾选的TODO" data-place="bottom" onClick={this.clickdel.bind(this)} />
                <CopyToClipboard
                    text={JSON.stringify(this.props.store.items)}
                    onCopy={() => window.alert("TODO列表已经复制到剪贴板")}
                // onCopy={() => dialog.showMessageBox({type: "info",message : "TODO列表已经复制到剪贴板"})}
                ><Icon type="copy" style={{ fontSize: '22px', color: '#08c' }} data-tip="复制TODO JSON格式的数据" data-place="bottom" /></CopyToClipboard>
                <Icon type="bulb" style={{ fontSize: '22px', color: '#08c' }} data-tip="调节背景透明度" data-place="bottom" onClick={this.changebackground.bind(this)} />
                <span className='lock' onClick={this.changeLock.bind(this)}>
                    {
                        this.props.store.locked
                            ? <Icon type="unlock" style={{ fontSize: '22px', color: '#08c' }} data-tip="解锁界面" data-place="bottom" />
                            : <Icon type="lock" style={{ fontSize: '22px', color: '#08c' }} data-tip="锁定界面" data-place="bottom" />
                    }
                </span>
                <Input className="add" placeholder="add new todo"
                    value={this.props.store.inputext}
                    onKeyUp={this.handleKeyUp.bind(this)}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );
    }

}