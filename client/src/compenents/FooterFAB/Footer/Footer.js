import React from 'react'
import { GitHub, Instagram, LinkedIn, Mail } from '@mui/icons-material';
import { Box } from '@mui/material';
import classes from './Footer.module.css';

const Footer = () => {
    const clickHandler = (link) => {
        window.open(link, '_blank');
    }

    return (
        <footer className={classes.footer}>
            <Box className={classes.container}>
                <div className={classes.social}>
                    <GitHub 
                        className={classes.icon} 
                        onClick={() => clickHandler('https://github.com/Whizzion957/OJ')} 
                    />
                </div>
                <div className={classes.copyright}>
                    Made with ❤️ by Aadit, Ayushka, Daidipya, Devansh, Drishti and Rohan
                </div>
            </Box>
        </footer>
    )
}

export default Footer;
