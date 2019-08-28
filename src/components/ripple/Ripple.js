import React from "react";
import PropTypes from 'prop-types'
import {debounce} from "../../shared/util";
import './Ripple.scss'

export default class Ripple extends React.Component {
  constructor(props){
    super(props)
    this.addRipple = this.addRipple.bind(this)
    this.clearRipples = this.clearRipples.bind(this)
    this.rippleBox = React.createRef()
    this.rippleCon = React.createRef()
  }

  addRipple(e){
    e.persist()
    const {color,isCenter} = this.props
    const el = this.rippleBox.current;
    const {width,height,left,top} = el.getBoundingClientRect()
    console.log(el.getBoundingClientRect())
    const size = Math.max(width,height);
    const {clientX,clientY} = e

    const ripple = document.createElement('div')
    ripple.classList.add('zw-ripple-circle')
    ripple.style.backgroundColor = color;
    ripple.style.width = ripple.style.height = size + 'px';
    if(isCenter){
      ripple.style.left = width/2 - size/2 + 'px'
      ripple.style.top = height/2 -size/2 + 'px'
    } else {
      ripple.style.left = clientX - left - size/2 + 'px'
      ripple.style.top = clientY - top - size/2 + 'px'
    }
    this.rippleCon.current.appendChild(ripple);
  }

  clearRipples(e){
    console.log(e)
    const el = this.rippleCon.current
    while (el.firstChild){
      el.removeChild(el.firstChild)
    }
  }

  render() {
    return (
      <div className="zw-ripple-box"
           onMouseDown={this.addRipple}
           onMouseUp={debounce(this.clearRipples,1000)}
           ref={this.rippleBox}>
        <div className="zw-ripple-con" ref={this.rippleCon}></div>
        {this.props.children}
      </div>
      )
  }


}

Ripple.propTypes = {
  //只能有一个子元素
  children: PropTypes.element.isRequired,
  color: PropTypes.string,
  isCenter: PropTypes.bool,
}
Ripple.defaultProps = {
  color: 'rgba(255,255,255,.6)',
  isCenter: false,
}
