'use strict';

import React from 'react'; 
import { LinkContainer } from 'react-router-bootstrap';
import hostconfig from '../tools/host';
import '../stylesheets/jingcard.css';

class UserCard extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        this.bgColors = ["#5bb75b", "#b3c833", "#ce5043", "#fb8521", "#1aa1e1", "#5e5ca6", "#658092"];
    }
    
    render() {
        const { size, item, column, index, onClick } = this.props;
        const { uid, idno, realname, mob, email, id, loantype } = item;
        let transformX, transformY = parseInt(index / column) * 300;
        if(column % 2 === 1){
            transformX = index % column * 260;
        }else{
            transformX = index % column * 260;
        }
        const itemStyle = {
            width: '250px',
            height: '280px',
            transform: 'translate3d(' + transformX + 'px, ' + transformY + 'px, 0px)',
            transition: 'transform 300ms ease'
        };
        return <LinkContainer to={hostconfig.local_host + "/bank?uid=" + uid + "&id=" + idno + "&name=" + realname}>
            <div style={itemStyle} className="card-item" onClick={onClick}>
                <div className="name" style={{backgroundColor: this.bgColors[0]}}>{realname}</div>
                <div><label>账号：</label>{uid === "\\N" ? "" : uid}</div>
                <div><label>单号：</label>{id === "\\N" ? "" : id}</div>
                <div><label>贷种：</label>{loantype === "\\N" ? "" : loantype}</div>
                <div><label>手机：</label>{mob === "\\N" ? "" : mob}</div>
                <div><label>邮箱：</label>{email === "\\N" ? "" : email}</div>
                <div><label>证件：</label>{idno === "\\N" ? "" : idno}</div>
            </div>
        </LinkContainer>;
    }
}

class UserCardGrid extends React.Component {

    render() {
        const {datas, column, onClick} = this.props;
        const self = this;
        const size = datas.length;
        const col = column || 6;
        const card = datas.map((item, i) => <UserCard key={i} size={size} item={item} index={i} column={size < col ? size : col} onClick={() => onClick && onClick(item)}/>);
        return <div className="card">{card}</div>;
    }
}

export default UserCardGrid;