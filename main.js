import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js"
import { FRUITS_BASE } from "./fruits.js"

let engine = Engine.create()
let render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false,
        background: "#f7f4c8",
        width: 620,
        height: 850,
    },
})

let world = engine.world
let leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#e6b143" },
})

let rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#e6b143" },
})

let ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: "#e6b143" },
})

let topLine = Bodies.rectangle(310, 150, 620, 2, {
    name: "topLine",
    isSensor: true,
    isStatic: true,
    render: { fillStyle: "#e6b143" },
})

World.add(world, [leftWall, rightWall, ground, topLine])

Render.run(render)
Runner.run(engine)

let currentBody = null
let currentFruit = null
let disableAction

function AddFruit() {
    let index = Math.floor(Math.random() * 5)
    let fruit = FRUITS_BASE[index]

    console.log(fruit.color)

    let body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,
        render: {
            fillStyle: `${fruit.color}`,
        },
        restitution: 0.2,
    })

    currentBody = body
    currentFruit = fruit

    World.add(world, body)
}

window.onkeydown = (event) => {
    if (disableAction) {
        return
    }

    switch (event.code) {
        case "KeyA":
            if (currentBody.position.x - currentFruit.radius > 40) {
                Body.setPosition(currentBody, {
                    x: currentBody.position.x - 10,
                    y: currentBody.position.y,
                })
            }
            break
        case "KeyD":
            if (currentBody.position.x + currentFruit.radius < 580) {
                Body.setPosition(currentBody, {
                    x: currentBody.position.x + 10,
                    y: currentBody.position.y,
                })
            }
            break
        case "KeyS":
            currentBody.isSleeping = false
            disableAction = true

            setTimeout(()=>{
                AddFruit()
                disableAction = false
            }, 1000)

            break
    }
}

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {
            let index = collision.bodyA.index
            World.remove(world, [collision.bodyA, collision.bodyB])

            let newFruit = FRUITS_BASE[index+1]

            let newBody = Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    render: {fillStyle: `${newFruit.color}`},
                    index: index + 1
                }
            )

            World.add(world, newBody)

        }
        if ( !disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
            alert("GameOver")
        }
    })
})

AddFruit()
