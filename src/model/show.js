export default class Show {
    constructor(name, venue, description, seats, date, confirmed, reservationId){
        this.name = name;
        this.venue = venue;
        this.description =  description;
        this.seats = seats;
        this.date = date;
        this.confirmed = confirmed;
        this.reservationId = reservationId;
    }
}