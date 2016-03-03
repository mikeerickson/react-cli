'use strict';

import React from 'react';

export default class PartItem extends React.Component {

    componentDidMount() {
        if (this.props.dragEnabled) {
            this.itemDom.addEventListener('mousedown', this.onDrag.bind(this));
            this.itemDom.addEventListener('touchstart', this.onDrag.bind(this));
            this.itemDom.setAttribute('data-key', this.props.id);
        }
    }

    componentWillUnmount() {
        if (this.props.dragEnabled) {
            this.props.dragManager.endDrag();
            this.itemDom.removeEventListener('mousedown', this.onDrag.bind(this));
            this.itemDom.removeEventListener('touchstart', this.onDrag.bind(this));
        }
    }
    
    onDrag(e){
        if(this.props.dragManager){
            this.props.dragManager.startDrag(e, this.itemDom, this.props.item, this.updateDrag.bind(this));
        }
    }
    
    updateDrag(x, y) {
        var pauseAnimation = false;
        if(!this.props.dragManager.dragItem){
            pauseAnimation = true;
            setTimeout(() => {
                this.setState({pauseAnimation: false});
            }, 0);
        }
        this.setState({
            dragX: x,
            dragY: y,
            pauseAnimation: pauseAnimation
        });
    }

    getStyle() {
        if (this.props.dragManager.dragItem === this.props.item) {
            var dragStyle = this.props.dragManager.getStyle(this.state.dragX, this.state.dragY);
            return {...this.props.style, ...dragStyle};
        } else if (this.state && this.state.pauseAnimation) {
            var pauseAnimationStyle = {...this.props.style};
            pauseAnimationStyle.WebkitTransition = 'none';
            pauseAnimationStyle.MozTransition = 'none';
            pauseAnimationStyle.msTransition = 'none';
            pauseAnimationStyle.transition = 'none';
            return pauseAnimationStyle;
        }

        return this.props.style;
    }

    render() {
        return (
            <div ref={node => this.itemDom = node} style={this.getStyle()}>{ this.props.children }</div>
        );
    }
}

PartItem.propTypes = {
    id: React.PropTypes.any,
    item: React.PropTypes.object,
    style: React.PropTypes.object,
    index: React.PropTypes.number,
    dragEnabled: React.PropTypes.bool,
    dragManager: React.PropTypes.object
};
