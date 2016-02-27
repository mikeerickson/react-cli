'use strict';

import React from 'react';
import ItemDrag from './ItemDrag';

export default class Item extends React.Component {
        
    constructor(props, context){
        super(props, context);
        this.itemDrag = new ItemDrag(this.swap.bind(this));
    }
    
    componentDidMount() {
        if (this.props.dragEnabled) {
            this.itemDom.addEventListener('mousedown', this.onDrag.bind(this));
            this.itemDom.addEventListener('touchstart', this.onDrag.bind(this));
        }
    }

    componentWillUnmount() {
        if (this.props.dragEnabled) {
            this.itemDrag.endDrag();
            this.itemDom.removeEventListener('mousedown', this.onDrag.bind(this));
            this.itemDom.removeEventListener('touchstart', this.onDrag.bind(this));
        }
    }
    
    onDrag(e){
        if(this.props.dragEnabled){
            const { layout, container } = this.props;
            this.itemDrag.startDrag(e, this.itemDom, layout, container, this.move.bind(this));
        }
    }
    
    move(x, y) {
        this.setState({
            dragX: x,
            dragY: y,
            end: false
        });
    }
    
    /**
     * 用于交换元素
     * @target 表示目标元素的索引号。当它为null时，表示结束拖放事件
     */
    swap(target){
        if(target === null){
            this.setState({ end: true });
        } else {
            const { index, onMove } = this.props;
            onMove(index, target);
        }
    }
    
    getMoveStyle(x, y){
        var moveStyle = {};
        // 组件移动到鼠标位置
        var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        moveStyle.WebkitTransform = transform;
        moveStyle.MozTransform = transform;
        moveStyle.msTransform = transform;
        moveStyle.transform = transform;
        moveStyle.zIndex = 100;
        // 去掉动画效果，不然拖动时会有卡帧的感觉
        moveStyle.WebkitTransition = 'none';
        moveStyle.MozTransition = 'none';
        moveStyle.msTransition = 'none';
        moveStyle.transition = 'none';
        moveStyle.pointerEvents = 'none';
        return moveStyle;
    }

    getStyle() {
        const { style, index } = this.props;
        if(this.state){
            const { dragX, dragY, end } = this.state;
            const moveStyle = this.getMoveStyle(dragX || 0, dragY || 0);
            if(!end){
                return {...style, ...moveStyle};
            }
        }
        return style;
    }

    render() {
        return (
            <div ref={node => this.itemDom = node} style={this.getStyle()}>{ this.props.children }</div>
        );
    }
}

Item.propTypes = {
    key: React.PropTypes.any,
    style: React.PropTypes.object,
    index: React.PropTypes.number,
    ddWidth: React.PropTypes.number,
    ddHeight: React.PropTypes.number,
    dragEnabled: React.PropTypes.bool
};