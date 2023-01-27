/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export default class BlockchainInfoPanel extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
        this.source = axios.CancelToken.source();
    };

    static propTypes = {
        accountId: PropTypes.string.isRequired,
    }

    componentDidMount() {
        axios.get(`/blockchain_info/${this.props.accountId}`, { cancelToken: this.source.token })
            .then(response => {
                this.setState({ data: response.data });
                // eslint-disable-next-line no-console
                console.log('response data', response.data);
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.error('Request canceled', error.message);
                } else {
                    console.error(error);
                }
            });
    };

    componentWillUnmount() {
        this.source.cancel('Canceling request as component is unmounting.');
    };


    render() {
        return (
            <div style={{ padding: '1rem' }}>
                <div className='account__header__bio' >
                    <div className='account__header__fields'>
                        <dl style={{ display: 'flex', alignItems: 'center' }}>
                            <dt>Social Score</dt>
                            <dd style={{ marginLeft: '1rem' }}>{this.state.data.social_score ? this.state.data.social_score.toFixed(0) : 0}</dd>
                        </dl>
                        <dl>
                            <div style={{ display: 'flex' }}>
                                <dt>Level</dt>
                                <dd style={{ marginLeft: '1rem' }}>{this.state.data.level ? this.state.data.level : 0}</dd>
                            </div>
                            <div className='upload-progress__backdrop'>
                                <div className='upload-progress__tracker' style={{ width: `${this.state.data.percentage_to_next_level ? this.state.data.percentage_to_next_level : 0}%` }} />
                            </div>
                        </dl>
                        <dl style={{ display: 'flex', alignItems: 'center' }}>
                            <dt>Balance</dt>
                            <dd style={{ marginLeft: '1rem' }}>{this.state.data.num_tokens_available ? this.state.data.num_tokens_available : 0}<span role='img' aria-label='thread-tokens'>{' '}🧵</span></dd>
                        </dl>
                        <dl style={{ display: 'flex', alignItems: 'center' }}>
                            <dt>Daily Reward</dt>
                            <dd style={{ marginLeft: '1rem' }}>{this.state.data.daily_payout_value ? this.state.data.daily_payout_value.toFixed(0) : 0}<span role='img' aria-label='thread-tokens'>{' '}🧵</span></dd>
                        </dl>
                    </div>
                </div>
            </div>
        );
    }

}
