import React from 'react';
import './App.css'
import { Button, Container, ListGroup } from 'react-bootstrap';

class History extends React.Component{
  constructor(props){
    super(props);
    }

  handleDelete = (_id) => this.props.deleteSearch(_id);
  
  render(){
    return (
        <>
        <Container>

            {this.props.searches.length > 0 && this.props.searches.map((search) =>  
                <ListGroup key={search._id} style={{ textAlign: 'left' }}>
                <p><b>{search.query}</b></p>
                <p>{search.timestamp}</p>
                <Button variant="danger" onClick={() => this.handleDelete(search._id)}>🗑️</Button>
              </ListGroup>
            )}


        </Container>

        </>
    )
    }

}

export default History;
