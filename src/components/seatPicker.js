import React, {Component} from 'react';
import {Table, Checkbox, Grid, Select, Button} from 'semantic-ui-react';

export default class SeatPicker extends Component {
    state =  {
        levelOptions : [],
        seatTable : []
    }

    componentDidMount() {
        this.processLevels(this.props.levels)
    }

    render() {
        return(
            <Grid padded>
                <Grid.Row>
                    <Select placeholder='Choose a level' options={this.state.levelOptions} onChange={this.handleLevelSelect}/>
                </Grid.Row>
                <Grid.Row>
                    {this.renderSeatTable()}
                </Grid.Row>
                <Grid.Row>
                    <Button floated='right' primary>Confirm</Button>
                </Grid.Row>
            </Grid>
        )
    }

    renderSeatTable = () => {
        if (this.state.seatTable.length > 0){
            return(
                <Table definition>
                    <Table.Header>
                        <Table.Row>
                            {this.renderTableHeader(this.state.seatTable[0])}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderTableBody()}
                    </Table.Body>
                </Table>
            )
        }
    }

    renderTableBody = () => {
        const rows = this.state.seatTable.length
        const seats = this.state.seatTable[0].length
        const rowArray = [];
        for (let i = 0; i < rows; i++){
            const seatArray = [<Table.Cell key={0}>{i+1}</Table.Cell>]
            for (let j = 0; j < seats; j++){
                seatArray.push(
                    <Table.Cell key={j+1}>
                        <Checkbox
                            checked={this.state.seatTable[i][j]}
                            onChange={this.updateTable(i, j)}
                        />
                    </Table.Cell>
                )
            }
            rowArray.push(<Table.Row key={i+1}>{seatArray}</Table.Row>)
        }

        return rowArray;
    }

    updateTable = (targetRow, targetCol) => () =>{
        const newTable = this.state.seatTable.map((arr, row) => {
            if (targetRow !== row) {
                return arr;
            } else {
                const newArr = [...arr]
                newArr[targetCol] = !arr[targetCol]
                return newArr;
            }
        })

        this.setState({
            seatTable : newTable
        })
    }

    renderTableHeader = (seats) => {
        const cells = [<Table.HeaderCell key={0}/>]
        seats.forEach((_, idx) => cells.push(<Table.HeaderCell key={idx+1}>{idx+1}</Table.HeaderCell>))
        return cells;
    }

    handleLevelSelect = ((e, {value}) => {
        const level = this.state.levelMap.get(value);
        const rows = level.numRows;
        const seats = level.seatsPerRow;
        const table = [];

        for (let i = 0; i < rows; i++){
            table.push(new Array(seats).fill(false))
        }

        this.setState({
            level : value,
            seatTable : table
        })
    })

    processLevels = (levels) => {
        const levelMap = new Map();
        const levelOptions = [];

        levels.forEach( level => {
            levelMap.set(level.id, level);
            levelOptions.push({key: level.id, text: level.name, value: level.id})
        })

        this.setState({
            levelMap : levelMap,
            levelOptions : levelOptions,
            seatTable : []
        })
    }   

    
}