import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Button from "../src/components/button/Button";

describe('Button.js',function() {
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

    it('can receive child',function() {
        act(() => {
            function App(){
                return <Button>按钮</Button>;
            }
            render(<App/>,container)
        })
        // console.log(container);
        expect(container).to.contain.html('按钮')
    })

    it('can click',function () {
        const clickCb = sinon.spy();
        act(() => {
            function App(){
                return <Button id='test-button' onClick={clickCb}>按钮</Button>;
            }
            render(<App/>,container)
        });

        const button = document.querySelector('button');

        act(() => {
            button.dispatchEvent(new MouseEvent("click",{bubbles: true}))
        })

        sinon.assert.calledWith(clickCb)
    })
})
