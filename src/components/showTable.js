import React from 'react'
import { Table, Button } from 'semantic-ui-react'
import Client from '../utils/restClient';

const client = new Client();

const ShowTable = (props) => (
  <Table celled color='teal' textAlign='center'>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Show</Table.HeaderCell>
        <Table.HeaderCell>Show time</Table.HeaderCell>
        <Table.HeaderCell>Reservation Confirmed?</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {generateRows(props)}
    </Table.Body>
  </Table>
)

const generateRows = (props) => {
    return props.shows.map((show, index) =>
        <Table.Row key={index}>
            <Table.Cell>{show.name}</Table.Cell>
            <Table.Cell>{formatShowTime(show.date)}</Table.Cell>
            {
                show.confirmed ? 
                <Table.Cell positive>Confirmed</Table.Cell>
                :
                <Table.Cell warning selectable>
                  <Button fluid basic onClick={handleClick(show, props)}>Click to Confirm</Button>                
                </Table.Cell>
            }
        </Table.Row>
    )
}

const handleClick = (show, props) => () => {

  client.confirmReservation(show.reservationId, props.customerId, props.updater)

}

const formatShowTime = (date) => {
  
  return `${date.toDateString()} at ${date.toLocaleTimeString()}`
}

export default ShowTable