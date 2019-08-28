import React from 'react'

export default function Button(props) {
    const defaultStyle  = {
        backgroung: '#ccc',
        lineHeight: '2em',
        borderRadius: '4px',
        border: 'none',
        fontSize: '18px',
        padding: '0 2em',
    };

    const style = Object.assign({},defaultStyle,props.style)

    return <button style={style} {...props}>{props.children}</button>
}
