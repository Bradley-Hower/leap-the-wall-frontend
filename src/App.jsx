import React from 'react';
import './App.css'
import axios from 'axios';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ErrorAlert from './component/ErrorAlert';
import SearchForm from './component/SearchForm';
import Results from './component/Results';
import Explorer from './component/Explorer';
import History from './History'
import LoginButton from './Login';
import LogoutButton from './Logout';
import { withAuth0 } from '@auth0/auth0-react';
import { Navbar, NavItem } from 'react-bootstrap';
import Username from './Username';

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
      searches: [],
      pn: 0,
    }
  }
  
  async componentDidMount(){
    this.getSearches();
  }
  
  getToken = () => {
    return this.props.auth0.getIdTokenClaims()
      .then(res => res.__raw)
      .catch(err => console.error(err))
  }

  getSearches = async () => {
    try {
      const jwt = await this.getToken();
      const config = {
        headers: {'Authorization': `Bearer ${jwt}`}
      }
      const searchData = await axios(`${import.meta.env.VITE_SERVER}/searches`, config);
      this.setState({ searches: searchData.data});
    }
    catch (err) { console.error(err)}

  }

  postSearch = async (newSearch) => {
    try {
      const jwt = await this.getToken();
      const config = {
        headers: {'Authorization': `Bearer ${jwt}`}
      }
      const url = `${import.meta.env.VITE_SERVER}/searches`
      let createdSearch = await axios.post(url, newSearch, config)
      this.setState( {searches: [...this.state.searches, createdSearch.data]})
    }
    catch (err) { console.error(err)}
  }

  deleteSearch = (id) => {
    const url = `${import.meta.env.VITE_SERVER}/searches/${id}`
    axios.delete(url)
    const updatedSearches = this.state.searches.filter(search => search._id !== id);
    this.setState({searches: updatedSearches})
  }

  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm});
  }

  clearState = () => {
    this.setState({ searchResults: []});
    this.setState({historystate: false});
  }

  handleForm = (e) => {
    e.preventDefault();
    this.clearState();

    //search queryhistory
    console.log('searchResults');
    console.log(this.state.searchResults)
    if(this.state.historystate){
      console.log('hit');
      return true;
    }
    else{
      axios.post(`${import.meta.env.VITE_SERVER}/tquery?tranquery=${this.state.searchQuery}`)
        .then(response => {
          this.setState({ firstquery : response.data[0].query }, () => {
            console.log('firstquery Results Set:', this.state.firstquery);
            this.baiduhandoff();
          });
        })
        .catch(error => {
          this.setState({errorcode: error})
          this.setState({showForm: true})
        });
      }
    }
    baiduhandoff = () => {
      console.log('Awaiting Baidu');
      axios.get(`${import.meta.env.VITE_SERVER}/baidu?pn=${this.state.pn}&baiduquery=${this.state.firstquery}`)
      .then(response => {
        this.setState({ baiduresults: response.data.baidudata }, () => {
          console.log('Baidu Results Set:', this.state.baiduresults);
          this.finalthandoff();
        });
      })
      .catch(error => {
        this.setState({errorcode: error});
        this.setState({showForm: true});
      })
  }

  finalthandoff = async () => {
    console.log('Awaiting Final Translation');
    const thearray = [];
    for(let i=0; i<30; i++){

      const itemarray = []
      if(this.state.baiduresults.organic_results[i] === undefined){continue}
      await axios.post(`${import.meta.env.VITE_SERVER}/tfinal?pn=${this.state.pn}&qs=${this.state.baiduresults.organic_results[i].title}`)
        .then(response => {
          itemarray.push(response.data[0].finaljson)
        }).catch(error => {
          this.setState({errorcode: error});
          this.setState({showForm: true});
        })
      await axios.post(`${import.meta.env.VITE_SERVER}/tfinal?qs=${this.state.baiduresults.organic_results[i].snippet}`)
      .then(response => {
        itemarray.push(response.data[0].finaljson)
      }).catch(error => {
        this.setState({errorcode: error});
        this.setState({showForm: true});
      })
      itemarray.push(this.state.baiduresults.organic_results[i].link)
      itemarray.push(this.state.baiduresults.organic_results[i].thumbnail)
      thearray.push(itemarray);
  
      this.setState({searchResults: [...this.state.searchResults, thearray]});
      this.setState({queryhistory: [...this.state.queryhistory, thearray]});
    }
    if(this.props.auth0.user.email){
    this.postSearch({
      email: this.props.auth0.user.email,
      timestamp: new Date(),
      query: this.state.searchQuery,
      data: thearray,
    })}
  }

  handleChange = (e) => {
    this.setState({ searchQuery : e.target.value })
  }

  setpageNumber = (e) => {
    this.setState({ pn : (e.target.value) *30+30 })
  }
  
  render(){
  return (
      <>
        <BrowserRouter>
        <div class="formholder">
        <SearchForm handleform={this.handleForm} handlechange={this.handleChange} setpageNumber={this.setpageNumber}/>

        <Routes>
        <Route path='/' element={<></>} />
          <Route exact path='/search' element={
            <>
              <Explorer searchQuery={this.state.searchQuery} clearState={this.state.clearState}/>

            </>
          }/>
        </Routes>

        <div class="bigblock">
        <Navbar collapseOnSelect expand="lg" >
        <NavItem>{this.props.auth0.isAuthenticated ? <div><Username /></div> : <p></p>}</NavItem>
        <NavItem>{this.props.auth0.isAuthenticated ? <LogoutButton/> : <LoginButton/>}</NavItem>
        </Navbar>
          <h4>History</h4>
          {this.state.searches.length > 0 ? (
            <History searches={this.state.searches} deleteSearch={this.deleteSearch}/>
          ) : (
            <p>No searches yet.</p>
          )}
        </div>

        </div>
        </BrowserRouter>

        <div class='rendered'> 
        {this.state.searchResults.length > 0 && 
        <Results searchResults={this.state.searchResults} getSearches={this.getSearches}/>
        }
        </div>

        <ErrorAlert showForm={this.state.showForm} toggleForm={this.state.toggleForm} errorcode={this.state.errorcode}/>
      </>
    )
  }
}

export default withAuth0(App)
