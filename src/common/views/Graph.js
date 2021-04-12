import React, { Component } from 'react';
import { Card, Radio, Typography, Tooltip } from 'antd';
import moment from 'moment';
import {
    BarChartOutlined
} from '@ant-design/icons';
  
class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeDelta: 1
        };
    }

    addQuery = (link, name, value) => {
        if (!name.startsWith('var-') && value === null) {
            return link;
        }

        value = value === undefined ? "All" : value;
        return link + "&" + name + "=" + value;
    }

    onChange = e => {
        this.setState((state) => {
            state.timeDelta = e.target.value;
            return state;
        });
    }

    render() {
        // TODO: Get this from redux
        let { meta, from, to, jobId, instanceId, testId, minimized } = this.props;
        if (!meta) {
            return null;
        }
        var src = "http://192.168.64.2:32387/d-solo/diago-test-info-dashboard?";
        var dashLink = "http://192.168.64.2:32387";

        from= from ? from : moment().subtract(this.state.timeDelta, 'hours').unix() * 1000;
        to= to ? to : moment().unix() * 1000;

        src = this.addQuery(src, "theme", "light");
        src = this.addQuery(src, "from", from);
        src = this.addQuery(src, "to", to);
        src = this.addQuery(src, "var-jobid", jobId);
        src = this.addQuery(src, "var-instid", instanceId);
        src = this.addQuery(src, "var-testid", testId);

        return (
            <div style={{"width": "100%"}}>
                <div style={{"textAlign": "right", "marginBottom": "6px", "width": "100%"}}>
                    <Typography.Link href={dashLink} target="_blank">
                        <Tooltip placement="left" title={"Open in Grafana"}>
                            <BarChartOutlined
                                style={{"fontSize": 20}}
                            />
                        </Tooltip>
                    </Typography.Link>
                </div>
                <Card style={{"textAlign": "center", "width": "100%"}}>
                        <iframe
                            src={this.addQuery(src, "panelId", "3")}
                            width="100%"
                            height={minimized ? "300" : "200"} 
                            title={this.addQuery(src, "panelId", "3")}
                            frameBorder="0">    
                        </iframe>
                        {minimized && (
                            <Radio.Group defaultValue={1} size="small" style={{ marginTop: 16 }} onChange={this.onChange}>
                                <Radio.Button value={1}>1h</Radio.Button>
                                <Radio.Button value={3}>3h</Radio.Button>
                                <Radio.Button value={6}>6h</Radio.Button>
                                <Radio.Button value={12}>12h</Radio.Button>
                                <Radio.Button value={24}>24h</Radio.Button>
                            </Radio.Group>
                        )}
                        {!minimized ? <iframe
                            src={this.addQuery(src, "panelId", "2")}
                            width="100%"
                            height="200"
                            title={this.addQuery(src, "panelId", "2")}
                            frameBorder="0">    
                        </iframe>: null}
                        {!minimized ? <iframe
                            src={this.addQuery(src, "panelId", "1")}
                            width="100%"
                            height="200"
                            title={this.addQuery(src, "panelId", "1")}
                            frameBorder="0">    
                        </iframe>: null}
                </Card>
            </div>

        );
  }
}

Graph.propTypes = {
};

export default Graph;