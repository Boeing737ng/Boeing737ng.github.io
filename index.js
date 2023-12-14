//(() => {
  const random = Math.random;
  const ceil = Math.ceil;

  const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Composite = Matter.Composite;

  const parent = document.getElementById("game");
  const canvas = document.getElementById("canvas");
  const gameOverlayer = document.getElementById("overlay");
  const refreshLayer = document.getElementById("refreshButton");
  const floor = document.getElementById("floor");
  const volumes = Array.from(document.getElementsByClassName("volume"));
  const loading = document.getElementById("loadingContainer");

  const biImage = document.getElementById("ciImg");
  const namuhLinkButton = document.getElementById("namuhLinkButton");
  const popupCloseButton = document.getElementById("popupCloseButton");
  const guidePopup = document.getElementById("guidePopup");

  //const refreshButton = document.getElementById("refreshButton");

  const ctx = canvas.getContext("2d");

  const image = new Image;
  image.onload = function(){
      ctx.drawImage(image, 100, 100);
      console.log("img loaded")
  }
  image.src = "assets/img/nds_img_bi_nm.png";

  const engine = Engine.create();

  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: 480,
      height: 720,
      wireframes: false,
    },
  });

  const times = [];
  let fps = 100;

  let mousePos;
  let isClicking = false;
  let isMouseOver = false;
  let newSize = 1;

  let isGameOver = false;
  let score = 0;
  let rank = -1;
  let rate = -1;

  let isLineEnable = false;

  let imgs;

  let isMuted = localStorage.getItem("isMuted") === "true";

  let isFromApp = false;

  // var necromancer = new Resurrect();

  const background = Bodies.rectangle(240, 360, 480, 720, {
    isStatic: true,
    render: { fillStyle: "#D8FFFF" },
  });
  background.collisionFilter = {
    group: 0,
    category: 1,
    mask: -2,
  };
  const ground = Bodies.rectangle(400, 1220, 810, 1032, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });
  const wallLeft = Bodies.rectangle(-50, 500, 100, 1000, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });
  const wallRight = Bodies.rectangle(530, 500, 100, 1000, {
    isStatic: true,
    render: { fillStyle: "transparent" },
  });
  World.add(engine.world, [wallLeft, wallRight, ground, background]);

  Matter.Runner.run(engine);
  //Engine.run(engine);
  Render.run(render);

  resize();

  refreshLoop();

  init();



  window.addEventListener("resize", resize);

  addEventListener("mousedown", () => {
    if (isGameOver) return;

    isClicking = isMouseOver;
  });

  floor.addEventListener("touchstart", (e) => {
    if (isGameOver) return;

    isClicking = true;

    const rect = canvas.getBoundingClientRect();
    mousePos = e.touches[0].clientX / parent.style.zoom - rect.left;

    if (ball) {
      Body.setPosition(ball, { x: mousePos, y: 50 });
      if (mousePos > 455) Body.setPosition(ball, { x: 455, y: 50 });
      else if (mousePos < 25) Body.setPosition(ball, { x: 25, y: 50 });
    }
  });

  canvas.addEventListener("touchstart", (e) => {
    if (isGameOver) return;

    isClicking = true;

    const rect = canvas.getBoundingClientRect();
    mousePos = e.touches[0].clientX / parent.style.zoom - rect.left;

    if (ball) {
      Body.setPosition(ball, { x: mousePos, y: 50 });
      if (mousePos > 455) Body.setPosition(ball, { x: 455, y: 50 });
      else if (mousePos < 25) Body.setPosition(ball, { x: 25, y: 50 });
    }
  });

  addEventListener("mouseup", () => {
    if (isGameOver) return;

    isClicking = false;
  });
  addEventListener("touchend", () => {
    if (isGameOver || !isClicking) return;

    isClicking = false;

    if (ball !== null) {
      ball.createdAt = 0;
      ball.collisionFilter = {
        group: 0,
        category: 1,
        mask: -1,
      };

      Body.setVelocity(ball, { x: 0, y: (100 / fps) * 5.5 });
      ball = null;

      newSize = ceil(random() * 3);
      setTimeout(() => createNewBall(newSize), 500);
    }
    
  });

  addEventListener("mousemove", (e) => {
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    mousePos = e.clientX / parent.style.zoom - rect.left;
  });
  addEventListener("touchmove", (e) => {
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    mousePos = e.touches[0].clientX / parent.style.zoom - rect.left;
  });

  addEventListener("click", () => {
    if (isGameOver || !isMouseOver) return;

    if (ball !== null) {
      ball.createdAt = 0;
      ball.collisionFilter = {
        group: 0,
        category: 1,
        mask: -1,
      };
      Body.setVelocity(ball, { x: 0, y: (100 / fps) * 5.5 });

      ball = null;

      newSize = ceil(random() * 3);

      setTimeout(() => createNewBall(newSize), 500);
    }
  });

  volumes.forEach((v) =>
    v.addEventListener("click", () => {
      isMuted = !isMuted;
      localStorage.setItem("isMuted", isMuted);

    })
  );
  canvas.addEventListener("mouseover", () => {
    isMouseOver = true;
  });

  canvas.addEventListener("mouseout", () => {
    isMouseOver = false;
  });

  Events.on(engine, "beforeUpdate", () => {
    //console.log("beforeUpdate")
    if (isGameOver) return;

    if (ball !== null) {
      const gravity = engine.world.gravity;
      Body.applyForce(ball, ball.position, {
        x: -gravity.x * gravity.scale * ball.mass,
        y: -gravity.y * gravity.scale * ball.mass,
      });

      if (isClicking && mousePos !== undefined) {
        Body.setPosition(ball, { x: mousePos, y: 50 });

        if (mousePos > 455) Body.setPosition(ball, { x: 455, y: 50 });
        else if (mousePos < 25) Body.setPosition(ball, { x: 25, y: 50 });
      }
    }

    isLineEnable = false;
    const bodies = Composite.allBodies(engine.world);
    for (let i = 4; i < bodies.length; i++) {
      body = bodies[i];

      if (body.position.y < 90) {
        if (
          body !== ball &&
          Math.abs(body.velocity.x) < 0.1 &&
          Math.abs(body.velocity.y) < 0.1
        ) {
          gameOver();
        }
      } else if (body.position.y < 150) {
        if (
          body !== ball &&
          Math.abs(body.velocity.x) < 0.5 &&
          Math.abs(body.velocity.y) < 0.5
        ) {
          isLineEnable = true;
        }
      }
    }
  });

  Events.on(engine, "collisionActive", collisionEvent);
  Events.on(engine, "collisionStart", collisionEvent);

  function collisionEvent(e) {
    if (isGameOver) return;
    e.pairs.forEach((collision) => {
      bodies = [collision.bodyA, collision.bodyB];

      if (bodies[0].size == undefined || bodies[1].size == undefined) return;

      if (bodies[0].size == bodies[1].size) {
        allBodies = Composite.allBodies(engine.world);
        if (allBodies.includes(bodies[0]) && allBodies.includes(bodies[1])) {
          if (
            (Date.now() - bodies[0].createdAt < 100 ||
              Date.now() - bodies[1].createdAt < 100) &&
            bodies[0].createdAt !== 0 &&
            bodies[1].createdAt !== 0
          ) {
            return;
          }

          World.remove(engine.world, bodies[0]);
          World.remove(engine.world, bodies[1]);

          World.add(
            engine.world,
            newBall( 
              (bodies[0].position.x + bodies[1].position.x) / 2,
              (bodies[0].position.y + bodies[1].position.y) / 2,
              bodies[0].size == 11 ? 11 : bodies[0].size + 1
            )
          );

          score += bodies[0].size;

          
          if(navigator.vibrate) {
            //console.log("vibrates")
            //e.preventDefault();
            window.navigator.vibrate(100);
          }

          if (!isMuted) {
           // const audio = new Audio("/static/pop.wav");
            //audio.play();
          }  


          
        }
      }
    });
  }

  Events.on(render, "afterRender", () => {
    if (isGameOver) {
      if(!isFromApp) {
        ctx.fillStyle = "#ffffff55";
        ctx.rect(0, 0, 480, 720);
        ctx.fill();

        writeText("Game Over", "center", 240, 280, 50);
        writeText("Score: " + score, "center", 240, 320, 30);
      }
      // writeText(gameOverMessage, "center", 240, 280, 50);
      // writeText(yourScoreMessage + score, "center", 240, 320, 30);
      // if (rank !== -1)
      //   writeText(
      //     `${rankMessage}${rank} (${rateMessage} ${rate}%)`,
      //     "center",
      //     240,
      //     360,
      //     30
      //   );
    } else {
      writeText(score, "start", 25, 70, 40);
      writeText("v2.23", "center", 450, 20, 15);

      if (isLineEnable) {
        ctx.strokeStyle = "#74D5FF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 100);
        ctx.lineTo(480, 100);
        ctx.stroke();
      }
    }
  });

  function writeText(text, textAlign, x, y, size) {
    ctx.font = `${size}px Pretendard`;
    ctx.textAlign = textAlign;
    // Text border width
    ctx.lineWidth = 1;

    ctx.strokeStyle = "#333333";
    ctx.strokeText(text, x, y);

    ctx.fillStyle = "#333333";
    ctx.fillText(text, x, y);
  }

  function resize() {
    canvas.height = 720;
    canvas.width = 480;

    if (isMobile()) {
      parent.style.zoom = window.innerWidth / 480;
      
      floor.style.height = `${Math.max(
        10,
        (window.innerHeight - canvas.height * parent.style.zoom) /
        parent.style.zoom
        //window.innerHeight - (canvas.height * parent.style.zoom)


      )}px`;
      
     // console.log(canvas.height * parent.style.zoom)
      //console.log(window.innerHeight - (canvas.height * parent.style.zoom))


      // floor.style.height = `${Math.max(
      //   110,
      //   (window.innerHeight - (canvas.height * parent.style.zoom))
      // )}px`;

      biImage.style.left = "50%"
      biImage.style.transform = "translateX(-50%)";

      biImage.style.top = `${canvas.height / 3}px`;
      
    } else {
      parent.style.zoom = window.innerHeight / 720 / 1.2;
      console.log("PC ZOOM")
      floor.style.height = "50px";

      biImage.style.transform = "none";
      biImage.style.width = `${canvas.width / 3}px`;
      biImage.style.left = `${canvas.width / 3}px`;
    }

    Render.setPixelRatio(render, parent.style.zoom * 2);
  }

  function refreshLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);
      fps = times.length;
      refreshLoop();
    });
  }

  function isMobile() {
    return window.innerHeight / window.innerWidth >= 1.49;
  }

  function preloadImage(url)
  {
      var img=new Image();
      img.src=url;
  }

  function loadPrevGame() {
    var test = true
    if(localStorage.getItem("canvas_world") && test) {
      
      var savedWorld = necromancer.resurrect(localStorage.getItem("canvas_world"));
      World.add(engine.world, savedWorld);
      //World.add(engine.world, [wallLeft, wallRight, ground, background]);
    } else {
      createNewBall(1);
    }
  }

  function init() {

    for (let index = 1; index <= 11; index++) {
      var url = `assets/img/${index}.png`
      preloadImage(url)
    }

    isGameOver = false;
    ball = null;
    engine.timing.timeScale = 1;
    score = 0;

    gameOverlayer.style.display = "none";
    //playAgainButton.style.display = "none";

    while (engine.world.bodies.length > 4) {
      engine.world.bodies.pop();
    }
    createBG(1);

    createNewBall(1);
    
    //loadPrevGame()
  }


  function createBG(size) {
    bg = newBG(render.options.width / 2, 50, size);
    bg.collisionFilter = {
      group: -1,
      category: 2,
      mask: 0,
    };
    World.add(engine.world, bg);
  }

  function newBG(x, y, size) {
    c = Bodies.rectangle(240, 570, 1,1, {
      isSensor: true,
      isStatic: true,
      render: {
        sprite: {
          texture: `assets/img/nds_img_pang_bg01.png`,
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });
    c.size = size;
    c.createdAt = Date.now();
    c.restitution = 0.3;
    c.friction = 0.1;

    return c;
  }

  function gameOver() {
    isGameOver = true;
    engine.timing.timeScale = 0;

    if (!isFromApp) {
      gameOverlayer.style.display = "";
    }

    if (ball !== null) World.remove(engine.world, ball);


    shareScore(score);

    // fetch("/score", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ score: score }),
    // })
    //   .then((respone) => respone.json())
    //   .then((data) => {
    //     rank = data.rank;
    //     rate = data.rate;
    //   });
  }

  function createNewBall(size) {
    ball = newBall(render.options.width / 2, 50, size);
    ball.collisionFilter = {
      group: -1,
      category: 2,
      mask: 0,
    };
    World.add(engine.world, ball);
  }

  function newBall(x, y, size) {
    c = Bodies.circle(x, y, size * 11, {
      render: {
        sprite: {
          texture: `assets/img/${size}.png`,
          // xScale: size / 12.75,
          // yScale: size / 12.75,

          xScale: size / 11.75,
          yScale: size / 11.75,


        },
      },
    });
    c.size = size;
    c.createdAt = Date.now();
    c.restitution = 0.3;
    c.friction = 0.1;

    return c;
  }
  function shareScore(score) {
    if (isFromApp) {
      var urlStr = 'hybrid://SendDataToForm/{"FunctionName":"OnReceiveData","Data":"SendText^' + score + '"}';
      document.location.href = urlStr;
    } else {
      if (navigator.share) {
        navigator.share({
            title: '나무팡',
            text: `내 기록: ${score}`,
            url: window.location.href  // URL of your game
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
      } else {
          // Fallback for browsers that don't support Web Share API
          //let shareMessage = `나무 2048 내 기록: ${score} ${window.location.href}`;
          //alert("Web Share API is not supported in this browser.\n\n" + "You can copy the following message to share:\n\n" + shareMessage);
      }
    }
  } 
  
  function isFromNHApp(trigger) {
    console.log("APP <-> WEB connected!!")
    //alert("APP <-> WEB connected!!")
    isFromApp = true;
  }
  function saveGameData() {
    var data = necromancer.stringify(engine.world);
    localStorage.setItem("canvas_world", data);
  }


//})();


function reloadGame() {
  location.reload();
}

// document.getElementById("refreshButton")
//   .addEventListener("click", function(event) {
//     //reloadGame()
//     gameOver()
//   });

namuhLinkButton.addEventListener("click", (event) => {
  window.open("https://namuh.page.link/popPANG");
});

popupCloseButton.addEventListener("click", (event) => {
  guidePopup.style.display = "none";

});