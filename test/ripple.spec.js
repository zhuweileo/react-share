import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Ripple from "../src/components/ripple/Ripple";

describe('ripple.js',function() {
    let container = null;
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        // cleanup on exiting
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('can set isCenter prop',function() {
        act(() => {
            function App(){
                return <Ripple>
                    <button style={{
                        backgroung: '#ccc',
                        lineHeight: '2em',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '18px',
                        padding: '0 2em',
                    }}>click</button>
                </Ripple>;
            }
            render(<App/>,container)
        })
        // console.log(container);
        expect(container).to.contain.html('click</button>')
    })
})
