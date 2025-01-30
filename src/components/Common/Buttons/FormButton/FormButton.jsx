import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Grid2 } from '@mui/material';
import { borderColor, styled } from '@mui/system';

const strength = 20;

const MagneticBox = styled(Box)({
  display: 'inline-block',
  borderRadius: '50%',
  position: 'relative', // Allows for proper positioning inside the container
});

const MagnetButton = styled(Button)(({ theme }) => ({
  // backgroundColor: `var(--linear-gradient-main)`,
  color: `var(--linear-gradient-main)`,
  cursor: 'pointer',
  transition: '0.5s background-color, 0.5s box-shadow',
  borderColor: `var(--linear-gradient-main)`,

  '&:hover': {
    color: '#fff',
    backgroundColor: `var(--linear-gradient-main)`,
    boxShadow: `0px 2px 25px var(--linear-gradient-main)`,
    borderColor: `var(--linear-gradient-main)`,
  },


}));

const FormButton = ({ btnName, type, func, disabledCondition }) => {
  const handleMouseMove = (event, magnetButton) => {
    const bounding = magnetButton.getBoundingClientRect();
    const x = (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * strength;
    const y = (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * strength;
    magnetButton.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseOut = (magnetButton) => {
    magnetButton.style.transform = 'translate(0px, 0px)';
  };

  return (
    <Box display='flex' justifyContent='flex-end' >
      <Grid2 container justifyContent="center" alignItems="center">
        <Grid2 item>
          <MagneticBox
            className="magnetic"
            onMouseMove={(event) => handleMouseMove(event, event.currentTarget)}
            onMouseOut={(event) => handleMouseOut(event.currentTarget)}
          >
            <MagnetButton
              variant="outlined"
              className="magnet-button"
              type={type}
              onClick={func || ''}
              disabled={disabledCondition ? true : false}
            >
              {btnName}
            </MagnetButton>
          </MagneticBox>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default FormButton;
