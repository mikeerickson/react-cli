'use strict';

import React from 'react'; 
import { LinkContainer } from 'react-router-bootstrap';

class UserCard extends React.Component {

    render() {
        const { item, column, index, onClick } = this.props;
        const { uid, id, name, phone, url } = item;
        let transformX = index % column * 200;
        let transformY = parseInt(index / column) * 300;
        const itemStyle = {
            width: '190px',
            height: '280px',
            transform: 'translate3d(' + transformX + 'px, ' + transformY + 'px, 0px)',
            transition: 'transform 300ms ease',
            backgroundImage: `url('${url}')`
        };
        return <LinkContainer to={"/user?key=" + JSON.stringify(item)}>
            <div style={itemStyle} className="grid-item" onClick={onClick}>
                <span className="name">{name}</span>
                <span className="uid">{uid}</span>
                <span className="phone">{phone}</span>
                <span className="id">{id}</span>
            </div>
        </LinkContainer>;
    }
}

class UserCardGrid extends React.Component {

    render() {
        const {datas, column, onClick} = this.props;
        const self = this;
        let col = column || 6;
        let grid = datas.map(function(e,i){
            return <UserCard key={i} item={e} index={i} column={col} onClick={() => onClick && onClick(e)}/>;
        });
        return <div className="grid">
            {grid}
        </div>;
    }
}

export default UserCardGrid;