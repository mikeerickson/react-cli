'use strict';

import React from 'react';
import { debounce, sortBy } from 'underscore';
import PartItem from './PartItem';
import LayoutManager from './LayoutManager';
import SingleDragRealizer from './SingleDragRealizer';

export default class DragAndDropGrid extends React.Component {

    constructor(props, context){
        super(props, context);
        this.onResize = debounce(this.onResize.bind(this), 150);
        this.dragManager = new SingleDragRealizer(this.props.onMove, this.props.keyProp);
        this.state = {
            layoutWidth: 0,
            dragItemId: 0
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

    getDOMWidth(){
        // 获取组件宽度
        const width = this.container && this.container.clientWidth - 20;
        if(this.state.layoutWidth !== width){
            this.setState({layoutWidth: width});
        }
    }

    render() {
        // 无元素时渲染
        if(!this.state.layoutWidth || !this.props.items.length){
            return <div ref={node => this.container = node}></div>;
        }
        
        const options = {
            itemWidth: this.props.itemWidth,
            itemHeight: this.props.itemHeight,
            verticalMargin: this.props.verticalMargin,
            zoom: this.props.zoom
        };
        
        // 获取布局
        const layout = new LayoutManager(options, this.state.layoutWidth);

        let filteredIndex = 0;
        let sortedIndex = {};

        sortBy(this.props.items, this.props.sortProp).forEach(item => {
            if(!item[this.props.filterProp]){
                const key = item[this.props.keyProp];
                sortedIndex[key] = filteredIndex;
                filteredIndex++;
            }
        });

        const itemsLength = this.props.items.length;
        const gridItems = this.props.items.map(item => {
            const key = item[this.props.keyProp];
            const index = sortedIndex[key];
            const style = layout.getStyle(index, this.props.animation, item[this.props.filterProp]);
            const onItemClick = function(){};
            const partItem = React.cloneElement(this.props.partItem, {...this.props.partItem.props, item, index, itemsLength, onItemClick});
            return (
                <PartItem style={style} item={item} index={index} id={key} key={key}
                  dragEnabled={this.props.dragEnabled} dragManager={this.dragManager}>
                    {partItem}
                </PartItem>
            );
        });

        const gridStyle = {
            position: 'relative',
            display: 'block',
            height: layout.getGridHeight(filteredIndex) + 20,
            ...this.props.style
        };

        return (
            <div style={gridStyle} className="DragAndDropGrid" ref={node => this.container = node}>
                {gridItems}
            </div>
        );
    }
}

DragAndDropGrid.propTypes = {
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

DragAndDropGrid.defaultProps = {
    items: [],
    keyProp: 'key',
    filterProp: 'filtered',
    sortProp: 'sort',
    target: 'self',
    itemWidth: 128,
    itemHeight: 128,
    verticalMargin: -1,
    resizable: false,
    dragEnabled: false,
    animation: 'transform 300ms ease',
    zoom: 1,
    onMove: function(){}
};
