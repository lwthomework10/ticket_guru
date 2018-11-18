import React, {Component} from 'react';
import { Grid, Select, Card } from 'semantic-ui-react';
import Client from '../utils/restClient';
import SeatPicker from './seatPicker';

export default class ShowSearch extends Component {
    state = {
        show : null,
        time : null,
        showOptions : [],
        timeOptions : [],
        levels : null
    }
    client = new Client();

    componentDidMount() {
        this.client.getVenuesAndShows((data) => {
            const showMap = new Map();
            data.forEach(show => {
                showMap.set(show.id, show);
            });
            this.setState({
                shows : showMap,
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
                        {this.renderSeatPicker()}
                    </Grid.Column>
                </Grid.Row>
            </Grid> 
        )
    }

    renderSeatPicker = () => {
        if (this.state.levels !== null){
            return(
                <SeatPicker 
                    show={this.state.shows.get(this.state.show)}
                    performances={this.state.performances.get(this.state.time)}
                    levels={this.state.levels}
                />
            )
        }
    }

    renderTimeSelection = () => {
        return this.buildSelectComponent(
            'Choose a Date & Time', 
            this.state.timeOptions, 
            this.state.time, 
            ((e, {value}) => {
                this.client.getLevelsByVenue(this.state.shows.get(this.state.show).venue.id, (levels) => {
                    console.log('levels -> ', levels)
                    this.setState({
                        time : value,
                        levels : levels
                    })
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
                    const perfMap = new Map();
                    performances.forEach(p => {
                        perfMap.set(p.id, p)
                    })
                    this.setState({
                        show : value,
                        time : null,
                        levels : null,
                        performances : perfMap,
                        timeOptions : this.buildTimeOptions(performances) 
                    })
                })
            })
        )
    }

    renderCard = () => {
        if (this.state.shows !== undefined && this.state.shows.has(this.state.show)){  
            const selectedShow = this.state.shows.get(this.state.show)
        
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


