export function startPacmanCanvas() {
    const canvas = document.querySelector("#pacman-canvas");
    const coordinates = document.querySelector("#pacman-coordinates");

    if (!canvas || !coordinates) {
        console.error("Pac-Man canvas or coordinates display is missing.");
        return;
    }

    const context = canvas.getContext("2d");
    const keys = {};

    const player = {
        x: 50,
        y: 50,
        radius: 18,
        speed: 180,
        direction: 0,
        score: 0
    };

    const walls = [
        { x: 100, y: 80, width: 30, height: 320 },
        { x: 220, y: 160, width: 30, height: 320 },
        { x: 340, y: 80, width: 30, height: 320 },
        { x: 460, y: 210, width: 30, height: 280 },
        { x: 100, y: 470, width: 120, height: 30 },
        { x: 250, y: 70, width: 90, height: 30 }
    ];

    function touchesWall(x, y, radius) {
        return walls.some((wall) => {
            return (
                x + radius > wall.x &&
                x - radius < wall.x + wall.width &&
                y + radius > wall.y &&
                y - radius < wall.y + wall.height
            );
        });
    }

    let pellets = [];

    for (let y = 30; y < canvas.height; y += 40) {
        for (let x = 30; x < canvas.width; x += 40) {
            if (!touchesWall(x, y, 6)) {
                pellets.push({ x, y });
            }
        }
    }

    window.addEventListener("keydown", (event) => {
        if (event.key.startsWith("Arrow")) {
            keys[event.key] = true;
            event.preventDefault();
        }
    });

    window.addEventListener("keyup", (event) => {
        if (event.key.startsWith("Arrow")) {
            keys[event.key] = false;
            event.preventDefault();
        }
    });

    function update(deltaTime) {
        let horizontalMovement = 0;
        let verticalMovement = 0;

        if (keys.ArrowLeft) {
            horizontalMovement -= player.speed * deltaTime;
            player.direction = Math.PI;
        }

        if (keys.ArrowRight) {
            horizontalMovement += player.speed * deltaTime;
            player.direction = 0;
        }

        if (keys.ArrowUp) {
            verticalMovement -= player.speed * deltaTime;
            player.direction = -Math.PI / 2;
        }

        if (keys.ArrowDown) {
            verticalMovement += player.speed * deltaTime;
            player.direction = Math.PI / 2;
        }

        const nextX = player.x + horizontalMovement;

        if (
            nextX - player.radius >= 0 &&
            nextX + player.radius <= canvas.width &&
            !touchesWall(nextX, player.y, player.radius)
        ) {
            player.x = nextX;
        }

        const nextY = player.y + verticalMovement;

        if (
            nextY - player.radius >= 0 &&
            nextY + player.radius <= canvas.height &&
            !touchesWall(player.x, nextY, player.radius)
        ) {
            player.y = nextY;
        }

        pellets = pellets.filter((pellet) => {
            const distance = Math.hypot(
                player.x - pellet.x,
                player.y - pellet.y
            );

            if (distance < player.radius + 5) {
                player.score += 10;
                return false;
            }

            return true;
        });

        coordinates.textContent =
            `X: ${Math.round(player.x)} | ` +
            `Y: ${Math.round(player.y)} | ` +
            `Score: ${player.score}`;
    }

    function drawWalls() {
        context.fillStyle = "#153ad1";
        context.strokeStyle = "#5b7cff";
        context.lineWidth = 3;

        for (const wall of walls) {
            context.fillRect(
                wall.x,
                wall.y,
                wall.width,
                wall.height
            );

            context.strokeRect(
                wall.x,
                wall.y,
                wall.width,
                wall.height
            );
        }
    }

    function drawPellets() {
        context.fillStyle = "#ffffff";

        for (const pellet of pellets) {
            context.beginPath();
            context.arc(pellet.x, pellet.y, 4, 0, Math.PI * 2);
            context.fill();
        }
    }

    function drawPlayer(time) {
        const mouthSize =
            0.18 + Math.abs(Math.sin(time / 120)) * 0.25;

        context.fillStyle = "#ffd800";
        context.beginPath();
        context.moveTo(player.x, player.y);

        context.arc(
            player.x,
            player.y,
            player.radius,
            player.direction + mouthSize,
            player.direction + Math.PI * 2 - mouthSize
        );

        context.closePath();
        context.fill();
    }

    function draw(time) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawPellets();
        drawWalls();
        drawPlayer(time);
    }

    let previousTime = performance.now();

    function gameLoop(currentTime) {
        const deltaTime = Math.min(
            (currentTime - previousTime) / 1000,
            0.05
        );

        previousTime = currentTime;
        update(deltaTime);
        draw(currentTime);
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}