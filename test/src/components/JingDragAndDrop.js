'use strict';

import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import DragAndDropGrid from './dndgrid/DragAndDropGrid';
import DragAndDropGrids from './dndgrid/DragAndDrop';
import ModuleCardItem from './ModuleCardItem';
import _ from 'underscore';

class DragAndDrop extends Component{
    
    constructor(props, context){
        super(props, context);
        this.onSourceMove =  _.debounce(this.onSourceMove.bind(this), 80);
        this.state = {
            sourceItems: [
                { 'name': '银行', bgcolor: '#dff0d8', 'sort': 1, 'key': 1},
                { 'name': '电商', bgcolor: '#dff0d8', 'sort': 2, 'key': 2},
                { 'name': '运营商', bgcolor: '#dff0d8', 'sort': 3, 'key': 3},
                { 'name': '公积金', bgcolor: '#dff0d8', 'sort': 4, 'key': 4},
                { 'name': '鹏元', bgcolor: '#dff0d8', 'sort': 5, 'key': 5},
                { 'name': '资信', bgcolor: '#dff0d8', 'sort': 6, 'key': 6}
            ],
            targetItems: [{ 'name': '征信报告', bgcolor: '#dff0d8', 'key': 7},
                { 'name': '信用报告', bgcolor: '#dff0d8', 'key': 8},
                { 'name': '反欺诈报告', bgcolor: '#dff0d8', 'key': 9}]
        };
    }

    onSourceMove(source, target){
        const { sourceItems } = this.state;
        source = _.find(sourceItems, {key: parseInt(source, 10)});
        target = _.find(sourceItems, {key: parseInt(target, 10)});

        var targetSort = target.sort;

        sourceItems.forEach(function(item){
            if(target.sort > source.sort && (item.sort <= target.sort && item.sort > source.sort)){
              item.sort --;
            }else if(item.sort >= target.sort && item.sort < source.sort){
              item.sort ++;
            }
        });

        source.sort = targetSort;
        this.setState({sourceItems: sourceItems});
    }
    
    render(){
        const { sourceItems, targetItems } = this.state;
        let { leftStyle, rightStyle } = this.props;
        leftStyle = leftStyle || {border: '1px solid #ccc',backgroundColor: '#eee', borderRadius: 4, padding: 10};
        rightStyle = rightStyle || {border: '1px solid #ccc',backgroundColor: '#eee', borderRadius: 4, padding: 10};
        const { onSourceMove, onTargetMove } = this;
        return (
            <Row>
                <Col xs={6} style={{paddingLeft: 0}}>
                    <DragAndDropGrid items={sourceItems} partItem={<ModuleCardItem/>}
                        onMove={onSourceMove} dragEnabled={true} resizable={true}
                        itemWidth={100} itemHeight={166} style={leftStyle}/>
                </Col>
                <Col xs={6} style={{paddingLeft: 0}}>
                    <DragAndDropGrids items={targetItems} partItem={<ModuleCardItem/>}
                        dragEnabled={true} resizable={true}
                        itemWidth={100} itemHeight={166} style={rightStyle}/>
                </Col>
            </Row>
        );
    }
}

export default DragAndDrop;