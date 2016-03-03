'use strict';

import React from 'react';
import { Panel, Input, Row, Col, OverlayTrigger } from 'react-bootstrap';
import _ from 'underscore';

export default class AutoComplete extends React.Component{
        
    constructor(props, context) {
        
        super(props, context);
        const { itemValue, itemLabel, shortcut } = this.props;
        
        this.state = {
            datas: [],
            target: "",
            hover: "",
            itemValue: itemValue || "value",
            itemLabel: itemLabel || itemValue || "label",
            shortcut: shortcut,
            value:{},
            hoverIndex: 0,
            ulStyle:{}
        };
    }
    
    handleChange(e){
        const inputValue = e.target.value;
        const { datas, ulShowStyle, ulHideStyle } = this.props;
        const { itemValue, itemLabel, shortcut } = this.state;
        if(inputValue.trim() === ""){
            if(datas instanceof Array){
                let dataItems = datas.map((data) => {
                    if(typeof data === "string"){
                        let dataItem = {};
                        dataItem[itemValue] = dataItem[itemLabel] = data;
                        return dataItem;
                    }else{
                        return data;
                    }
                });
                this.setState({target: inputValue, datas: dataItems, value: {l:inputValue, v: ""}, ulStyle: ulShowStyle});
            }else{
                this.setState({target: inputValue, datas: [], value: {l:inputValue, v: ""}, ulStyle: ulHideStyle});
            }
        }else{
            if(datas instanceof Array){
                this.initDataList(datas, inputValue, itemValue, itemLabel, shortcut);
            }
        }
    }
    
    initDataList(datas, inputValue, itemValue, itemLabel, shortcut){
        // 直接等于输入值的
        let tmpValueDatas = [];
        // 从第一个字符开始匹配的
        let tmpFirstDatas = [];
        // 非第一个字符开始匹配的
        let tmpNoFirstDatas = [];
        let inputLowerValue = inputValue.toLowerCase();
        for(let i in datas){
            let data = datas[i], dataItem = {};
            let value = dataItem[itemValue] = (typeof data === "string" ? data : data[itemValue]);
            let label = dataItem[itemLabel] = (typeof data === "string" ? data : data[itemLabel].toString());
            let shortcutkey = typeof data !== "string" && shortcut ? data[shortcut].toLowerCase() : null;
            value = typeof value === "string" ? value.toLowerCase() : value;
            label = typeof label === "string" ? label.toLowerCase() : label;
            if(value == inputLowerValue || (shortcutkey && shortcutkey.indexOf(inputLowerValue) === 0)){
                dataItem["type$res"] = 1;
                tmpValueDatas.push(dataItem);
            }else if(label.indexOf(inputLowerValue) === 0){
                dataItem["type$res"] = 2;
                tmpFirstDatas.push(dataItem);
            }else if(label.indexOf(inputLowerValue) > 0){
                dataItem["type$res"] = 3;
                tmpNoFirstDatas.push(dataItem);
            }
        }
        // 按顺序把数据集连接起来
        tmpValueDatas = tmpValueDatas.concat(tmpFirstDatas).concat(tmpNoFirstDatas);
        this.setState({
            target: inputValue, 
            datas: tmpValueDatas, 
            value: {l: inputValue, v: ""}, 
            ulStyle: this.props.ulShowStyle
        });
    }
    
    handleKeyUp(e){
        const { itemValue, itemLabel, datas } = this.state;
        let { hoverIndex, hover } = this.state;
        if(datas && datas.length > 0){
            if(e.keyCode == 13){
                this.setState({value: {l: datas[hoverIndex][itemLabel], v: hover}, datas:[], ulStyle: this.props.ulHideStyle});
                if(this.props.onSelect){
                    this.props.onSelect({
                        value: hover, 
                        label: datas[hoverIndex][itemLabel]
                    });
                };
            }else{
                if((e.keyCode == 40 || e.keyCode == 38) && hover == ""){
                    hover = datas[hoverIndex][itemValue];
                }else if(e.keyCode == 40 && hoverIndex < datas.length -1){
                    hover = datas[++hoverIndex][itemValue];
                }else if(e.keyCode == 38 && hoverIndex > 0){
                    hover = datas[--hoverIndex][itemValue];
                }else{
                    hover = "";
                }
                this.setState({
                    hover: hover, 
                    hoverIndex: hoverIndex
                });
                if(this.props.onSelect){
                    this.props.onSelect({
                        value:hover, 
                        label: datas[hoverIndex][itemLabel]
                    })
                };
            }
        }
    }
    
    handleLiClick(e){
        const targetValue = e.currentTarget.getAttribute("data");
        const { itemValue, itemLabel, datas } = this.state;
        let targetLabel = "";
        for(let i in datas){
            if(targetValue == datas[i][itemValue]){
                targetLabel = datas[i][itemLabel]
                break;
            }
        }
        this.setState({value: {l: targetLabel, v: targetValue}, datas:[], ulStyle: this.props.ulHideStyle});
        if(this.props.onSelect){
            this.props.onSelect({
                value:targetValue, 
                label: targetLabel
            })
        };
    }
    
    handleLiMouseOver(e){
        this.setState({hover: e.target.getAttribute("data")});
    }
    
    handleLiMouseOut(e){
        this.setState({hover: ""});
    }
    
    renderResList(datas, target, itemValue, itemLabel){
        const { spanStyle, spanHightStyle, liOverStyle, liDefaultStyle, liTypeOverStyle, liTypeStyle } = this.props;
        const { hover } = this.state;
        const dataLength = datas.length;
        let uls = [];
        for(let i in datas){
            let data = datas[i], value = data[itemValue], label = data[itemLabel], type = data["type$res"];
            let liStyle = value == hover ? liOverStyle : liDefaultStyle;
            if(i < datas.length - 1 && datas[parseInt(i) + 1]["type$res"] && type != datas[parseInt(i) + 1]["type$res"]){
                liStyle = value == hover ? liTypeOverStyle : liTypeStyle;
            }
            if(!type || type == 1){
                uls.push(<li data={value} key={i} style={liStyle} onClick={(e) => this.handleLiClick(e)} onMouseOver={(e) => this.handleLiMouseOver(e)} onMouseOut={(e) => this.handleLiMouseOut(e)}>{label}</li>);
            } else if(type == 2) {
                let hightLabel = <span style={spanHightStyle}>{target}</span>;
                let commonLabel = <span style={spanStyle}>{label.substr(target.length)}</span>;
                uls.push(<li data={value} key={i} style={liStyle} onClick={(e) => this.handleLiClick(e)} onMouseOver={(e) => this.handleLiMouseOver(e)} onMouseOut={(e) => this.handleLiMouseOut(e)}>{hightLabel}{commonLabel}</li>);
            } else if(type == 3) {
                let hightLabel = <span style={spanHightStyle}>{target}</span>;
                let index = label.indexOf(target);
                let firstLabel = <span style={spanStyle}>{label.substring(0, index)}</span>;
                let lastLabal = <span style={spanStyle}>{label.substr(index + target.length)}</span>;
                uls.push(<li data={value} key={i} style={liStyle} onClick={(e) => this.handleLiClick(e)} onMouseOver={(e) => this.handleLiMouseOver(e)} onMouseOut={(e) => this.handleLiMouseOut(e)}>{firstLabel}{hightLabel}{lastLabal}</li>);
            }
        }
        return uls;
    }
    
    render(){
        const { itemValue, itemLabel, datas, target, value, ulStyle } = this.state;
        const { lxs, wxs, label, placeholder } = this.props;
        const uls = this.renderResList(datas, target, itemValue, itemLabel);
        const uldivStyle = {...ulStyle, width: 540};
        const uldiv = <ul style={uldivStyle}>{uls}</ul>;
        return (<div style={{width: 540}}>
            <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={uldiv}>
                <Input type='text' bsSize='small'
                    value={value.l} 
                    data={value.v} 
                    label={label} 
                    onChange={(e) => this.handleChange(e)} 
                    onFocus={(e) => this.handleChange(e)}
                    onKeyUp={(e) => this.handleKeyUp(e)} 
                    placeholder={placeholder}
                    labelClassName={"col-xs-" + (lxs || 1)} 
                    wrapperClassName={"col-xs-" + (wxs || 11)}>
                </Input>
            </OverlayTrigger>
        </div>);
    }
}

AutoComplete.propTypes = {
    ulShowStyle: React.PropTypes.object,
    ulHideStyle: React.PropTypes.object,
    liDefaultStyle: React.PropTypes.object,
    liTypeStyle: React.PropTypes.object,
    liOverStyle: React.PropTypes.object,
    liTypeOverStyle: React.PropTypes.object,
    spanStyle: React.PropTypes.object,
    spanHightStyle: React.PropTypes.object,
    lxs: React.PropTypes.Number,
    wxs: React.PropTypes.Number,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    itemValue: React.PropTypes.string,
    itemLabel: React.PropTypes.string,
    datas: React.PropTypes.string || React.PropTypes.object
};

AutoComplete.defaultProps = {
    ulShowStyle: {border: "1px solid #ccc", padding: "0", maxHeight: 200, overflowX: "hidden", boxShadow: "0 5px 10px rgba(0,0,0,.2)", position: "absolute", backgroundColor: "#FFF", zIndex: 99, marginTop: 30, marginLeft: 15},
    ulHideStyle: {display: "none"},
    liDefaultStyle: {borderBottom: "1px solid #ddd", listStyle: "none", padding: 3, minHeight: 24},
    liTypeStyle: {borderBottom: "2px solid #0dd", listStyle: "none", padding: 3, minHeight: 24},
    liOverStyle: {borderBottom: "1px solid #ddd",listStyle: "none", padding: 3, backgroundColor: "#d9edf7", cursor: "pointer", minHeight: 24},
    liTypeOverStyle: {borderBottom: "2px solid #0dd",listStyle: "none", padding: 3, backgroundColor: "#d9edf7", cursor: "pointer", minHeight: 24},
    spanStyle: {cursor: "pointer"},
    spanHightStyle: {color:"red", fontWeight: 600, cursor: "pointer"}
};