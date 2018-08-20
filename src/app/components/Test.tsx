import * as React from 'react';
interface IProps {
    compiler: string,
    framework: string,
    bundler: string
}
export class Test extends React.Component<IProps, {}> {
    render() {
        console.log("passing test");
        
        return <div>
            <h1>BLABLBALBA</h1>
            <div>
                {this.props.children}
            </div>
        </div>
    }
}