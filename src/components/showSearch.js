import React, {Component} from 'react';
import { Grid, Select, Card } from 'semantic-ui-react';
import Client from '../utils/restClient';

export default class ShowSearch extends Component {
    state = {
        show : null,
        time : null,
        showOptions : [],
        timeOptions : [],
        shows : []
    }
    client = new Client();

    componentDidMount() {
        this.client.getVenuesAndShows((data) => {
            this.setState({
                shows : data,
                showOptions : this.buildShowOptions(data)
            })
        })
    }

    render() {
        return (
            <Grid celled>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {this.renderShowSelection()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        {this.renderTimeSelection()}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        {this.renderCard()}
                    </Grid.Column>
                    <Grid.Column width={11}>
                        HELLO
                    </Grid.Column>
                </Grid.Row>
            </Grid> 
        )
    }

    renderTimeSelection = () => {
        return this.buildSelectComponent(
            'Choose a Date & Time', 
            this.state.timeOptions, 
            this.state.time, 
            ((e, {value}) => {
                this.setState({
                    time : value
                })
            })
        )
    }

    renderShowSelection = () => {
        return this.buildSelectComponent(
            'Choose a Show', 
            this.state.showOptions, 
            this.state.show, 
            ((e, {value}) => {
                this.client.getPerformancesByShow(value, (performances) => {
                    this.setState({
                        show : value,
                        time : null,
                        performances : performances,
                        timeOptions : this.buildTimeOptions(performances) 
                    })
                })
            })
        )
    }

    renderCard = () => {
        const selectedShow = this.state.shows.find(show => show.id === this.state.show)
        if (selectedShow !== undefined) {
            return(
                <Card key='infoCard'>
                    <Card.Content header={selectedShow.name} />
                    <Card.Content description={selectedShow.description}/>
                </Card>
            )
        }
    }

    buildShowOptions = (shows) => {
        return(
            shows.map(show => {
                return({
                    key : show.name,
                    text : `${show.name} at ${show.venue.name}`,
                    value : show.id
                })
            })
        )
    }

    buildSelectComponent = (placeholder, options, value, handler) => {
        return (
            <Select
                key={placeholder}
                placeholder={placeholder}
                options={options}
                value={value}
                onChange={handler}
            />
        )
    }

    buildTimeOptions = (performances) => {
        return performances.map(p => {
            return({id : p.id, time : new Date(p.showTime)})
        })
        .sort((a,b) => a.time.getTime() - b.time.getTime())
        .map((p, idx) => {
            return({
                key : idx,
                text : `${p.time.toDateString()} at ${p.time.toLocaleTimeString()}`,
                value : p.id
            })
        })
    }
}


