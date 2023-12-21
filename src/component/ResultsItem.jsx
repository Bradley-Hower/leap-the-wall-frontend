import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, Image } from 'react-bootstrap';

class ResultsItem extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <section>
        <ListGroup style={{ width: '50rem', textAlign: 'left' }}>
        {/* {this.props.title} */}
          <ListGroup.Item>
          <a href={this.props.link}>{this.props.title}</a>
          </ListGroup.Item>
          <ListGroup.Item>{this.props.snippet}</ListGroup.Item>
          <ListGroup.Item><Image src={this.props.thumbnail} thumbnail /></ListGroup.Item>
        </ListGroup>
        <br />
      </section>
    )
  }

}

export default ResultsItem;