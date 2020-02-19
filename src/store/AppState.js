import { observable, action, computed, trace } from "mobx";
// import axios from 'axios';
import * as KeyCode from 'keycode-js';
import moment from 'moment';
import update from 'immutability-helper';
// import ExportJsonExcel from 'js-export-excel';
const { remote } = window.require('electron');

class AppState {
    @observable appname = "Things to do";
    @observable items = [];
    @observable title = 'Things to do';
    @observable showtime = false;
    @observable inputext = '';
    @observable background = 100;
    @observable locked = false;
    //修改items里内容是 上级 TodoList 不会重新渲染导致想要的调整顺序的效果没有，所以增加一个属性便于mox追踪
    @observable change = false;

    constructor() {
        const saved_data = localStorage.getItem("todo-data");
        console.log(saved_data);
        this.items = JSON.parse(saved_data);
        if (!this.items) this.items = [];

        const savesetd_data = localStorage.getItem("todoset-data");
        console.log(savesetd_data);
        const sets = JSON.parse(savesetd_data);
        if (sets) {
            // this.showtime = sets.showtime;
            this.background = sets.background;
            document.querySelector("body").style.backgroundColor = "rgb(255,255,255," + (this.background / 100) + ")";
        }
        remote.getCurrentWindow().on('close', (e) => {
            const sets = {
                // showtime: this.showtime,
                background: this.background
            }
            const saved_data = JSON.stringify(sets);
            localStorage.setItem("todoset-data", saved_data);
        }
        )

    }

    @action
    addNew(text) {
        let nextId = this.items.length > 0 ? (Math.max.apply(Math, this.items.map(item => { return item.id })) + 1) : 1;
        const playstatus = new Array();
        let item = {
            id: nextId,
            text: text,
            playstatus: playstatus,
            completed: false
        };
        let updatedList = [].concat(this.items);
        updatedList.unshift(item);
        this.items = updatedList;
        this.saveData(this.items);

    }
    @action
    delselect() {
        let new_array = [];
        new_array = this.items.filter(item => item.completed === false);
        this.items = new_array;
        this.saveData(this.items);
    }
    @action
    changeStatus(itemId, completed) {
        let updatedList = this.updateStatus(itemId, completed);
        if (updatedList) {
            this.items = updatedList;
            this.saveData(this.items);
        }
        this.change = !this.change;
    }
    @action
    changeText(itemId, text) {
        let updatedList = this.updateText(itemId, text);
        if (updatedList) {
            this.items = updatedList;
            this.saveData(this.items);
        }
    }
    @action
    changePlay(itemId, playing) {
        let updatedList = this.updatePlayStatus(itemId, playing);
        this.items = updatedList;
        this.saveData(this.items);
        this.change = !this.change;
    }

    handleChange(e) {
        this.inputext = e.target.value;
    }
    @action
    handleKeyUp(e) {
        const text = this.inputext.trim();
        if (e.keyCode === KeyCode.KEY_RETURN && text) {
            this.addNew(text);
            this.inputext = '';
        }
    }

    changebackground() {
        this.background = this.background + 10;
        if (this.background > 100) this.background = 0;
        document.querySelector("body").style.backgroundColor = "rgb(255,255,255," + (this.background / 100) + ")";
    }

    @action
    changeLock() {
        let win = remote.getCurrentWindow();
        let lockSpan = document.querySelector(".lock");
        if (this.locked) {
            win.setIgnoreMouseEvents(false);
            lockSpan.addEventListener('mouseleave', () => {
                win.setIgnoreMouseEvents(false)
            });
        } else {
            lockSpan.addEventListener('mouseenter', () => {
                win.setIgnoreMouseEvents(false);
            });
            lockSpan.addEventListener('mouseleave', () => {
                win.setIgnoreMouseEvents(true, { forward: true })
            });
        }
        this.locked = !this.locked;
    }


    updateStatus(itemId, completed) {
        let index = this.items.findIndex(item => item.id === itemId);
        const changeitem = this.items[index];
        this.items.splice(index, 1);
        changeitem.completed = completed;
        if (completed) {
            this.items.push(changeitem);
        } else {
            this.items.unshift(changeitem);
        }
        return this.items;
    }


    updatePlayStatus(itemId, playing) {
        let index = this.items.findIndex(item => item.id === itemId);
        this.items[index].playing = !playing;
        if (!playing) {
            let begintime = moment().format('YYYY-MM-DD,h:mm:ss');
            let playstate = {
                beginTime: begintime
            };
            const changeitem = this.items[index];
            changeitem.playstatus.push(playstate);
            this.items.splice(index, 1);
            this.items.unshift(changeitem);

        } else {
            let maxplaystate = this.items[index].playstatus.pop();
            let begintime = maxplaystate.beginTime;
            let endtime = moment().format('YYYY-MM-DD,h:mm:ss');
            let minutes = moment(endtime, 'YYYY-MM-DD,h:mm:ss').diff(moment(begintime, 'YYYY-MM-DD,h:mm:ss'), 'minutes')
            maxplaystate.endtime = endtime;
            maxplaystate.minutes = minutes;
            this.items[index].playstatus.push(maxplaystate);
        }
        return this.items;
    }

    updateText(itemId, text) {
        let index = this.items.findIndex(item => item.id === itemId);

        // Returns a new list of data with updated item.
        return update(this.items, {
            [index]: {
                text: { $set: text }
            }
        });
    }

    saveData(items) {
        const saved_data = JSON.stringify(items);
        localStorage.setItem("todo-data", saved_data);

    }


    // changeTimeShow() {
    //     this.showtime = !this.showtime;
    // }

    // exportToExcel() {
    //     var option = {};
    //     option.fileName = 'todothings'
    //     option.datas = [
    //         {
    //             sheetData: JSON.parse(JSON.stringify(this.items))
    //         }];

    //     var toExcel = new ExportJsonExcel(option); //new
    //     toExcel.saveExcel(); //保存
    // }


}

export default new AppState();