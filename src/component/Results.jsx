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
      {this.props.searchResults.map((element, idx) => (
        <Col key={idx}>



          <ResultsItem title={element[idx][0]} snippet={element[idx][1]} link={element[idx][2]} thumbnail={element[idx][3]}
          // link={element.link} thumbnial={element.thumbnial} snippet={element.snippet}
          />


        </Col>
      ))}
      </>
    )
  }

}

export default Results;