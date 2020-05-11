import React, { Component } from 'react';
// import '../styles/css/bootstrap-datetimepicker.min.css';
// import '../styles/css/bootstrap.min.css';
// import '../styles/css/font-awesome.min.css';
// import '../styles/css/select2.min.css';
// import '../styles/img/favicon.ico';
import axios from 'axios';

class App extends Component {
    constructor (props){
        super(props);
        this.state = {
            name: '',
        }
    }

  handleChange = event => {
    this.setState({ name: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    // const user = {
    //   name: this.state.name
    // };

    // axios.post(`https://jsonplaceholder.typicode.com/users`, { user })
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   })

      const payload = {
        nodeCount: "2",
        clusterName: "InfosysMay08-Cluster-1"
      }
axios.post(`http://104.211.206.68:8080/api/v1/createClusterAsync`, { payload })
      .then(res => {
        console.log(res);
        console.log(res.data);
      }).catch((e) => {
console.log('errorrrr', e);
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Person Name:
            <input type="text" name="name" onChange={this.handleChange} />
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
    )
  }
}

export default App;