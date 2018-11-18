import React from 'react'
import { Tab } from 'semantic-ui-react'
import ShowTable from '../components/showTable';
import ShowSearch from '../components/showSearch';

const getPanes = (props) => {
    return ([
        { menuItem: 'My Shows', render: () => <Tab.Pane><ShowTable shows={props.shows}/></Tab.Pane> },
        { menuItem: 'Find a new Show', render: () => <Tab.Pane><ShowSearch/></Tab.Pane> }
    ])
} 

const Tabs = (props) => <Tab panes={getPanes(props)} />

export default Tabs