'use strict';

import React from 'react'; 
import { Button, Label, Row, Col, Input } from 'react-bootstrap';
import _ from 'underscore';

class SearchBar extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.valueChanger = this.handleChange.bind(this);
        this.checkboxChanger = this.handleCheckboxChange.bind(this);
        
        this.state = {
            output: {}
        };
    }
    
    handleChange(e, out){
        const { output } = this.state;
        let input = {};
        input[out] = e.target.value;
        const newoutput = {...output,...input};
        this.setState({output: newoutput});
        console.log(newoutput);
    }
    
    handleCheckboxChange(e, out){
        const { checked, value } = e.target;
        const { output } = this.state;
        let inputValus = output[out] || [], input = {};
        if(checked){
            inputValus.push(value);
        }else{
            inputValus = _.without(inputValus, value);
        }
        input[out] = inputValus;
        const newoutput = {...output,...input};
        this.setState({output: newoutput});
        console.log(newoutput);
    }
    
    resolver(items, item, output){
        const { type, param, label, style, lxs, wxs } = item;
        const lxscn = "col-xs-" + (lxs || 2);
        const wxscn = "col-xs-" + (wxs || lxs && 12 - lxs || 10);
        switch(type){
            case "text":
            case "email":
            case "password":
            case "textarea":
                return <Input label={label} type={type} style={style} labelClassName={lxscn} wrapperClassName={wxscn} onChange={(e) => this.valueChanger(e, param.output)}/>;
            case "select":
            case "mselect":
                return <Input label={label} type={type} style={style} labelClassName={lxscn} wrapperClassName={wxscn} multiple={type === "mselect"} onClick={(e) => this.valueChanger(e, param.output)}>
                    {param.datas.map((item, index) => <option key={index} value={item.value}>{item.label}</option>)}
                </Input>;
            case "checkbox":
                const checkboxCheck = function(item){
                    return _.indexOf(output[param.output], item.value.toString()) >= 0;
                }
                return <Input label={label} style={style} labelClassName={lxscn} wrapperClassName={wxscn}>
                    <Row>{param.datas.map((item, index) => 
                        <Col xs={4} key={index}>
                            <Input type={type} checked={checkboxCheck(item)} value={item.value} label={item.label} onChange={(e) => this.checkboxChanger(e, param.output)}/>
                        </Col>
                    )}</Row>
                </Input>;
            case "radio":
                const radioCheck = function(item){
                    return output[param.output] == item.value;
                }
                return <Input label={label} style={style} labelClassName={lxscn} wrapperClassName={wxscn}>
                    <Row>{param.datas.map((item, index) => 
                        <Col xs={4} key={index}>
                            <Input type={type} checked={radioCheck(item)} value={item.value} label={item.label} onChange={(e) => this.valueChanger(e, param.output)}/>
                        </Col>)}
                    </Row>
                </Input>;
            case "file":
                return <Input label={label} type={type} style={style} labelClassName={lxscn} wrapperClassName={wxscn} />;
            case "reset":
            case "submit":
                return <Button type={type} style={style}>{label}</Button>;
            default:
                return <div/>;
        }
    }
    
    render() {
        const { output } = this.state;
        const { items, col } = this.props;
        const xs = 12 / (col || 1);
        const itemCols = items.map((item, index) => <Col xs={xs} key={index}>{this.resolver(items, item, output)}</Col>);
        return <Row>
            {itemCols}
        </Row>;
    }
}

export default SearchBar;