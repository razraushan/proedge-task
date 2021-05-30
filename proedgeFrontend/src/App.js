import React from 'react';
import Table from './Table.js';
import Table2 from './Table2.js';



class App extends React.Component
{
    constructor(props) {
        super(props);

        this.state={apiResponse:"",
            tableData:[
                {'Roll Number':"",'Result':""}
            ]};
    }

    callAPI=()=>
    {
        this.setState({apiResponse:"Processing..."});

        let dataToSend={
            csv:this.refs.csv.value,

        };
        fetch("http://13.126.104.106:8000/receiveInput",{method:'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify(dataToSend)})
            .then(res=>res.text())
            .then(res=>this.setState({apiResponse:"",tableData:JSON.parse(res),dataSize:res.length}))
            .catch(console.log("Problem"));
    }
    render() {
        return(
          <div className="App">
            <header className="App-header">
            </header>
              <h1>Result Prediction</h1>
              <p>Please enter comma separated roll numbers.</p>

              <p>
                  <label>Enter Comma Separated Values : <input type="text"  ref="csv"></input></label>
              </p>

                  <div className="clearfix">
                      <button type="submit" name="submitBtn" onClick={this.callAPI}>Submit</button>
                  </div>
            <p>{this.state.apiResponse}</p>
            <Table data={((this.state.tableData))}/>
          </div>


        );
    }
}

export default App;