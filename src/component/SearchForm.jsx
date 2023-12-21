import React from "react";
import { Button } from 'react-bootstrap';


class SearchForm extends React.Component {
  constructor(){
    super();
  }

  render(){
    return(
      <>
        <h3>Leap the Wall</h3>
        <form onSubmit={this.props.handleform}>
        <input placeholder='Type on...' type='text' name='transquery' onChange={this.props.handlechange}/>
        <input placeholder='Page Number' type="number" id="quantity" onChange={this.props.setpageNumber}/>
        <Button type='submit' variant='light'>
        🪁
        </Button>
        {/* {['radio'].map((type) => (
          <div key={`inline-${type}`} className="mb-3">
            <Form.Check
              inline
              label="Web"
              name="group1"
              type={type}
              id={`inline-${type}-1`}
            />
            <Form.Check
              inline
              label="News"
              name="group1"
              type={type}
              id={`inline-${type}-2`}
            />
          </div>
        ))} */}


        </form>
      </>
    )
  }
}

export default SearchForm;