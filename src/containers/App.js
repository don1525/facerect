import React, {Component} from 'react';
import './App.css';
import Navigation from '../components/Navigation.js';
import Logo from '../components/Logo.js';
import Rank from '../components/Rank.js';
import ImageLinkForm from '../components/ImageLinkForm.js';
import FaceRecognition from '../components/FaceRecognition.js';
import Particles from 'react-tsparticles';
import Signin from '../components/Signin.js';
import Register from '../components/Register.js';

const particlesParams =  {
  background: {
    color: {
      value: "#0dd5d1",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 50,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 75,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

  const particlesInit = (main) => {
    //console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  };

  const particlesLoaded = (container) => {
    //console.log(container);
  };

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signIn',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }

class App extends Component {
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0]
          .data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    }
  }

  displayFaceBox = (box) => {
    this.setState({boxes: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://face-finder-1525-server.herokuapp.com/clarifaiApi', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        image: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://face-finder-1525-server.herokuapp.com/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'id': this.state.user.id
                })
              })
        .then(response => response.json())
        .then(count => {
          const copy={...this.state.user};
          copy.entries=count;
          this.setState({user: copy});
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
  }

  onRouteChange = (route) => {
    switch (route) {
      case 'signIn':
        this.setState(initialState);
        console.log('routed');
        break;
      case 'register':
        this.setState(initialState);
        break;
      case 'home':
        this.setState({isSignedIn: true});
        break;
      default:
    }
     this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  render(){
    return (
      <div className="App">
        <Particles 
          className="particles"
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded} 
          params = {particlesParams}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
          {this.state.route === 'signIn' ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          : this.state.route === 'register' ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          : <div>
              <Logo />
              <Rank userName={this.state.user.name} userEntries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit}/>
              <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes}/>
            </div>
        }   
      </div>
    );
    }
}

export default App;
