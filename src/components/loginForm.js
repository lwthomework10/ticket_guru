import React, {Component} from 'react';
import { Grid, Header, Message} from 'semantic-ui-react';
import Client from '../utils/restClient';
import AnimatedList from './list';

export default class LoginForm extends Component {
  state = {
    users: []
  }
  client = new Client()

  componentDidMount() {
    this.client.getUsers((data) => {
      this.setState({users : data})
    })
  }

  handleSelection = (email) => () => {
    const customer = this.state.users.find(user => user.email === email);
    if (customer !== undefined){
      this.client.getShows(customer.id, (data) => {
        this.props.updater([
          {name: 'loggedIn', value: true},
          {name: 'customerId', value: customer.id},
          {name: 'reservations', value: data}
        ])
      });
    }
  }

  render() {
    console.log(this.state.users)
    return (
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
            Choose yourself
            </Header>
            <AnimatedList items={this.state.users} handler={this.handleSelection}/>
            <Message>
              New to us? <a href='https://google.com'>Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}


