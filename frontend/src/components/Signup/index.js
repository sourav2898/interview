import React, { useState } from 'react'
import axios from 'axios';
import { baseUrl } from '../../creds';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [userInfo, setUserInfo] = useState({
        fn:'',
        ln:'',
        email:'',
        pwd:''
    });

    const navigate = useNavigate();
    
    const signup = async() => {
        await axios.post(baseUrl+`signup`,{
            userInfo
        }).then(res => {
            if(res?.data?.result === 'registration successful!'){
                navigate('/login');
            }
        })
        .catch(e => {
            console.log(e.message);
        })
    }

  return (
    <div> 
            <p> Sign up </p> 

            <input type='text' value={userInfo?.fn || ''} placeholder='firstname' onChange={(e) => setUserInfo({...userInfo, fn:e.target.value})}/>
            <input type='text' value={userInfo?.ln || ''} placeholder='lastname' onChange={(e) => setUserInfo({...userInfo,ln: e.target.value})}/>
            <input type='email' value={userInfo?.email || ''} placeholder='email' onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}/>
            <input type='password' value={userInfo?.pwd || ''} placeholder='password' onChange={(e) => setUserInfo({...userInfo, pwd: e.target.value})}/>
            <button onClick={signup}> SignUp </button>
       </div>
  )
}

export default Signup