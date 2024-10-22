let canvas, ctx;
let player, enemies, goal, walls;
let currentLevel = 0;
let keys = {};

const levels = [
    {
        walls: [
            { x: 100, y: 50, width: 600, height: 20 },
            { x: 100, y: 300, width: 600, height: 20 }
        ],
        enemies: [
            { x: 150, y: 150, radius: 15, dx: 2, dy: 0 },
            { x: 450, y: 200, radius: 15, dx: -2, dy: 0 }
        ],
        goal: { x: 750, y: 175, radius: 20 }
    },
    {
        walls: [
            { x: 50, y: 100, width: 700, height: 20 },
            { x: 50, y: 250, width: 700, height: 20 },
            { x: 300, y: 175, width: 20, height: 150 }
        ],
        enemies: [
            { x: 200, y: 130, radius: 15, dx: 0, dy: 2 },
            { x: 600, y: 220, radius: 15, dx: 0, dy: -2 }
        ],
        goal: { x: 50, y: 50, radius: 20 }
    },
    {
        walls: [
            { x: 100, y: 100, width: 600, height: 20 },
            { x: 100, y: 250, width: 600, height: 20 }
        ],
        enemies: [
            { x: 150, y: 150, radius: 15, dx: 3, dy: 0 },
            { x: 650, y: 200, radius: 15, dx: -3, dy: 0 }
        ],
        goal: { x: 750, y: 75, radius: 20 }
    },
    {
        walls: [
            { x: 150, y: 50, width: 500, height: 20 },
            { x: 150, y: 300, width: 500, height: 20 }
        ],
        enemies: [
            { x: 400, y: 100, radius: 15, dx: 0, dy: 3 },
            { x: 200, y: 200, radius: 15, dx: 0, dy: -3 }
        ],
        goal: { x: 750, y: 350, radius: 20 }
    },
    {
        walls: [
            { x: 50, y: 150, width: 700, height: 20 },
            { x: 300, y: 50, width: 20, height: 300 }
        ],
        enemies: [
            { x: 100, y: 50, radius: 15, dx: 2, dy: 2 },
            { x: 700, y: 300, radius: 15, dx: -2, dy: -2 }
        ],
        goal: { x: 50, y: 350, radius: 20 }
    },
    {
        walls: [
            { x: 100, y: 100, width: 600, height: 20 },
            { x: 200, y: 200, width: 400, height: 20 }
        ],
        enemies: [
            { x: 150, y: 150, radius: 15, dx: 4, dy: 0 },
            { x: 650, y: 250, radius: 15, dx: -4, dy: 0 }
        ],
        goal: { x: 400, y: 50, radius: 20 }
    },
    {
        walls: [
            { x: 50, y: 100, width: 700, height: 20 },
            { x: 50, y: 250, width: 700, height: 20 }
        ],
        enemies: [
            { x: 100, y: 150, radius: 15, dx: 0, dy: 3 },
            { x: 700, y: 200, radius: 15, dx: 0, dy: -3 }
        ],
        goal: { x: 750, y: 300, radius: 20 }
    },
    {
        walls: [
            { x: 150, y: 50, width: 500, height: 20 },
            { x: 150, y: 300, width: 500, height: 20 },
            { x: 400, y: 100, width: 20, height: 200 }
        ],
        enemies: [
            { x: 300, y: 150, radius: 15, dx: 2, dy: 2 },
            { x: 500, y: 250, radius: 15, dx: -2, dy: -2 }
        ],
        goal: { x: 50, y: 50, radius: 20 }
    },
    {
        walls: [
            { x: 50, y: 50, width: 700, height: 20 },
            { x: 50, y: 300, width: 700, height: 20 }
        ],
        enemies: [
            { x: 400, y: 75, radius: 15, dx: 3, dy: 3 },
            { x: 400, y: 325, radius: 15, dx: -3, dy: -3 }
        ],
        goal: { x: 750, y: 200, radius: 20 }
    },
    {
        walls: [
            { x: 50, y: 150, width: 700, height: 20 },
            { x: 300, y: 50, width: 20, height: 300 }
        ],
        enemies: [
            { x: 100, y: 50, radius: 15, dx: 4, dy: 4 },
            { x: 700, y: 350, radius: 15, dx: -4, dy: -4 }
        ],
        goal: { x: 750, y: 50, radius: 20 }
    }
];

function startGame() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    player = {
        x: 50,
        y: canvas.height - 60,
        width: 40,
        height: 40,
        color: "#ffdd57",
        speed: 4
    };

    window.addEventListener("keydown", function (e) {
        keys[e.key] = true;
    });
    window.addEventListener("keyup", function (e) {
        keys[e.key] = false;
    });

    loadLevel(currentLevel);
    requestAnimationFrame(updateGame);
}

function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    walls = level.walls;
    enemies = level.enemies;
    goal = level.goal;
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveEnemies();

    drawWalls();
    drawPlayer();
    drawEnemies();
    drawGoal();

    checkCollisions();

    requestAnimationFrame(updateGame);
}

function movePlayer() {
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowUp"] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys["ArrowDown"] && player.y + player.height < canvas.height) {
        player.y += player.speed;
    }

    // Prevent player from moving through walls
    walls.forEach(wall => {
        if (isColliding(player, wall)) {
            if (keys["ArrowRight"]) player.x -= player.speed;
            if (keys["ArrowLeft"]) player.x += player.speed;
            if (keys["ArrowUp"]) player.y += player.speed;
            if (keys["ArrowDown"]) player.y -= player.speed;
        }
    });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        // Reverse direction if the enemy hits a wall
        if (enemy.x - enemy.radius < 0 || enemy.x + enemy.radius > canvas.width) {
            enemy.dx *= -1;
        }
        if (enemy.y - enemy.radius < 0 || enemy.y + enemy.radius > canvas.height) {
            enemy.dy *= -1;
        }
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawWalls() {
    walls.forEach(wall => {
        ctx.fillStyle = "#333";
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function drawGoal() {
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function checkCollisions() {
    // Check if player reaches the goal
    if (isColliding(player, goal)) {
        currentLevel++;
        if (currentLevel < levels.length) {
            loadLevel(currentLevel);
            resetPlayerPosition();
        } else {
            alert("Congratulations! You've completed all levels!");
            currentLevel = 0;
            loadLevel(currentLevel);
            resetPlayerPosition();
        }
    }

    // Check if player collides with enemies
    enemies.forEach(enemy => {
        if (isCircleColliding(player, enemy)) {
            alert("Game Over! Try again.");
            resetPlayerPosition();
            loadLevel(currentLevel);
        }
    });
}

function isColliding(rect, obj) {
    if (obj.radius) {
        // Collision with a circle (goal)
        return (
            rect.x < obj.x + obj.radius &&
            rect.x + rect.width > obj.x - obj.radius &&
            rect.y < obj.y + obj.radius &&
            rect.y + rect.height > obj.y - obj.radius
        );
    } else {
        // Collision with a rectangle (wall)
        return (
            rect.x < obj.x + obj.width &&
            rect.x + rect.width > obj.x &&
            rect.y < obj.y + obj.height &&
            rect.y + rect.height > obj.y
        );
    }
}

function isCircleColliding(rect, circle) {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius)) { return false; }
    if (distY > (rect.height / 2 + circle.radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

function resetPlayerPosition() {
    player.x = 50;
    player.y = canvas.height - 60;
}

document.querySelector(".start-button").addEventListener("click", startGame);
