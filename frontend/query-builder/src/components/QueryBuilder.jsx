import React, { Component } from 'react';
import { Query, Builder, BasicConfig, Utils as QbUtils } from 'react-awesome-query-builder';
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css'; //optional, for more compact styles
import properConfig from '../configs/properConfig.js';
import btConfig from '../configs/btConfig.js';
import wifiConfig from '../configs/wifiConfig.js';

const InitialConfig = BasicConfig;

const pConfig = {
    ...InitialConfig,
    ...properConfig
};

const wConfig = {
    ...InitialConfig,
    ...wifiConfig
};

const bConfig = {
    ...InitialConfig,
    ...btConfig
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = { "id": QbUtils.uuid(), "type": "group" };


export default class QueryBuilder extends Component {
    state = {
        tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), wConfig),
        config: wConfig,
        configType: this.props.wifi
    };

    render = () => (
        <div>
            <select onChange={this.changeType}>
                <option value="wifi">Wifi</option>
                <option value="bt">Bluetooth</option>
                <option value="proper">Wifi and BT</option>
            </select>
            {
                this.state.configType === 'wifi' &&
                <Query
                    {...wConfig}
                    value={this.state.tree}
                    onChange={this.onChange}
                    renderBuilder={this.renderBuilder}
                />
            }
            {
                this.state.configType === 'bt' &&
                <Query
                    {...bConfig}
                    value={this.state.tree}
                    onChange={this.onChange}
                    renderBuilder={this.renderBuilder}
                />
            }
            {
                this.state.configType === 'proper' &&
                <Query
                    {...pConfig}
                    value={this.state.tree}
                    onChange={this.onChange}
                    renderBuilder={this.renderBuilder}
                />
            }

            {this.renderResult(this.state)}
        </div>
    )

    renderBuilder = (props) => (
        <div className="query-builder-container" style={{ padding: '10px' }}>
            <div className="query-builder qb-lite">
                <Builder {...props} />
            </div>
        </div>
    )

    renderResult = ({ tree: immutableTree, config }) => (
        <div className="query-builder-result">
            {
                QbUtils.sqlFormat(immutableTree, config) &&
                <div>SQL where: <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre></div>
            }
        </div>
    )

    onChange = (immutableTree, config) => {
        // Tip: for better performance you can apply `throttle` - see `examples/demo`
        this.setState({ tree: immutableTree, config: config });
        const sqlQuery = JSON.stringify(QbUtils.sqlFormat(immutableTree, config));
        this.props.setSubQuery(sqlQuery);
    }

    changeType = (e) => {
        if (e.target.value === 'wifi') {
            this.props.setWifi(e.target.value);
            this.setState({ config: wConfig, configType: this.props.wifi });

        }
        else if (e.target.value === 'bt') {
            this.props.setWifi(e.target.value);
            this.setState({ config: bConfig, configType: this.props.wifi });
        }
        else if (e.target.value === 'proper') {
            this.props.setWifi(e.target.value);
            this.setState({ config: pConfig, configType: this.props.wifi });
        }
        const tempQuery = structuredClone(this.props.query)
        tempQuery.type = e.target.value
        this.props.setQuery(tempQuery);
    }
}