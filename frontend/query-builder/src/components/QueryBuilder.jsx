import React, { Component } from 'react';
import { Query, Builder, BasicConfig, Utils as QbUtils } from 'react-awesome-query-builder';
import properCongfig from '../configs/properConfig.js';

import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css'; //optional, for more compact styles
import properConfig from '../configs/properConfig.js';

const InitialConfig = BasicConfig;

const config = {
    ...InitialConfig,
    ...properConfig
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = { "id": QbUtils.uuid(), "type": "group" };


export default class QueryBuilder extends Component {
    state = {
        tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
        config: config
    };

    render = () => (
        <div>
            <Query
                {...config}
                value={this.state.tree}
                onChange={this.onChange}
                renderBuilder={this.renderBuilder}
            />
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
        this.props.setQuery(sqlQuery);
    }
}