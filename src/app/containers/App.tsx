import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired
    };

    constructor(props:any) {
        super(props);
    }

    render() {
        const styles = require('./App.scss');
        return (
            <div className={styles.app}>
                <span>Eddy Lardet dans App</span>
                <div className={styles.appContent}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}