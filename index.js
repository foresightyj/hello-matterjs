//@ts-check
const { Engine, Render, Runner, MouseConstraint, Mouse, Composite, Bodies } = Matter

/**
 * @param {number} n 
 */
function range(n) {
    /**@type {number[]} */
    const res = [];
    for (let i = 0; i < n; i++) {
        res.push(i);
    }
    return res;
}

function airFriction() {
    // create engine
    const engine = Engine.create();
    const world = engine.world;
    const WIDTH = 800;
    const HEIGHT = 600;

    // create renderer
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT,
            showVelocity: true
        }
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    Composite.add(world, [
        // falling blocks
        Bodies.circle(40, 0, 40),
        ...range(10).map(i => i + 1).map(i => Bodies.rectangle(i * 80, 500, 20, 200)),
        // walls
        Bodies.rectangle(400, HEIGHT, WIDTH, 1, { isStatic: true }),
    ]);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: WIDTH, y: HEIGHT }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

airFriction()