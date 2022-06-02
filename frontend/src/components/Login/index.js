import React,{ useState } from 'react'
import axios from 'axios';
import { baseUrl } from '../../creds';
import {Box, Button, TextField, Typography} from '@mui/material'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {useNavigate} from 'react-router-dom'
 
const SignInSchema = Yup.object().shape({
   email: Yup.string()
     .email('Invalid email')
     .required('Required'),
   password: Yup.string()
     .required('Required'),
 });

const Login = () => {
    const navigate = useNavigate();

    const login = async(values) => {
        await axios.post(baseUrl+`users/${values.email}/login`,{
            password: values.password
        }).then(res => {
            if(res.status === 200){
                localStorage.setItem('user', values.email);
                localStorage.setItem('')
                navigate('/');
            }
        }).catch(e => {
            console.log(e.message);
        })
    }

  return (
      <>
       <Box>
            <Typography> Signin </Typography>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={SignInSchema}
                onSubmit={values => {
                    // same shape as initial values
                    login(values);
                }}
            >
                {({values,erroes, touched, handleChange, handleBlur,handleSubmit, isSubmitting}) => {
                    return (<Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField 
                            id="email"
                            name='email'
                            type='email'
                            autoComplete='email'
                            value={values.email}
                            onChange={handleChange}
                        />
                        <TextField 
                            id="password"
                            name='password'
                            type='password'
                            autoComplete='password'
                            value={values.password}
                            onChange={handleChange}
                        />
                        <Button type='submit'> Signin </Button>
                    </Box>)
                }}
            </Formik>
       </Box>

      </>
  )
}

export default Login