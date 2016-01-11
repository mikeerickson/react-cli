import React, { Component, PropTypes } from 'react';

export default class ModuleCardItem extends React.Component {

    render() {
        let itemStyle = {
            display: 'block',
            width: '100%',
            height: '100%',
            boxShadow: '0 0 1.25em 0 rgba(0,0,0,.5)',
            backgroundSize: '100%',
            backgroundColor: this.props.item.bgcolor || '#fff',
            cursor: 'move'
        };
        const checkedStyle = {
            backgroundColor: 'rgba(5,4,3,.5)'
        };
        const nameStyle = {
            display: 'block',
            bottom: 5,
            left: -2,
            right: -2,
            fontSize: 14,
            fontWeight: 600,
            position: 'absolute',
            color: '#ddd',
            textAlign: 'center',
            backgroundColor: 'rgba(3,4,5,.5)',
            border: '1px solid #999',
            textTransform: 'capitalize'
        };
        if(this.props.checked){
            itemStyle = {
                ...itemStyle,
                ...checkedStyle
            }
        }
        return <div style={itemStyle} onClick={this.props.onItemClick}>
            <div style={nameStyle}>{this.props.item.name}</div>
        </div>;
    }
}