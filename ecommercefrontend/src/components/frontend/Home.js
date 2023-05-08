import React, {  } from 'react'

function Home() {
  var userdetails = JSON.parse(localStorage.getItem('userdetails'));
  return (
    <div>User loggwed in:{userdetails.name}
    </div>
  )
}

export default Home