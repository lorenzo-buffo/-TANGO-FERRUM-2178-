// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");
  }

  init() {
    
  }

  preload() {
   
    this.load.image("Cielo", "../public/assets/cielo.png");
    this.load.image("plataforma", "../public/assets/plataforma.png");
    this.load.spritesheet("personaje", "../public/assets/SpriteSheet.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("balas", "../public/assets/balas.png");
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

    //generar obstáculos
    this.timer = this.time.addEvent({
      delay: 2000, // Cada 1 segundos
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
  }


  
    
  
  
    
  update() {
    //agregar cursores
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.personaje.setVelocityX(-160);
      this.personaje.anims.play("left", true);
    }else if(cursors.right.isDown) {
      this.personaje.setVelocityX(160);
      this.personaje.anims.play("right", true);
    } else {
      this.personaje.setVelocityX(0);
      this.personaje.anims.play("turn");
    }

    if (cursors.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330);
    }
  }
  crearBalas() {
    const x = 800;
    const y = Phaser.Math.Between(300, 500);
    const bala = this.physics.add.sprite(x, y, "balas");
    bala.setScale(0.05); // Escala de la bala
    bala.setVelocityX(-300); // Velocidad hacia la izquierda
    // Colisión con el personaje
    this.physics.add.collider(this.personaje, bala, this.colisionbala, null, this); 
    bala.setImmovable(true);
    bala.body.allowGravity = false;
}
actualizarTiempo() {
  // Decrementar tiempo restante
  this.tiempoRestante--;

  // Actualizar texto de tiempo restante
  this.tiempoTexto.setText('Tiempo: ' + this.tiempoRestante);

  // Verificar si el tiempo ha llegado a 0
  if (this.tiempoRestante === 0) {
      // Acción cuando el tiempo se acaba (por ejemplo, mostrar un mensaje de "Juego perdido" y reiniciar el juego)
      this.perderJuego();
  }
 }
}