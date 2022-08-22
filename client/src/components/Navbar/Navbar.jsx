import React, {useState, useEffect} from 'react'
import { AppBar, Avatar, Toolbar, Typography, Button } from "@material-ui/core"
import { Link,useHistory, useLocation  } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import decode from 'jwt-decode'

import useStyles from './styles'
import memoriesText from '../../images/memories-Text.png'
import memoriesLogo from '../../images/memories-Logo.png'




const Navbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/auth')
        setUser(null);
        
    }

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token)

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')))
        
    }, [location])

    console.log({user: user})

    return (      
        <AppBar position='static' color='inherit' className={classes.appBar}>
            <Link to='/' className={classes.brandContainer}>
                <img className={classes.image} src={memoriesLogo} alt="memories" height='40' />
                <img className={classes.image} src={memoriesText} alt="memories" height='45' />
            </Link>
            <Toolbar className={classes.toolBar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purpel} alt={user.result.name} src={user.result.imageUrl}>
                            {user.result.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.userName} variant='h6'>
                            {user.result.name}
                        </Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Log Out</Button>
                        
                    </div>

                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">
                        Sign In
                    </Button> 
                )
                } 
                
                
            </Toolbar>
        </AppBar>
    )
    
}

export default Navbar