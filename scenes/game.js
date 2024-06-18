// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");
  }

  init() {
    this.puntos = 0; // Inicializar la variable de puntos
    this.tiempoJugado = 0; // Inicializar la variable para rastrear el tiempo jugado
  }

  preload() {
   
    this.load.image("Cielo", "../public/assets/background.png");
    this.load.image("plataforma", "../public/assets/plataforma.png");
    this.load.spritesheet("personaje", "../public/assets/SpriteSheet.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("balas", "../public/assets/balas.png");
    this.load.image("enemigo", "../public/assets/enemigo.png");
    this.load.image("reloj", "../public/assets/reloj.png");
    
  }

  create() {
    // creacion de background
    this.add.image(400, 300, "Cielo");
    // creacion de plataformas
    this.plataforma = this.physics.add.staticGroup();
     // al grupo de plataformas agregar una plataforma
     this.plataforma.create(400, 570, "plataforma").setScale(2).refreshBody();

     //agregar pj
     this.personaje = this.physics.add.sprite(100, 450, "personaje");
     this.personaje.setScale(1);
    
         // add physics to player
    this.personaje.setBounce(0, 0.2);
    this.personaje.setCollideWorldBounds(true);
    
     // Crear animaciones para el personaje
     this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("personaje", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("personaje", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "personaje", frame: 4 }],
      frameRate: 20
    });
    // Reproducir la animación de "turn" cuando no se está moviendo
    this.personaje.anims.play("turn");

    // colisión entre el personaje y la plataforma
    this.physics.add.collider(this.personaje, this.plataforma);
        // Crear grupo de balas
    this.balas = this.physics.add.group()
    this.timer = this.time.addEvent({
      delay: 4000, // Cada 4 segundos
      callback: this.crearBalas,
      callbackScope: this,
      loop: true
    }); 
    // Inicializar tiempo restante
    this.tiempoRestante = 30;

    // Crear texto para mostrar el tiempo restante
    this.tiempoTexto = this.add.text(20, 30, 'Tiempo: 30', { fontSize: '25px', fill: '#fff' });

    // Configurar temporizador para actualizar el tiempo
    this.timedEvent = this.time.addEvent({
        delay: 1000, // Actualizar cada 1 segundo
        callback: this.actualizarTiempo,
        callbackScope: this,
        loop: true
    });
     // Iniciar temporizador para sumar puntos cada 3 segundos
     this.time.addEvent({
      delay: 3000, 
      callback: this.sumarPuntos, // Aquí estaba el error de tipografía
      callbackScope: this,
      loop: true
    });
    this.puntosTexto = this.add.text(30, 60, 'Puntos: 0', { fontSize: '25px', fill: '#fff' });

      // Creación del enemigo
      this.enemigo = this.physics.add.sprite(-70, 450, "enemigo");
      this.enemigo.setScale(0.3);
        // Agregar colisión entre el enemigo y las plataformas
        this.physics.add.collider(this.enemigo, this.plataforma);
      // Configuración de la velocidad del enemigo
      this.velocidadEnemigo = 80; 

         // Crear grupo de relojes
    this.relojes = this.physics.add.group();
    // Configurar temporizador para crear relojes estáticos cada 5 segundos
    this.timerRelojes = this.time.addEvent({
      delay: 5000, // Cada 5 segundos
      callback: this.crearReloj,
      callbackScope: this,
      loop: true
    });
  }
  
  update(time, delta) {
      // Incrementar el tiempo jugado en cada iteración del juego
      this.tiempoJugado += delta / 1000; // Convertir delta a segundos
      // Manejar colisión entre el personaje y las balas
    this.physics.overlap(this.personaje, this.balas, this.colisionBala, null, this);
    // Manejar colisión entre el personaje y el enemigo
    this.physics.overlap(this.personaje, this.enemigo, this.colisionEnemigo, null, this);
    //agregar cursores
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.personaje.setVelocityX(-260);
      this.personaje.anims.play("left", true);
    }else if(cursors.right.isDown) {
      this.personaje.setVelocityX(260);
      this.personaje.anims.play("right", true);
    } else {
      this.personaje.setVelocityX(0);
      this.personaje.anims.play("turn");
    }

    if (cursors.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330);
    }
     // Lógica para que el enemigo persiga al jugador
     if (this.personaje.x < this.enemigo.x) {
      this.enemigo.setVelocityX(-this.velocidadEnemigo);
  } else if (this.personaje.x > this.enemigo.x) {
      this.enemigo.setVelocityX(this.velocidadEnemigo);
  } else {
      this.enemigo.setVelocityX(0);   
   }
      // Manejar colisión entre el personaje y el reloj
      this.physics.overlap(this.personaje, this.relojes, this.colisionReloj, null, this);

  }

  colisionEnemigo(personaje,enemigo){
    this.scene.start('end', { tiempoJugado: this.tiempoJugado, puntos: this.puntos });
  }
  crearBalas() {
    const x = 800;
    const y = Phaser.Math.Between(300, 500);
    const bala = this.physics.add.sprite(x, y, "balas");
    bala.setScale(0.05); // Escala de la bala
    bala.setVelocityX(-500); // Velocidad hacia la izquierda
    // Colisión con el personaje
    this.physics.add.collider(this.personaje, bala, this.colisionBala, null, this); 
    bala.setImmovable(true);
    bala.body.allowGravity = false;
  }
  colisionBala(personaje, bala) {
    // Cambiar a la escena de fin cuando el personaje colisiona con una bala
    this.scene.start('end', { tiempoJugado: this.tiempoJugado, puntos: this.puntos });
  }
  actualizarTiempo() {
  // Decrementar tiempo restante
  this.tiempoRestante--;

  // Actualizar texto de tiempo restante
  this.tiempoTexto.setText('Tiempo: ' + this.tiempoRestante);

  // Verificar si el tiempo ha llegado a 0
  if (this.tiempoRestante === 0) {
      // Acción cuando el tiempo se acaba (por ejemplo, mostrar un mensaje de "Juego perdido" y reiniciar el juego)
      this.scene.start('end', { tiempoJugado: this.tiempoJugado, puntos: this.puntos });
  }
 }
 sumarPuntos() {
  this.puntos += 15; // Sumar 15 puntos
  console.log("Puntos:", this.puntos);
  this.puntosTexto.setText('Puntos: ' + this.puntos); // Actualizar texto de puntos
 }
 
 crearReloj() {
  const x = 400; // Posición fija en el eje X
  const y = 400; // Posición fija en el eje Y
  const reloj = this.relojes.create(x, y, 'reloj'); // Crear el reloj en la posición fija
  reloj.setImmovable(true); // Hacer el reloj inamovible
  reloj.setScale(0.07); // Escalar el reloj si es necesario
  reloj.body.allowGravity = false; // Desactivar la gravedad del reloj
   // Configurar un temporizador para que el reloj desaparezca después de 2 segundos
   this.time.delayedCall(2000, () => {
    reloj.destroy(); // Eliminar el reloj
}, [], this);
}
colisionReloj(personaje, reloj) {
  // Destruir el reloj al tocarlo
  reloj.destroy();

  // Sumar 5 segundos al tiempo restante
  this.tiempoRestante += 5;

  // Actualizar texto de tiempo restante
  this.tiempoTexto.setText('Tiempo: ' + this.tiempoRestante);
}
}