import {Bodies, Engine, Render, Runner, World} from 'matter-js'
import {FRUITS_BASE} from './fruits.js'

const engine = Engine.create()
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false,
        background: '#f7f4c8',
        width: 620,
        height: 850,
    }
})

const world = engine.world
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#e6b143" }
})

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#e6b143" }
})

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: '#e6b143'}
})

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isSensor: true,
    isStatic: true,
    render: { fillStyle: '#e6b143'}
})

World.add(world, [leftWall, rightWall, ground, topLine])

Render.run(render)
Runner.run(engine)

function AddFruit() {
    const index = Math.floor(Math.random() * 5)
    const fruit = FRUITS_BASE[index]

    console.log(fruit.color)

    const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,
        render: {
            fillStyle: `${fruit.color}`
        },
        restitution: 0.2
    })
    World.add(world, body);
}

AddFruit()