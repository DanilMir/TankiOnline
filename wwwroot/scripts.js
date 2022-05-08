var canvas = document.getElementById("gameZone");
var context = canvas.getContext("2d");

var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

connection.start().catch(function (e) {
});

var bulletList = [];
var tankList = [];
const countTanks = 2;
var tankIds = ["11", "22"];

// Models
const gameZone = {
    height: 600,
    width: 600
}

canvas.width = gameZone.width;
canvas.height = gameZone.height;

connection.on("State", function (tanks, bullets) {
    // console.log(tanks);
    tankList = [];
    tanks.forEach((item) => {
        const newTank = new Tank();

        newTank.image = new Image();
        newTank.image.src = "img/tanks_1.png";

        newTank.position.x = item.position.x;
        newTank.position.y = item.position.y;
        newTank._id = item.id;

        newTank.directionRotate = item.directionRotate;

        tankList.push(newTank);
        
        // newTank.inittwo(item.id, item.position.x, item.position.y, item.directionRotate)
    });

    //tankList = [...tankList2];
    // console.log(bullets);
    bulletList = [];
    bullets.forEach((item) => {
        const newBullet = new Bullet();
        newBullet.position.x = item.position.x;
        newBullet.position.y = item.position.y;
        newBullet.directionRotate = item.directionRotate;
        newBullet.image = new Image();
        newBullet.image.src = "img/bullet.png";
        bulletList.push(newBullet);
    });
    
    //bulletList = [...bulletList2]
    // requestAnimationFrame(draw);
});

// Танк
function Tank() {
    return {
        _id: null,
        image: new Image(),
        speed: 8,
        directionRotate: 90,
        position:
            {
                x: 0,
                y: 0
            },
        size: {
            height: 100,
            width: 56
        },
        // инициализация танка
        init: function (id, positionX, positionY) {
            this.image = new Image();
            this.image.src = "img/tanks_1.png";

            this.position.x = positionX;
            this.position.y = positionY;
            this._id = id;

            tankList.push(this);

            /* if(this._id === "22")
             {
                 setTimeout(() => { console.log("destroy"); this.destroy();}, 4000);
             }*/
        },

        inittwo: function (id, positionX, positionY, directionRotate) {
            this.image = new Image();
            this.image.src = "img/tanks_1.png";

            this.position.x = positionX;
            this.position.y = positionY;
            this._id = id;

            this.directionRotate = directionRotate;

            tankList.push(this);

            /* if(this._id === "22")
             {
                 setTimeout(() => { console.log("destroy"); this.destroy();}, 4000);
             }*/
        },

        destroy: function () {
            console.log("destroy", this._id, this._id, tankList.findIndex((tank) => tank._id === this._id));
            tankList.splice(tankList.findIndex((tank) => tank._id === this._id), 1);
        },

        // отрисовка танка
        render: function () {

            // рисуем танк
            context.save();
            context.translate(this.position.x, this.position.y);
            context.rotate(inRad(this.directionRotate));
            context.drawImage(this.image, -(this.size.width / 2), -(this.size.height / 2), this.size.width, this.size.height);
            context.restore();

        },
        movingLeft: function () {
            if (this.directionRotate === 270) {
                if (this.position.x < 0 || this.position.x - this.speed < 0)
                    this.position.x = 0;
                else {
                    this.position.x -= this.speed;
                }
            }
            this.directionRotate = 270;
        },
        movingRight: function () {
            if (this.directionRotate === 90) {
                if (this.position.x > gameZone.width - this.size.width || this.position.x + this.speed > gameZone.width - this.size.width)
                    this.position.x = gameZone.width - this.size.width;
                else {
                    this.position.x += this.speed;
                }
            }
            this.directionRotate = 90;
        },

        movingUp: function () {
            if (this.directionRotate === 0) {
                if (this.position.y < 0 || this.position.y - this.speed < 0)
                    this.position.y = 0;
                else {
                    this.position.y -= this.speed;
                }
            }
            this.directionRotate = 0;
        },

        movingDown: function () {
            if (this.directionRotate === 180) {
                if (this.position.y > gameZone.height - this.size.height || this.position.y + this.speed > gameZone.height - this.size.height)
                    this.position.y = gameZone.height - this.size.height;
                else {
                    this.position.y += this.speed;
                }
            }
            this.directionRotate = 180;
        },


        firing: function () {
            const newBullet = new Bullet();
            newBullet.tankId = this._id;
            newBullet.directionRotate = this.directionRotate;

            switch (newBullet.directionRotate) {
                case 0:
                    newBullet.position.x = this.position.x;
                    newBullet.position.y = this.position.y - (this.size.height / 2) - (newBullet.size.height / 3);
                    break;
                case 180:
                    newBullet.position.x = this.position.x;
                    newBullet.position.y = this.position.y + (this.size.height / 2) + (newBullet.size.height / 3);
                    break;

                case 90:
                    newBullet.position.x = this.position.x + (this.size.height / 2) + (newBullet.size.height / 3);
                    newBullet.position.y = this.position.y;
                    break;

                case 270:
                    newBullet.position.x = this.position.x - (this.size.height / 2) - (newBullet.size.height / 3);
                    newBullet.position.y = this.position.y;
                    break;

                default:
                    newBullet.position.x = this.position.x;
                    newBullet.position.y = this.position.y - (this.size.height / 2) - (newBullet.size.height / 3);
                    break;

            }

            bulletList.push(newBullet);
        }
    }
}

// Снаряд
function Bullet() {
    return {
        image: new Image(),
        directionRotate: 0,
        speed: 6,
        tankId: "",
        position:
            {
                x: 0,
                y: 0
            },

        size: {
            height: 40,
            width: 20
        },

        // отрисовка cнаряда
        render: function () {
            // this.image = new Image();
            // this.image.src = "img/bullet.png";

            // рисуем бомбу
            context.save();
            context.translate(this.position.x, this.position.y);
            context.rotate(inRad(this.directionRotate));
            context.drawImage(this.image, -(this.size.width / 2), -(this.size.height / 2), this.size.width, this.size.height);
            context.restore();

            // tankList.forEach((tank, i) => {
            //     let tankWidth = tank.directionRotate === 0 || tank.directionRotate === 180 ? tank.size.width : tank.size.height;
            //     let tankHeight = tank.directionRotate === 0 || tank.directionRotate === 180 ? tank.size.height : tank.size.width;
            //     let tankX = tank.position.x - tankWidth / 2;
            //     let tankY = tank.position.y - tankHeight / 2;
            //
            //     context.strokeRect(tankX, tankY, tankWidth, tankHeight);
            //     if (tank._id !== this.tankId &&
            //         this.position.x >= tankX / 2 && this.position.x <= tankX + tankWidth &&
            //         this.position.y >= tankY && this.position.y <= tankY + tankHeight) {
            //
            //         this.destroy();
            //         tank.destroy();
            //     } else {
            //         this.move();
            //     }
            // });


        },
        destroy: function () {
            console.log("bullet", this._id, this._id, bulletList.findIndex((bullet) => bullet == this));
            bulletList.splice(bulletList.findIndex((bullet) => bullet == this), 1);
        },
        move: function () {
            switch (this.directionRotate) {
                case 0:
                    this.position.y -= this.speed;
                    break;
                case 180:
                    this.position.y += this.speed;
                    break;

                case 90:
                    this.position.x += this.speed;
                    break;

                case 270:
                    this.position.x -= this.speed;
                    break;

                default:
                    this.position.y -= this.speed;
                    break;

            }
        }
    }
}

// обрабатываем нажатия на клавиши для управления игрой

const action = {MoveLeft: 'MoveLeft', MoveRight: 'MoveRight', MoveUp: 'MoveUp', MoveDown: 'MoveDown', Fire: 'Fire'};

document.addEventListener('keydown', function (e) {
    let state = action.Fire;

    // влево
    if (e.which === 37) {
        //myTank.movingLeft();
        state = action.MoveLeft;
    }

    // вправо
    else if (e.which === 39) {
        //myTank.movingRight();
        state = action.MoveRight;
    }

    // вверх
    else if (e.which === 38) {
        //myTank.movingUp();
        state = action.MoveUp;
    }

    // вниз
    else if (e.which === 40) {
        //myTank.movingDown();
        state = action.MoveDown;
    } else if (e.which === 32) {
        //myTank.firing();
        state = action.Fire;
    }

    connection.invoke("SendAction", state).catch(function (err) {
        return console.error(err.toString());
    });
});

function draw() {
    requestAnimationFrame(draw);
    // очищаем холст
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    
    console.log(tankList, bulletList)

    for (var i = 0; i < bulletList.length; i++) {

        const bullet = bulletList[i];
        bullet.render();

        if (bullet.position.x < 0 || bullet.position.y < 0 || bullet.position.x > gameZone.width || bullet.position.y > gameZone.height) {
            bulletList.splice(i, 1);
        }
    }

    tankList.forEach(element => element.render());
}


// HElpers

function inRad(num) {
    //я ведь говорил, что функция принимает угол в радианах?
    return num * Math.PI / 180;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

requestAnimationFrame(draw);


/*


// переменная для работы с холстом
const canvas = document.getElementById('gameZone');
// содержимое холста
const context = canvas.getContext('2d');
// размеры одной клетки, количество строк и столбцов
const grid = 64;
const numRows = 13;
const numCols = 15;

// создаём кирпичные стены, которые потом расставим по всему полю и будем взрывать. На них будет кирпичный рисунок. Наша задача — нарисовать на стене этот рисунок.
const softWallCanvas = document.createElement('canvas');
const softWallCtx = softWallCanvas.getContext('2d');
// размер квадратика стены равен размеру клетки игрового поля
softWallCanvas.width = softWallCanvas.height = grid;

// цвет швов между кирпичами
softWallCtx.fillStyle = 'black';
// закрашиваем ими всю клетку
softWallCtx.fillRect(0, 0, grid, grid);
// цвет кирпича
softWallCtx.fillStyle = '#a9a9a9';

// первый ряд кирпичей 
softWallCtx.fillRect(1, 1, grid - 2, 20);
// второй ряд кирпичей
softWallCtx.fillRect(0, 23, 20, 18);
softWallCtx.fillRect(22, 23, 42, 18);
// третий ряд кирпичей
softWallCtx.fillRect(0, 43, 42, 20);
softWallCtx.fillRect(44, 43, 20, 20);

// теперь создадим неразрушаемые блоки — их нельзя будет уничтожить
const wallCanvas = document.createElement('canvas');
const wallCtx = wallCanvas.getContext('2d');
// тоже размером с игровую клетку
wallCanvas.width = wallCanvas.height = grid;

// цвет тени
wallCtx.fillStyle = 'black';
wallCtx.fillRect(0, 0, grid, grid);
// цвет верхнего освещения — для объёма
wallCtx.fillStyle = 'white';
wallCtx.fillRect(0, 0, grid - 2, grid - 2);
// цвет стены
wallCtx.fillStyle = '#a9a9a9';
wallCtx.fillRect(2, 2, grid - 4, grid - 4);

// сопоставляем объекты со значениями на карте
const types = {
  wall: '▉',
  softWall: 1,
  bomb: 2
};

// создаём карту игрового поля
// ▉ означает, что здесь будет неразрушаемый блок
// x означает, что здесь не могут появиться кирпичные блоки. Эти места нам нужны, чтобы в них мог появиться сам игрок и проходить к углам карты. 
let cells = [];
const template = [
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉'],
  ['▉','x','x',   ,   ,   ,   ,   ,   ,   ,   ,   ,'x','x','▉'],
  ['▉','x','▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉','x','▉'],
  ['▉','x',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,'x','▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,'▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉'],
  ['▉',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,'▉'],
  ['▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉'],
  ['▉','x',   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,   ,'x','▉'],
  ['▉','x','▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉',   ,'▉','x','▉'],
  ['▉','x','x',   ,   ,   ,   ,   ,   ,   ,   ,   ,'x','x','▉'],
  ['▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉','▉']
];

// здесь будем отслеживать все игровые сущности, которые нужно будет обработать
let entities = [];

// заполняем уровень каменными и кирпичными блоками
function generateLevel() {
    // на старте пока уровень пустой
  cells = [];

  // cначала считаем строки
  for (let row = 0; row < numRows; row++) {
    cells[row] = [];

    // потом столбцы
    for (let col = 0; col < numCols; col++) {

        // с вероятностью 90% в этой ячейке будет кирпичная стена
      if (!template[row][col] && Math.random() < 0.90) {
        cells[row][col] = types.softWall;
      }
      else if (template[row][col] === types.wall) {
        cells[row][col] = types.wall;
      }
    }
  }
}

// как выглядит и что умеет игрок (пока игрок — это простой белый круг)
const player = {
    row: 1,
    col: 1,
    // сколько может ставить бомб
    numBombs: 1,
  
    // длина взыва бомбы
    bombSize: 3,
   
    // размер игрока
    radius: grid * 0.35,
   
    // отрисовываем белый круг в нужной позиции
    render() {
      const x = (this.col + 0.5) * grid;
      const y = (this.row + 0.5) * grid;
  
      context.save();
      context.fillStyle = 'white';
      context.beginPath();
      context.arc(x, y, this.radius, 0, 2 * Math.PI);
      context.fill();
    }
  }

  // главный цикл игры

// время последней отрисовки кадра
let last;
// сколько прошло времени с момента последней отрисовки
let dt;
function loop(timestamp) {
  requestAnimationFrame(loop);
  // очищаем холст
  context.clearRect(0,0,canvas.width,canvas.height);

  // считаем разницу во времени с момента последней отрисовки.
  // эти параметры нам нужны для анимации пульсации бомбы и длительности взрыва
  if (!last) {
    last = timestamp;
  }
  dt = timestamp - last;
  last = timestamp;

  // заново рисуем всё на игровом поле
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      switch(cells[row][col]) {
        case types.wall:
          context.drawImage(wallCanvas, col * grid, row * grid);
          break;
        case types.softWall:
          context.drawImage(softWallCanvas, col * grid, row * grid);
          break;
      }
    }
  }

  // обновляем и отрисовываем все игровые сущности
  entities.forEach((entity) => {
    entity.update(dt);
    entity.render();
  });

  // удаляем отработанные сущности, например, взорванные бомбы 
  entities = entities.filter((entity) => entity.alive);
  // рисуем игрока
  player.render();
}

*/