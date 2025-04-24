import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classes from './Card.module.css';
import Button from '../../../compenents/Button/Button';

import CodeIcon from '@mui/icons-material/Code';

const Card = props => {
    const { question, solved } = props;
    
    // Get the current theme mode from Redux store
    const isDarkMode = useSelector(state => state.theme?.darkMode);
    
    // Apply theme variables to document root on theme change
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            // Dark theme variables
            root.style.setProperty('--card-text-color', '#e4e4e4');
            root.style.setProperty('--card-border-color', 'rgba(200, 200, 200, 0.15)');
            root.style.setProperty('--card-mid-text-color', '#a0a0a0');
            root.style.setProperty('--card-question-name-color', '#ffffff');
            root.style.setProperty('--card-success-color', '#a0a0a0');
        } else {
            // Light theme variables
            root.style.setProperty('--card-text-color', 'black');
            root.style.setProperty('--card-border-color', 'rgba(34, 36, 38, .15)');
            root.style.setProperty('--card-mid-text-color', 'inherit');
            root.style.setProperty('--card-question-name-color', 'inherit');
            root.style.setProperty('--card-success-color', 'inherit');
        }
    }, [isDarkMode]);

    return (
        <div className={classes.Card}>
            <div className={classes.left}>
                <div className={classes.questionName}>
                    {question.name}
                </div>
            </div>
            <div className={classes.mid}>
                <div className={classes.level} diff-color={question.difficulty}>{question.difficulty}</div>
                <div className={classes.succ}>{question.noOfSuccess === 0 ? 0 : ((question.noOfSuccess / question.noOfSubm * 100).toFixed(2))}% Success</div>
            </div>
            <div className={classes.right}>
                <Button to={`/questions/${question._id}`} color={solved ? 'grey' : 'blue'}>
                    {solved ? "Solved" : "Solve"}
                    <CodeIcon fontSize='large' style={{ marginLeft: '0.5em' }} />
                </Button>
            </div>
        </div>
    );
};

export default Card;