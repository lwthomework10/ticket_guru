import React from 'react'
import { List } from 'semantic-ui-react'

const AnimatedList = (props) => (
  <List selection animated verticalAlign='middle'>
    {generateList(props)}
  </List>
)

const generateList = (props) => {
  return props.items.map((item, index) => {
    return(
      <List.Item key={index} onClick={props.handler(item.email)}>
        <List.Content>
          <List.Header>{`${item.firstName} ${item.lastName}`}</List.Header>
          {item.email}
        </List.Content>
      </List.Item>
    )
  })
}

export default AnimatedList