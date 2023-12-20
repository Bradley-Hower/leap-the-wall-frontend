import React from 'react';
import './App.css'
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import ErrorAlert from './component/ErrorAlert';
import SearchForm from './component/SearchForm';
import Results from './component/Results';
import Explorer from './component/Explorer';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchQuery: '',
      query: null,
      baiduresults: null,
      historystate: false,
      searchResults: [],
      firstquery: null,
      queryhistory: [],
      showForm: false,
      errorcode: null,
    }
  }
  
  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm});
  }

  clearState = () => {
    this.setState({ searchResults: []});
    this.setState({historystate: false});
  }

  searchqueryHistory = () => {
    console.log('queryhistory');
    console.log(this.state.queryhistory)
    this.state.queryhistory.filter((e) => {
      if(e.search_parameters.q.toUpperCase() === this.state.searchQuery.toUpperCase()){
        console.log('this actually works');
        this.setState({searchResults: [e]});
        this.setState({historystate: true})
      }
    })
  }

  handleForm = async (e) => {
    e.preventDefault();
    this.clearState();

    //search queryhistory
    await this.searchqueryHistory();
    console.log('searchResults');
    console.log(this.state.searchResults)
    if(this.state.historystate){
      console.log('hit');
      return true;
    }
    else{
      axios.post(`${import.meta.env.VITE_SERVER}/tquery?tranquery=${this.state.searchQuery}`)
        .then(response => {
          this.setState({ firstquery : response.data[0].query })
          console.log(response.data[0].query);
          this.baiduhandoff()
        })
        .then(this.finalthandoff())
        .catch(error => {
          // console.log('Connection not quite right', error.response.status);
          this.setState({errorcode: error})
          this.setState({showForm: true})
        });
    }
  }
  baiduhandoff = () => {
    console.log('Awaiting Baidu');
    axios.get(`${import.meta.env.VITE_SERVER}/baidu?baiduquery=${this.state.firstquery}`)
      .then(response => {
        console.log(response.data);
        this.setState({baiduresults: [response.data]});
      }).catch(error => {
        // console.log('Connection not quite right', error.response.status);
        this.setState({errorcode: error});
        this.setState({showForm: true});
      })
  }

  finalthandoff = () => {
    console.log('Awaiting Final Translation');
    axios.post(`${import.meta.env.VITE_SERVER}/tfinal?qs=${this.state.baiduresults}`)
      .then(response => {
        console.log(response.data)
        const fixed_keys2 = JSON.parse(response.data)
        console.log('fixed_keys2')
        console.log(fixed_keys2);

        this.setState({searchResults: [fixed_keys2]});
        this.setState({queryhistory: [...this.state.queryhistory, fixed_keys2]});
      }).catch(error => {
        // console.log('Connection not quite right', error.response.status);
        this.setState({errorcode: error});
        this.setState({showForm: true});
      })
  }

  handleChange = (e) => {
    this.setState({ searchQuery : e.target.value });
  }

  render(){
  return (
      <>
        <BrowserRouter>
        <div class="formholder">
        <SearchForm handleform={this.handleForm} handlechange={this.handleChange}/>

        {this.state.firstquery && <Navigate to='/search' />}
        <Routes>
          <Route exact path='/search' element={
            <>
              <Explorer searchQuery={this.state.searchQuery} clearState={this.state.clearState}/>

            </>
          }/>
          <Route path='/' element={<></>} />
        </Routes>
        <div class="bigblock"></div>
        </div>
        </BrowserRouter>
        <div class='rendered'> 
        {this.state.searchResults.length > 0 && 
        <Results searchResults={this.state.searchResults}/>
        }
        </div>
        <ErrorAlert showForm={this.state.showForm} toggleForm={this.state.toggleForm} errorcode={this.state.errorcode}/>
      </>
    )
  }
}

export default App
