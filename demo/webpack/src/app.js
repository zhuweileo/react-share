import React from 'react'
import {hot} from 'react-hot-loader'

import RippleDemo from './ripple/RippleDemo'

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <RippleDemo/>
      </div>

    )
  }
}

export default hot(module)(App)
