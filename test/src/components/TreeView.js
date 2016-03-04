'use strict';
import React from 'react';

class TreeNode extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.itemStyle = { cursor: "pointer"};
        this.spanStyle = { width: "1rem", height: "1rem"};
        this.indentStyle = { marginLeft: 10,  marginRight: 10};
        this.iconStyle = { marginLeft: 10,  marginRight: 10};
        
        const { node: {state}, options, level } = this.props;
        const expanded = state && state.expanded || (level < options.levels ? true : false);
        const selected = state && state.selected || false;
        this.state = {
            expanded: expanded,
            selected: selected,
            checked: []
        }
    }

    toggleExpanded(e) {
        this.setState({ expanded: !this.state.expanded });
        e.stopPropagation();
    }
    
    toggleSelected(e) {
        this.setState({ selected: !this.state.selected });
        e.stopPropagation();
    }
    
    toggleChecked(node, nodeValue, e) {
        const { checked, onCheck } = this.props;
        if(e.target.checked){
            this.checkedPusher(node, checked, nodeValue);
        } else {
            this.checkedSplice(node, checked, nodeValue);
        }
        onCheck(checked);
        e.stopPropagation();
    }
    
    checkedPusher(node, checked, nodeValue){
        const value = node[nodeValue] || node.id;
        checked.push(value);
        if(node.children){
            node.children.map((item) => {
                const value = node[nodeValue] || node.id;
                if(checked.length === 0 || checked.filter((item) => item.toString() === value.toString()).length === 0){
                    checked.push(value);
                }
                this.checkedPusher(item, checked, nodeValue);
            });
        }
    }
    
    checkedSplice(node, checked, nodeValue){
        const value = node[nodeValue] || node.id;
        for(let index in checked){
            if(checked[index].toString() === value.toString()){
                checked.splice(index, 1);
                index--;
            }
        }
        if(node.children){
            node.children.map((item) => {
                const value = node[nodeValue] || node.id;
                for(let index in checked){
                    if(checked[index].toString() === value.toString()){
                        checked.splice(index, 1);
                        index--;
                    }
                }
                this.checkedSplice(item, checked, nodeValue);
            });
        }
    }
    
    checked(value){
        const { checked } = this.props;
        return checked.length > 0 && checked.filter((item) => item.toString() === value.toString()).length > 0;
    }
    
    render() {
        const { node, options, visible, level, checked, onCheck } = this.props;
        const { selected, expanded } = this.state;
        const { highlightSelected, selectedColor, selectedBackColor, color, backColor, showBorder, borderColor, nodeValue, nodeLabel } = options;
        const { expandIcon, collapseIcon, nodeIcon } = options;
        const _nodeValue = node[nodeValue] || node.id;
        const _nodeLabel = node[nodeLabel] || node.text;
        
        let style;
        if (!visible) {
            style = { display: 'none' };
        } else {
            if (highlightSelected && selected) {
                style = {
                    color: selectedColor,
                    backgroundColor: selectedBackColor
                };
            }else {
                style = {
                    color: node.color || color,
                    backgroundColor: node.backColor || backColor
                };
            }
            if (!showBorder) {
                style.border = 'none';
            }else if (borderColor) {
                style.border = '1px solid ' + borderColor;
            }
        }

        let indents = [];
        for (let i = 0; i < level - 1; i++) {
            indents.push(<span style={{...this.indentStyle, ...this.spanStyle}}></span>);
        }

        let expandCollapseIcon;
        if (node.children) {
            if (expanded) {
                expandCollapseIcon = <span style={this.spanStyle} className={collapseIcon} onClick={this.toggleExpanded.bind(this)}></span>;
            } else {
                expandCollapseIcon = <span style={this.spanStyle} className={expandIcon} onClick={this.toggleExpanded.bind(this)}></span>;
            }
        }else{
            expandCollapseIcon = <span style={this.spanStyle} data-value={_nodeValue} className={nodeIcon}></span>
        }

        let checkbox;
        if(options.checkedable){
           checkbox = <span style={{...this.iconStyle, ...this.spanStyle}}><input type="checkbox" checked={this.checked(_nodeValue)} onChange={this.toggleChecked.bind(this, node, nodeValue)}></input></span>;
        }

        let nodeText;
        if (options.enableLinks) {
            nodeText = <a href={node.href} data-value={_nodeValue}>{}</a>;
        } else {
            nodeText = <span style={this.spanStyle} data-value={_nodeValue}>{_nodeLabel}</span>;
        }

        let badges;
        if (options.showTags && node.tags) {
            badges = node.tags.map(tag => <span style={this.spanStyle} className='badge'>{tag}</span>);
        }

        let children = [];
        if (node.children) {
            children = node.children.map((childnode, index) => <TreeNode key={index} node={childnode} level={level+1} visible={expanded && visible} options={options} checked={checked} onCheck={onCheck}/>);
        }

        return (
            <li style={{...this.itemStyle, ...style}} onClick={this.toggleSelected.bind(this)} data-value={_nodeValue}>
                {indents} {expandCollapseIcon} {checkbox} {nodeText} {badges} {children}
            </li>
        );
    }
};

export default class TreeView extends React.Component{
    
    constructor(props, context) {
        super(props, context);
        this.state = {
            checked: []
        }
    }
    
    handleChecked(checked){
        console.log(checked);
        this.setState({checked: checked});
    }

    render() {
        const { data } = this.props;
        const { checked } = this.state;
        let children = data && data.map((node, index) => <TreeNode node={node} level={1} visible={true} options={this.props} checked={checked} key={index} onCheck={this.handleChecked.bind(this)}/>) || [];
        return (
            <div id='treeview' className='treeview'>
                <ul className='list-group'>{children}</ul>
            </div>
        );
    }
};

TreeView.propTypes = {
    levels: React.PropTypes.number,
    expandIcon: React.PropTypes.string,
    collapseIcon: React.PropTypes.string,
    nodeIcon: React.PropTypes.string,
    color: React.PropTypes.string,
    backColor: React.PropTypes.string,
    borderColor: React.PropTypes.string,
    onhoverColor: React.PropTypes.string,
    selectedColor: React.PropTypes.string,
    selectedBackColor: React.PropTypes.string,
    enableLinks: React.PropTypes.bool,
    highlightSelected: React.PropTypes.bool,
    showBorder: React.PropTypes.bool,
    showTags: React.PropTypes.bool,
    children: React.PropTypes.arrayOf(React.PropTypes.number)
};

TreeView.defaultProps = {
    levels: 2,
    expandIcon: 'glyphicon glyphicon-folder-close',
    collapseIcon: 'glyphicon glyphicon-folder-open',
    nodeIcon: 'glyphicon glyphicon-file',
    color: undefined,
    backColor: undefined,
    borderColor: undefined,
    onhoverColor: '#F5F5F5',
    selectedColor: '#FFFFFF',
    selectedBackColor: '#428bca',
    enableLinks: false,
    highlightSelected: true,
    showBorder: true,
    showTags: false,
    children: []
};