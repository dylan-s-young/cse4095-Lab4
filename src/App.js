import React, { useState } from 'react';
import UserForm from './userForm';

function App() {
  const [data, setData] = useState([]);


  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5001/select');
      const result = await response.json();
      console.log(result)
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const clearData = async () => {
    setData([])
  }

  return (
    <div>
      <h1>Person's database</h1>
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={clearData}>Clear Data</button>
      <ul>
        {data.map(item => (

          <li key={item.Name}>

            <p>Name: {item.Name}, ID: {item.id}, Address: {item.address},</p>
          </li>
        ))}
      </ul>
      <UserForm />
    </div>
  );
}

export default App;
