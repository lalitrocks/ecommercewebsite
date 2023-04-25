import React from 'react'
import swal from 'sweetalert';

function Verifyemail() {
  function xsrftoken() {
    var allCookie = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < allCookie.length; i++) {
      var singleCookie = allCookie[i];
      if (singleCookie.match('XSRF-TOKEN')) {
        return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);

      }

    }
  }
  const handler = async() => {
    await fetch(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`, { credentials: 'include' })
    await fetch(`${process.env.REACT_APP_API_URL}/email/verification-notify`, {
      method: "POST",
    
      headers: {
        "Accept": "application/json",

        "Content-Type": "application/json",
        "X-XSRF-TOKEN": xsrftoken()
      },
      credentials: 'include'
    }).then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          swal("success", res.msg);
        } else if (res.status === 400) {
          swal("Error", res.msg);
        }

      })
  }
  return (
    <div>Verifyemail
      <button onClick={() => handler()}>send verification link</button>
    </div>
  )
}

export default Verifyemail