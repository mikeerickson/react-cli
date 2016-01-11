'use strict';

import React from 'react'; 
import { Panel, Grid, Row, Col, Button, Thumbnail, Label, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class UserProfileGrid extends React.Component {

    render() {
        const { infos, labels }= this.props;
        
        const bsStyles = ["success", "info", "warning", "danger"];
        const bgColor = ["#df7fff","#00cc7d","#00cacc","#5cd65c","#ffdf7f","#ff7f7f","#65ff65","#FF33CC","#ff7fd0"];
        const labelStyle = { marginRight: 2};
        const handlerStyle = { marginRight: 2, cursor: "pointer" };
        const secondthumbStyle = { margin: 0, padding: 0, cursor: "pointer" };
        const panelStyle = { marginBottom: 0, padding: 0 };
        const thumbStyle = { margin: "3px 0", padding: "10px", border: 0, cursor: "pointer" };
        
        let odd= [], even = [];
        for(var i in infos){
            let info = infos[i], item;
            let flag = i % 2;
            let datatype = info.datatype;
            if(info.type === "data") {
                let data = info.data;
                let datadiv = <Row>{data.map(function(d, j){
                    let pLabels = [],index = 1;
                    for(let item in d){
                        let label = labels[item] ? labels[item] + "：" : "";
                        let itemStyle = bsStyles[index++ % 2];
                        pLabels.push(<ListGroupItem key={index} bsStyle={itemStyle} style={labelStyle}>{label + d[item]}</ListGroupItem>);
                    }
                    return <Col xs={4} md={4} key={j} style={{padding: 3}}>
                            <LinkContainer to={"/" + datatype + "?key=" + JSON.stringify(d)}>
                                <ListGroup fill style={{padding:0, margin: 0}}>{pLabels}</ListGroup>
                            </LinkContainer>
                        </Col>;
                })}</Row>;
                item = <Thumbnail key={i} style={thumbStyle}>
                    {datadiv}
                </Thumbnail>;
            }else{
                item = <Thumbnail key={i} style={thumbStyle}>
                    <Row><Col xs={4} md={4} style={{padding: 3}}>
                        <LinkContainer to={"/" + datatype + "?key=" + JSON.stringify(info)}>
                            <ListGroup fill style={{padding:0, margin: 0}}>
                                <ListGroupItem bsStyle="warning" key={1} style={labelStyle}>{info.title}</ListGroupItem>
                                <ListGroupItem bsStyle="success" key={2} style={labelStyle}>{info.desc}</ListGroupItem>
                            </ListGroup>
                        </LinkContainer>
                    </Col></Row>
                </Thumbnail>;
            }
            if(flag === 0){
                odd.push(item);
            }else{
                even.push(item);
            }
        }
        return <Row>
            <Col xs={6} md={6} style={{padding: 10}}>{odd}</Col>
            <Col xs={6} md={6} style={{padding: 10}}>{even}</Col>
        </Row>
    }
}

export default UserProfileGrid;