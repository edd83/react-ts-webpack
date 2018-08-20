import React, { Component } from 'react';

export class Home extends Component {

    constructor(props: any) {
        super(props);
    }

    render() {
        const styles = require('./Home.scss');
        return (
            <div className={styles.home}>
                <span>Bonjour dans Home</span>
            </div>
        );
    }
}