"use strict";

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class Demo extends Component {
    
    componentDidMount() {
        const { dispatch } = this.props;
    }
    
    render(){
        return (
            <div className="container">
                Demo Page！
            </div>
        );
    }
    
}

export default connect(state => {})(Demo)