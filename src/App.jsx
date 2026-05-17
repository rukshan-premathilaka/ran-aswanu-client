import './App.css'
import {useState} from "react";
import axios from 'axios'

function App() {

  const [userdata, setUserData] = useState()

  const testApi = () => {
    axios.get('http://localhost:8080/user')
        .then(response => {
          console.log(response)
          setUserData(response.data)
        })
        .catch(error => {
          console.error("There was an error fetching the data!", error)
        })
  }


  return (

    <div
        className="w-screen h-screen
        bg-lime-500
        flex flex-col items-center justify-center"
    >

      <header
          className="text-8xl text-lime-100 font-bold "
      >
        RUN ASWANNA CLIENT
      </header>
      <button
          className="p-5  bg-lime-50 text-lime-800 rounded-2xl font-medium cursor-pointer"
          onClick={() => {testApi()}}
      >API TEST</button>

      <div>
        {userdata ? (
            <div className="font-medium text-lime-700 text-center mt-5">
              <p>ID: {userdata.id}</p>
              <p>Name: {userdata.name}</p>
              <p>Email: {userdata.email}</p>
            </div>
        ) : (
            <p className="font-medium text-lime-700 mt-5">No data yet. Click the button!</p>
        )}
      </div>

    </div>

  )
}

export default App
