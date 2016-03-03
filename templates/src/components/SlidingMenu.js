'use strict';

import React from 'react'; 
import hostconfig from '../tools/host';
import '../stylesheets/jingmenu.css';

export default class SlidingMenu extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        const { width, collapse } = this.props;
        this.errorStyle = {
            backgroundColor: "#fcf8e3",
            borderColor: "#faebcc",
            color: "red",
            padding: "15",
            marginBottom: "20",
            border: "1px solid transparent",
            borderRadius: 4
        }
        this.state = {
            colors: ["#b3c833", "#ce5043", "#fb8521", "#1aa1e1", "#5e5ca6", "#658092"],
            minWidth: 50,
            maxWidth: width || 200,
            menuWidth: width || collapse === "left" ? width || 200 : 50,
            collapseStatus: collapse || "left",
            astatus: collapse === "left" ? "block" : "none",
            select: -1
        }
    }
    
    collapse(){
        const { collapseStatus, minWidth, maxWidth } = this.state;
        const { onOpen } = this.props;
        if(collapseStatus === "left"){
            this.setState({collapseStatus: "right", menuWidth: minWidth, astatus: "none"});
        }else{
            this.setState({collapseStatus: "left", menuWidth: maxWidth, astatus: "block"});
        }
        onOpen();
    }

    render() {
        const { items, tab, onSelect, width, error } = this.props;
        const { colors, menuWidth, minWidth, collapseStatus, astatus, select } = this.state;
        const errorMsg = error && <div style={this.errorStyle}><h4>{error}</h4></div>;
        const menuStyle = { width: menuWidth };
        const contentStyle = { marginLeft: menuWidth + 20 };
        const lis = items.map((item, index) => {
            const liStyle = select === index ? { background: colors[index % 6] } : (item.value === tab.key ? { background: "-webkit-linear-gradient(left,#888 5%,#eee 95%)", width: menuWidth } : {});
            const spanStyle = {
                content: `url('..${hostconfig.local_host}/images/${item.value}.png')`, 
                backgroundImage: `url('..${hostconfig.local_host}/images/${item.value}.png')`, 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "38px 38px", 
                backgroundPosition: "4px 4px" 
            };
            return <li className="jing-menu-li" style={liStyle} key={index} onClick={() => onSelect(item.value)} onMouseOver={() => this.setState({select: index})} onMouseOut={() => this.setState({select: -1})}>
                    <span className="jing-menu-li-icon" style={spanStyle}></span>
                    <a href="#" style={{display: select === index ? "block" : astatus}}>{item.label}</a>
                </li>
        });
        
        const collapseStyle = {position: "absolute", fontSize: 36,color: "white",right: 7, top: 7, textDecoration: "none", cursor: "pointer"};
        return <div className="jing-tab">
            <div className="jing-menu-nav" style={menuStyle} ref={node => this.panel = node}>
                <div className="jing-memu-tool" style={menuStyle}>
                    <a className={"glyphicon glyphicon-menu-" + collapseStatus} style={collapseStyle} aria-hidden="true" onClick={this.collapse.bind(this)}></a>
                </div>
                <ul className="jing-menu-ul" style={menuStyle}>
                    {lis}
                </ul>
            </div>
            <div className="jing-content" style={contentStyle}>
                {errorMsg}
                {tab.content}
            </div>
        </div>
    }
}