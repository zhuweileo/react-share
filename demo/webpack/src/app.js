import React from 'react'
import {hot} from 'react-hot-loader'

import RippleDemo from './ripple/RippleDemo'
import ButtonDemo from './button/ButtonDemo'

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <RippleDemo/>
        <ButtonDemo/>
      </div>

    )
  }
}

export default hot(module)(App)
