import React from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

class ErrorAlert extends React.Component{
  constructor(){
    super();
  }

  render(){
    return(
      <>
        <Modal show={this.props.showForm} onHide={this.props.toggleForm} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Connectivitiy Error: {this.props.errorcode ? this.props.errorcode.code : 'No error detected'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.errorcode ? this.props.errorcode.message : 'No error detected'}. {"\n"}{"\n"}
          {this.props.errorcode ? this.props.errorcode.response.data.error : 'No error detected'}.</Modal.Body>
        </Modal>
      </>
    )
  }
}

export default ErrorAlert;