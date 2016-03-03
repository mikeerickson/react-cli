'use strict';

import React from 'react'; 
import { Button, Label, Row, Col, Input, MenuItem, DropdownButton } from 'react-bootstrap';
import DateTimeField from "react-bootstrap-datetimepicker";
import AutoComplete from './AutoComplete';
import moment from 'moment';
import _ from 'underscore';
import '../stylesheets/bootstrap-datetimepicker.min.css'

class SearchBar extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        
        this.valueChanger = this.handleChange.bind(this);
        this.textGroupChanger = this.handleTextGroupChanger.bind(this);
        this.checkboxChanger = this.handleCheckboxChange.bind(this);
        this.selectInputChanger = this.handleSelectInputChange.bind(this);
        
        const { items, col } = this.props;
        let output = {};
        items.map((item) => {
            if(item.param && item.param.init){
                output[item.param.output] = item.param.init;
            }
            if(item.param && item.param.length && item.param.length > 0){
                item.param.map((ip) => {
                    if(ip.init){
                        output[ip.output] = ip.init;
                    }
                })
            }
        });
        this.state = {
            items: items,
            col: col,
            output: output
        };
    }
    
    componentWillReceiveProps(nextProps){
        const { items, col } = nextProps;
        if(!_.isEqual(items, this.state.items)){
            let output = {};
            items.map((item) => {
                if(item.param && item.param.init){
                    output[item.param.output] = item.param.init;
                }
                if(item.param && item.param.length && item.param.length > 0){
                    item.param.map((ip) => {
                        if(ip.init){
                            output[ip.output] = ip.init;
                        }
                    })
                }
            });
            this.setState({
                items: items,
                col: col,
                output: output
            });
        }
    }
    
    handleChange(e, out, format){
        const { output } = this.state;
        let input = {};
        if(format){
            input[out] = e === "Invalid date" ? "" : moment(parseInt(e)).format(format);
        }else{
            input[out] = e.target.value === "Invalid date" ? "" : e.target.value;
        }
        const newoutput = {...output,...input};
        this.setState({output: newoutput});
        
        const { onSubmit, real } = this.props;
        real && (onSubmit && onSubmit(newoutput));
    }
    
    handleTextGroupChanger(e, out, key){
        const { output } = this.state;
        let input = {};
        input[out] = output[out] || {};
        input[out][key] = e.target.value;
        const newoutput = {...output,...input};
        this.setState({output: newoutput});
        
        const { onSubmit, real } = this.props;
        real && (onSubmit && onSubmit(newoutput));
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
        
        const { onSubmit, real } = this.props;
        real && (onSubmit && onSubmit(newoutput));
    }
    
    handleSelectInputChange(e, out, type){
        const { output } = this.state;
        let input = {};
        if(type){
            input[out] = {...output[out], type};
        }else{
            output[out].value = e.target.value;
        }
        const newoutput = {...output,...input};
        this.setState({output: newoutput});
        
        const { onSubmit, real } = this.props;
        real && (onSubmit && onSubmit(newoutput));
    }
    
    handleSubmit(e){
        this.props.onSubmit && this.props.onSubmit(this.state.output);
        e.preventDefault();
    }
    
    handleAutoCompleteSelect(e, out){
        const { output } = this.state;
        const { onSubmit, real } = this.props;
        output[out] = e.value;
        this.setState({output: output});
        real && (onSubmit && onSubmit(output));
    }
    
    resolver(items, item, output){
        const { type, param, label, style, lxs, wxs, bsSize, bsStyle } = item;
        const lxscn = "input-label col-xs-" + (lxs || 2);
        const wxscn = "col-xs-" + (wxs || lxs && 12 - lxs || 10);
        const size = bsSize || "small";
        const bstyle = bsStyle || "success";
        switch(type){
            case "text":
            case "email":
            case "password":
            case "textarea":
                return <Input label={label} type={type} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn} groupClassName="searchbar-form-group" onChange={(e) => this.valueChanger(e, param.output)}/>;
            case "texts":
                return <Input label={label} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn} groupClassName="searchbar-form-group">
                     <Row>
                        <Col xs={6}><Input type={"text"} onChange={(e) => this.handleTextGroupChanger(e, param.output, "min")} placeholder="最小值" /></Col>
                        <span style={{position: "absolute", marginLeft: -5, marginTop: 6}}>至</span>
                        <Col xs={6}><Input type={"text"} onChange={(e) => this.handleTextGroupChanger(e, param.output, "max")} placeholder="最大值" /></Col>
                     </Row>
                </Input>;
            case "selectinput":
                const titleArray = param.selecttypes.filter(item => output[param.output] && output[param.output].type === item.value);
                const title = titleArray && titleArray.length > 0 ? titleArray[0].label : "选择";
                const innerDropdown = <DropdownButton id={title} title={title} bsSize={size} bsStyle={bstyle}>
                    {param.selecttypes.map((type, index) => <MenuItem key={index} onClick={(e) => this.selectInputChanger(e, param.output, type.value)}>{type.label}</MenuItem>)}
                </DropdownButton>;
                return <Input label={label} type={type} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn} groupClassName="searchbar-form-group" buttonBefore={innerDropdown} onChange={(e)=> this.selectInputChanger(e, param.output)}/>;
            case "select":
            case "mselect":
                return <Input label={label} type={type} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn} groupClassName="searchbar-form-group" multiple={type === "mselect"} onChange={(e) => this.valueChanger(e, param.output)}>
                    {param.datas.map((item, index) => <option key={index} value={item.value || item}>{item.label || item}</option>)}
                </Input>;
            case "checkbox":
                const checkboxCheck = function(item){
                    return _.indexOf(output[param.output], item.value.toString()) >= 0;
                }
                return <Input label={label} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn} groupClassName="searchbar-form-group">
                    <Row style={{marginBottom: 0}}>{param.datas.map((item, index) => 
                        <Col xs={4} key={index}>
                            <Input type={type} checked={checkboxCheck(item)} value={item.value} label={item.label} onChange={(e) => this.checkboxChanger(e, param.output)}/>
                        </Col>
                    )}</Row>
                </Input>;
            case "radio":
                const radioCheck = function(value){
                    return output[param.output] == value;
                }
                return <Input label={label} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn}groupClassName="searchbar-form-group">
                    <Row style={{marginBottom: 0}}>{param.datas.map((item, index) => 
                        <Col xs={4} key={index}>
                            <Input type={type} checked={radioCheck(item.value || item)} value={item.value || item} label={item.label || item} onChange={(e) => this.valueChanger(e, param.output)}/>
                        </Col>)}
                    </Row>
                </Input>;
            case "file":
                return <Input label={label} type={type} bsSize={size} bsStyle={bstyle} style={style} labelClassName={lxscn} wrapperClassName={wxscn} />;
            case "datetime":
                moment.locale("zh_CN");
                const format = item.format || "YYYY-MM-DD";
                return <Input label={label} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn}>
                    <Row>
                        {param.map((p, index) => {
                            const xs = 12/param.length;
                            const constr = index === 0 ? <div/> : <span style={{position: "absolute", marginLeft: -5, marginTop: 6}}>至</span>;
                            return <div key={index}>
                                {constr}
                                <Col xs={xs}><DateTimeField mode={item.mode || "date"} inputFormat={format} onChange={(value) => this.handleChange(value, p.output, format)}/></Col>
                            </div>
                        })}
                    </Row>
                </Input>;
            case "datetimes":
                return <Input label={label} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn}>
                    <Row>
                        <Col xs={6}><DateTimeField mode={item.mode || "date"} inputFormat={format} onChange={(value) => this.handleChange(value, p.output, "start", format)}/></Col>
                        <span style={{position: "absolute", marginLeft: -5, marginTop: 6}}>至</span>
                        <Col xs={6}><DateTimeField mode={item.mode || "date"} inputFormat={format} onChange={(value) => this.handleChange(value, p.output, "end", format)}/></Col>
                    </Row>
                </Input>;
            case "auto":
                return <Input label={label} style={style} bsSize={size} bsStyle={bstyle} labelClassName={lxscn} wrapperClassName={wxscn}>
                    <Row style={{marginBottom: 0}}>
                        <Col xs={12} style={{marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0}}>
                            <AutoComplete datas={param.datas} wxs={12} onSelect={(value) => this.handleAutoCompleteSelect(value, param.output)}/>
                        </Col>
                    </Row>
                </Input>
            case "reset":
            case "submit":
                const { oxs, xs } = item;
                const btnStyle = {marginLeft: 15};
                return <Col xsOffset={oxs} xs={xs}><Button type={type} style={btnStyle} bsSize={size} bsStyle={bstyle} block>{label}</Button></Col>;
            default:
                return <div/>;
        }
    }
    
    render() {
        const { output, items, col } = this.state;
        const xs = 12 / (col || 1);
        const itemCols = items.map((item, index) => <Col xs={xs} key={index} style={{paddingBottom: 5}}>{this.resolver(items, item, output)}</Col>);
        return <form onSubmit={this.handleSubmit.bind(this)}><Row>{itemCols}</Row></form>;
    }
}

export default SearchBar;