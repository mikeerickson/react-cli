'use strict';

import React from 'react';
import { debounce, sortBy } from 'underscore';
import Item from './Item';
import ItemDrag from './ItemDrag';
import LayoutManager from './LayoutManager';

export default class DragAndDrop extends React.Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            layoutWidth: 0,
            items: this.props.items
        };
    }
    
    componentDidMount() {
        // 挂载调整窗口事件
        if(this.props.resizable){
            window.addEventListener('resize', this.onResize.bind(this));
        }
        this.onResize();
    }

    componentWillUnmount() {
        // 卸载调整窗口事件
        window.removeEventListener('resize', this.onResize.bind(this));
    }

    onResize(){
        // 获取组件DOMRoot的宽度
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(this.getDOMWidth.bind(this));
        } else {
            setTimeout(this.getDOMWidth.bind(this), 66);
        }
    }
    
    onMove( source, target){
        const { items } = this.state;
        const sourceItem = items[source];
        // 移动数据
        if(source !== target){
            items.splice(source, 1);
            items.splice(target, 0, sourceItem);
            this.setState({items: items});
        }
    }
    
    // 获取组件宽度
    getDOMWidth(){
        const width = this.container && this.container.clientWidth - 20;
        if(this.state.layoutWidth !== width){
            this.setState({layoutWidth: width});
        }
    }

    render() {
        
        const { itemWidth, itemHeight, verticalMargin, zoom } = this.props;
        const { items, layoutWidth } = this.state;
        // 无元素时渲染
        if(!layoutWidth || !items.length){
            return <div ref={node => this.container = node}></div>;
        }
        
        const options = {
            itemWidth: itemWidth,
            itemHeight: itemHeight,
            verticalMargin: verticalMargin,
            zoom: zoom
        };
        
        // 获取布局
        const layout = new LayoutManager(options, layoutWidth);
        // 计算布局高度
        const layoutHeight = layout.getGridHeight(items.length) + 20;
        // 获取其他属性
        const { animation, filterProp, partItem, dragEnabled, keyProp } = this.props;
        // 获取拖放组件的位置属性
        const containerRect = this.container.getBoundingClientRect();
        // 渲染表格
        const onMove = this.onMove.bind(this);
        const gridItems = items.map((item, index) => {
            const key = item[keyProp];
            const style = layout.getStyle(index, animation, item[filterProp]);
            const partItemClone = React.cloneElement(partItem, {...partItem.props, item});
            return (
                <Item style={style} layout={layout} container={containerRect} index={index} key={key} dragEnabled={dragEnabled} onMove={onMove}>
                    {partItemClone}
                </Item>
            );
        });

        const gridStyle = {
            position: 'relative',
            display: 'block',
            height: layoutHeight,
            ...this.props.style
        };

        return (
            <div style={gridStyle} ref={node => this.container = node}>
                {gridItems}
            </div>
        );
    }
}

DragAndDrop.propTypes = {
    items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    partItem: React.PropTypes.element.isRequired,
    itemWidth: React.PropTypes.number,
    itemHeight: React.PropTypes.number,
    verticalMargin: React.PropTypes.number,
    zoom: React.PropTypes.number,
    resizable: React.PropTypes.bool,
    dragEnabled: React.PropTypes.bool,
    keyProp: React.PropTypes.string,
    sortProp: React.PropTypes.string,
    filterProp: React.PropTypes.string,
    target: React.PropTypes.string,
    animation: React.PropTypes.string,
    onMove: React.PropTypes.func
};

DragAndDrop.defaultProps = {
    items: [],
    keyProp: 'key',
    filterProp: 'filtered',
    sortProp: 'sort',
    target: 'self',
    itemWidth: 128,
    itemHeight: 128,
    verticalMargin: 10,
    resizable: false,
    dragEnabled: false,
    animation: 'transform 300ms ease',
    zoom: 1,
    onMove: function(){}
};
