"use strict";

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class Test extends Component {
    
    componentDidMount() {
        const { dispatch } = this.props;
    }
    
    render(){
        return (
            <div className="container">
                Test Page！
            </div>
        );
    }
    
}

export default connect(state => {})(Test)