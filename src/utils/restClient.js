import axios from 'axios/index';
import Show from '../model/show';
import Seat from '../model/seat';
import Venue from '../model/venue';
axios.defaults.baseURL = 'http://ec2-54-159-33-6.compute-1.amazonaws.com:5005/ticket-guru/api';

export default class Client {
    
    getUsers = (updater) => {
        axios.get('/customers')
        .then(response => updater(response.data))
    }

    getShows = (customerId,  updater) => {
        axios.get(`/reservations?customerId=${customerId}&include=seats`)
        .then(response => {
            
            const dataArray = response.data.filter(reservation => reservation.seats.length > 0).map(reservation => {
                return {
                    reservationId : reservation.id,
                    performanceId : reservation.seats[0].performanceId,
                    seats : reservation.seats,
                    confirmed : reservation.reservationConfirmed
                }
            })

            const seats = dataArray.flatMap(data => data.seats)
            const performancesIds = [...new Set(seats.map(seat => seat.performanceId))]
            
            let promises = performancesIds.map(id => {
                return axios.get(`/performances/${id}?include=show`)
                .then(response => {
                    const performances = dataArray.filter(data => data.performanceId === id)
                    console.log('perfs -> ', performances)
                    performances.forEach(performance => {
                        performance.name = response.data.show.name;
                        performance.description = response.data.show.description;
                        performance.time = response.data.showTime; 
                        performance.venueId = response.data.show.venueId;
                    });
                })
            })
            axios.all(promises).then(_ => { 
                console.log('results', dataArray)
                const levelIds = [...new Set(seats.map(seat => seat.levelId))]
                promises = levelIds.map(id => axios.get(`/levels/${id}?include=venue`))
                axios.all(promises).then(
                    axios.spread((...args) => {
                        const levels = args.map(response => response.data)
                        dataArray.flatMap(data => data.seats).forEach(seat => {
                            seat.level = levels.find(level => level.id === seat.levelId).name;
                        })
                    })
                ).then(_ => {
                    promises = dataArray.map(data => axios.get(`/venues/${data.venueId}`).then(response => {
                        data.venue = new Venue(response.data.name, response.data.address)
                    }));
                    axios.all(promises).then(_ => {
                        const result = dataArray.map(data => new Show(
                            data.name,
                            data.venue,
                            data.description,
                            data.seats.map(seat => new Seat(seat.seatNumber, seat.row, seat.level)),
                            new Date(data.time),
                            data.confirmed,
                            data.reservationId
                        )).sort((a,b) => a.date.getTime() - b.date.getTime()) // could filter past shows here

                        updater(result);
                    })
                })
            })
        })
    }

    confirmReservation = (id, customerId, updater) => {
        axios.put(`/reservations/${id}/confirm`)
        .then(_ => {
            this.getShows(customerId, (data) => {
                updater([
                    {name: 'reservations', value: data}
                ])
            })
        })
        .catch(error => console.error('Confirmation failed', error.message)) // todo: implement error message
    }

    getVenuesAndShows = (updater) => {
        axios.get('/shows?include=venue').then(response => {
            updater(response.data)
        })
        .catch(error => console.error('Error fetching venues', error.message))
    }

    getPerformancesByShow = (showId, updater) => {
        axios.get(`/shows/${showId}?include=performances`).then(response => {
            updater(response.data.performances)
        })
        .catch(error => console.error('Error fetching showtimes', error.message))
    }

    getLevelsByVenue = (venueId, updater) => {
        axios.get(`/venues/${venueId}?include=levels`).then(response => {
            updater(response.data.levels)
        })
        .catch(error => console.log('Error fetching venue info', error.message))
    }
}