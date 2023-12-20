import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';
import ResultsItem from './ResultsItem';

class Results extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <>
      <br />
      {this.props.baidudata.organic_results.map((element, idx) => (
        <Col key={idx}>


          <ResultsItem 
          title={element.title}
          link={element.link}
          snippet={element.snippet}
          thumbnail={element.thumbnail}
          // link={element.link} thumbnial={element.thumbnial} snippet={element.snippet}
          />


        </Col>
      ))}
      </>
    )
  }

}

export default Results;