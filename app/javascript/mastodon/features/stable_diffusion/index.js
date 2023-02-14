import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages } from 'react-intl';
import ColumnHeader from 'mastodon/components/column_header';
import Column from 'mastodon/features/ui/components/column';
import ImageGenerator from './components/image_generator';

const messages = defineMessages({
    heading: { id: 'column.image_generation', defaultMessage: 'Image Generation' },
});

export default class ImageGeneration extends ImmutablePureComponent {

    static propTypes = {
        multiColumn: PropTypes.bool,
    };


    handleHeaderClick = () => {
        this.column.scrollTop();
    }

    setRef = c => {
        this.column = c;
    }


    render() {
        const { multiColumn } = this.props;
        return (
            <Column bindToDocument={!multiColumn} ref={this.setRef} label={messages.heading.defaultMessage}>
                <ColumnHeader
                    icon='image'
                    title='Image Generation'
                    onClick={this.handleHeaderClick}
                    multiColumn={multiColumn}
                    showBackButton
                />

                <ImageGenerator />

                <Helmet>
                    <title>Image Generation</title>
                    <meta name='robots' content='noindex' />
                </Helmet>
            </Column>
        );
    }

}
