import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max :55 }} style={{ height: 150, width: 150 }}>
                <div className="Tilt-inner pa2"> 
                    <img src='images/icons8-brain-64.png' alt='brain logo' height={"125"} width={"125"}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;