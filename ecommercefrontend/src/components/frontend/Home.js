import React, { useEffect } from 'react'
import swal from 'sweetalert';

function Home() {
  

  
  var userdetails = JSON.parse(localStorage.getItem('userdetails'));

  
 
  return (
    <div>User loggwed in:{userdetails.name}
    </div>
  )
}

export default Home