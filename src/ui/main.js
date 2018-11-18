import React, {Component} from 'react';
import LoginForm from '../components/loginForm';
import TabLayout from '../components/tab';
import GridLayout from '../components/grid';

export default class main extends Component {
    state =  {
        loggedIn : false
    }

    genericUpdate = (valuePairList) => {
        let newState = {...this.state};
        valuePairList.forEach(pair => {
            newState[pair.name] = pair.value;
        });
        console.debug("NEW STATE =>", newState);

        this.setState({...newState});
    }

    render(){
        return(
            !this.state.loggedIn ? 
            <LoginForm updater={this.genericUpdate}/>
            :
            <GridLayout>
                <TabLayout 
                    shows={this.state.reservations} 
                    customerId={this.state.customerId}
                    updater={this.genericUpdate}
                />
            </GridLayout>
        )
    }
}