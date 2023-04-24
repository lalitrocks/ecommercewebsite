import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Updateuser() {

    function xsrftoken() {
        var allCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < allCookie.length; i++) {
          var singleCookie = allCookie[i];
          if (singleCookie.match('XSRF-TOKEN')) {
            return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);
    
          }
    
        }
      }
const navigate = useNavigate();
      useEffect(() => {
        const func = async()=>{
        await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' })
        await fetch('http://localhost:8000/api/updateuser', {
            method: "GET",
            headers: {
                "Accept": "application/json",

                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem('userdetails', JSON.stringify(res.user));
                    
                    navigate('/');
                }

            })
        }
        func();
      }, [])
      
      
  return (
    <div>Updateuser</div>
  )
}

export default Updateuser