'use strict';

import React from 'react'; 
import '../stylesheets/jingmenu.css';

export default class SlidingMenu extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        this.state = {
            colors: ["#b3c833", "#ce5043", "#fb8521", "#1aa1e1", "#5e5ca6", "#658092"],
            clientWidth: 0,
            clientHeight: 0
        }
    }
    
    componentDidMount() {
        window.addEventListener('resize', this.onResize.bind(this));
        setTimeout(() => {
            const { clientWidth , clientHeight  } = document.documentElement;
            this.setState({clientWidth : clientWidth, clientHeight: clientHeight });
        },0);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize.bind(this));
    }
    
    onResize(){
        const { clientWidth , clientHeight  } = document.documentElement;
        setTimeout( () => this.setState({clientWidth : clientWidth, clientHeight: clientHeight }), 66);
    }

    render() {
        const { items, tab, onSelect, width } = this.props;
        const { colors, clientWidth, clientHeight } = this.state;
        const menuHeight = clientHeight - 50;
        const lis = items.map((item, index) => {
            const liStyle = { background: colors[index % 6], height: 50 };
            return <li className="jing-menu-li" style={liStyle} key={index} onClick={() => onSelect(item.value)}>
                    <span class="jing-menu-li-icon"></span>
                    <a href="#">{item.label}</a>
                </li>
        })
        return <div className="jing-tab" style={{height: menuHeight}}>
            <div className="jing-menu-nav" style={{height: menuHeight}}  ref={node => this.panel = node}>
                <ul className="jing-menu-ul">
                {lis}
                </ul>
            </div>
            <div className="jing-content" style={{width: clientWidth - 210, paddingTop: 10}}>
                {tab.content}
            </div>
        </div>
    }
}