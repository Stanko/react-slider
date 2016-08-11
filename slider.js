// ES6 import
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

// ES6 class
class Slider extends Component {

  // constructor
  constructor (props) {
    super(props)
    this.state = {
      dragStart: 0,
      dragStartTime: new Date(),
      index: 0,
      lastIndex: 0,
      transition: false
    }
  }

  componentWillMount () {
    const { selected } = this.props

    this.setState({
      index: selected,
      lastIndex: selected
    })
  }

  componentWillReceiveProps (nextProps) {
    // always reset so slider with new, possibly less,
    // amount of items starts at 0
    this.goToSlide(nextProps.selected)
  }

  getDragX (event, isTouch) {
    return isTouch ?
      event.touches[0].pageX :
      event.pageX
  }

  handleDragStart (event, isTouch) {
    const x = this.getDragX(event, isTouch)

    this.setState({
      dragStart: x,
      dragStartTime: new Date(),
      transition: false,
      slideWidth: ReactDOM.findDOMNode(this.refs.slider).offsetWidth
    })
  }

  handleDragMove (event, isTouch) {
    const {
      dragStart,
      lastIndex,
      slideWidth
    } = this.state

    const x = this.getDragX(event, isTouch)
    const offset = dragStart - x
    const percentageOffset = offset / slideWidth
    const newIndex = lastIndex + percentageOffset
    const SCROLL_OFFSET_TO_STOP_SCROLL = 30

    // Stop scrolling if you slide more than 30 pixels
    if (Math.abs(offset) > SCROLL_OFFSET_TO_STOP_SCROLL) {
      event.stopPropagation()
      event.preventDefault()
    }

    this.setState({
      index: newIndex
    })
  }

  handleDragEnd () {
    const {
      children
    } = this.props
    const {
      dragStartTime,
      index,
      lastIndex
    } = this.state

    const timeElapsed = new Date().getTime() - dragStartTime.getTime()
    const offset = lastIndex - index
    const velocity = Math.round(offset / timeElapsed * 10000)

    let newIndex = Math.round(index)

    if (Math.abs(velocity) > 5) {
      newIndex = velocity < 0 ? lastIndex + 1 : lastIndex - 1
    }

    if (newIndex < 0) {
      newIndex = 0
    } else if (newIndex >= children.length) {
      newIndex = children.length - 1
    }

    this.setState({
      dragStart: 0,
      index: newIndex,
      lastIndex: newIndex,
      transition: true
    })
  }

  goToSlide (slideIndex, event) {
    let index = slideIndex
    const {
      children,
      loop
    } = this.props

    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (index < 0) {
      index = loop ? children.length - 1 : 0
    } else if (index >= children.length) {
      index = loop ? 0 : children.length - 1
    }

    this.setState({
      index: index,
      lastIndex: index,
      transition: true
    })
  }

  renderNav () {
    const { children } = this.props
    const { lastIndex } = this.state

    const nav = children.map((slide, i) => {
      const buttonClasses = i === lastIndex ? 'Slider-navButton Slider-navButton--active' : 'Slider-navButton'
      return (
        <button
          className={ buttonClasses }
          key={ i }
          onClick={ (event) => this.goToSlide(i, event) } />
      )
    })

    return (
      <div className='Slider-nav'>{ nav }</div>
    )
  }

  renderArrows () {
    const {
      children,
      loop,
      showNav
    } = this.props
    const { lastIndex } = this.state
    let arrowsClasses = showNav ? 'Slider-arrows' : 'Slider-arrows Slider-arrows--noNav'

    // if only 1 item then hide arrows
    if(children.length < 2) {
      arrowsClasses = arrowsClasses + ' hide'
    }
    return (
      <div className={ arrowsClasses }>
        { loop || lastIndex > 0 ?
          <button
            className='Slider-arrow Slider-arrow--left'
            onClick={ (event) => this.goToSlide(lastIndex - 1, event) } /> : null }
        { loop || lastIndex < children.length - 1 ?
          <button
            className='Slider-arrow Slider-arrow--right'
            onClick={ (event) => this.goToSlide(lastIndex + 1, event) } /> : null }
      </div>
    )
  }

  render () {
    const {
      children,
      showArrows,
      showNav
    } = this.props

    const {
      index,
      transition
    } = this.state


    const slidesStyles = {
      width: `${ 100 * children.length }%`,
      transform: `translateX(${ -1 * index * (100 / children.length) }%)`
    }
    const slidesClasses = transition ? 'Slider-slides Slider-slides--transition' : 'Slider-slides'

    return (
      <div className='Slider' ref='slider'>
        { showArrows ? this.renderArrows() : null }
        { showNav ? this.renderNav() : null }

        <div
          className='Slider-inner'
          onTouchStart={ (event) => this.handleDragStart(event, true) }
          onTouchMove={ (event) => this.handleDragMove(event, true) }
          onTouchEnd={ () => this.handleDragEnd(true) }>
          <div
            className={ slidesClasses }
            style={ slidesStyles }>
            { children }
          </div>
        </div>
      </div>
    )
  }

  // ES6 static props
  static propTypes = {
    children: PropTypes.array,
    loop: PropTypes.bool,
    selected: PropTypes.number,
    showArrows: PropTypes.bool,
    showNav: PropTypes.bool
  }
  
  // ES6 static props
  static defaultProps = {
    loop: false,
    selected: 0,
    showArrows: true,
    showNav: true
  }

}

export default Slider
