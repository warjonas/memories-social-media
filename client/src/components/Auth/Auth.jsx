import React, {useState, useEffect} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { useHistory } from 'react-router-dom'

import useStyles from './styles'
import Input from './Input'
import { signin, signup } from '../../actions/auth'

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const Auth = () => {

    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const history = useHistory();

    
    const handleShowPassword = () => setShowPassword((prevShowPassword)=> !prevShowPassword)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isSignup) {
            dispatch(signup(formData, history))
            
        } else {
            dispatch(signin(formData, history))
            
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })

    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
        handleShowPassword()
    }

    //Google sign in success
    const googleSuccess = async (res) => {

        const token = res?.credential
        const result = jwt_decode(token)

        try {
            dispatch({ type: 'AUTH', data: { result, token } })
            history.push('/')
            
        } catch (error) {
            console.log(error)
            
        }         
    }
    

    //setting up google sign in
    useEffect(() => {
      /* global google */
        google.accounts.id.initialize({
            client_id: '307684864377-stt1jghaquuut8ef30jbqbnfnp07rspn.apps.googleusercontent.com',
            callback: googleSuccess
        });

        google.accounts.id.renderButton(
            document.getElementById('googleSignIn'),
            {theme: "outline", size: 'large'}
        )

    }, [])
        


  return (
      <Container component="main" maxWidth='xs'>
          <Paper className={classes.paper} elevation={3}>
              <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
              </Avatar>
              <Typography variant='h5'>
                  {
                      isSignup ? 'Sign Up' : 'Sign In'
                  }                 
                  
              </Typography>
              <form className={classes.form} onSubmit={handleSubmit} action="">
                  <Grid container spacing={2}>
                      {
                          isSignup && (
                              <>
                                     <Input name='firstName' label="First Name" handleChange={handleChange} autoFocus half />

                                    <Input name='lastName' label="Last Name" handleChange={handleChange} half/> 
   
                              </>
                          )
                      }
                      <Input name='email' label='Email Address' handleChange={handleChange} type='email' />

                      <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />

                      {
                          isSignup && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />
                      }

                  </Grid>   
                  
                  <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                      {
                          isSignup ? "Sign Up" : "Sign In"
                      }
                  </Button>
                  <div className={classes.googleButton} style={{width:'100%'}} id='googleSignIn'>
                      
                  </div>
                  <Grid container justify='flex-end'>
                      <Grid item>
                          <Button onClick={switchMode}>
                              {
                                  isSignup ? 'Already have an account? Sign in' : 'Dont have an account? Sign up'
                              }
                          </Button>
                      </Grid>                      
                  </Grid>
              </form>
          </Paper>
      </Container>
  )
}

export default Auth