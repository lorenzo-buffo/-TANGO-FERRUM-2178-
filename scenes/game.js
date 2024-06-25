// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");// Limpiar mensaje de texto
    this.contadorBalas = 0; // Contador de balas que ha recibido el personaje
    this.maximoBalas = 2; // Máximo de balas que pueden matar al personaje
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
    this.load.image("obstaculo1", "../public/assets/circulo.png");
    this.load.image("obstaculo2", "../public/assets/cuadrado.png");
    this.load.image("obstaculo3", "../public/assets/rombo.png");
    this.load.image("obstaculo4", "../public/assets/triangulo.png");
  }


  create() {
    // creacion de background
    this.add.image(400, 300, "Cielo");
    // creacion de plataforma
    this.plataforma = this.physics.add.staticGroup();
    // al grupo de plataformas agregar una plataforma
    this.plataforma.create(400, 570, "plataforma")
    //agregar pj
    this.personaje = this.physics.add.sprite(200, 450, "personaje");
    this.personaje.setScale(1);
    // add physics to player
    this.personaje.setBounce(0, 0.2);
    this.personaje.setCollideWorldBounds(true);
    // colisión entre el personaje y la plataforma
    this.physics.add.collider(this.personaje, this.plataforma);
    // Crear animaciones para el personaje
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
    this.personaje.anims.play("turn");
    // Crear enemigo estático en el extremo izquierdo
     this.enemigo = this.physics.add.sprite(50, 450, 'enemigo'); // Ajusta las coordenadas (x, y) 
     this.enemigo.setScale(0.5); 
     this.physics.add.collider(this.enemigo, this.plataforma);
     this.physics.add.overlap(this.personaje, this.enemigo, this.colisionEnemigo, null, this);
    // Crear grupo de balas
    this.balas = this.physics.add.group()
    this.timer = this.time.addEvent({
      delay: 4000, // Cada 4 segundos
      callback: this.crearBalas,
      callbackScope: this,
      loop: true
    }); 
    this.contadorBalas = 0;
    // crear grupo de obstaculos
    this.obstaculos = this.physics.add.group({
      allowGravity: false,
      velocityX: -300 // Velocidad inicial hacia la izquierda
    });
    this.time.addEvent({
     delay: 3000, // cada 3 segundos
     callback: this.crearObstaculo,
     callbackScope: this,
     loop: true // Repetir indefinidamente
    });
    // Inicializar tiempo restante
    this.tiempoRestante = 30;
    // Crear texto para mostrar el tiempo restante
    this.tiempoTexto = this.add.text(20, 30, 'Tiempo: 30', { fontSize: '25px', fill: '#fff' });
    this.textoTiempoExtra = this.add.text(400, 300, '', { fontSize: '32px', fill: '#00ff00' });
    this.textoTiempoExtra.setOrigin(0.5);
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
      callback: this.sumarPuntos, 
      callbackScope: this,
      loop: true
    });
    this.puntosTexto = this.add.text(30, 60, 'Puntos: 0', { fontSize: '25px', fill: '#fff' });
    // Crear grupo de relojes
    this.relojes = this.physics.add.group();
    allowGravity: false
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
    //agregar cursores
    const cursors = this.input.keyboard.createCursorKeys();
    // Definir límites de movimiento en el eje X
    const maxX = 300; // Límite derecho
    // Manejar movimiento horizontal basado en las teclas presionadas
     if (cursors.right.isDown) {
    this.personaje.flipX = false; 
  } 
    // Controlar la animación del personaje según las teclas presionadas
     if (cursors.right.isDown) {
    this.personaje.anims.play("right", true); // Reproducir la animación de mover a la derecha
    } else {
    this.personaje.anims.play("turn"); // Reproducir la animación de "turn" si no se está moviendo
  }
    // Manejar la velocidad del personaje solo si no está en el límite de movimiento
     if (cursors.right.isDown && this.personaje.x < maxX) {
    this.personaje.setVelocityX(160); // Velocidad hacia la derecha 
    }  else {
    this.personaje.setVelocityX(0); // Detener el movimiento horizontal si se alcanza el límite o no se presionan las teclas
  }
    // Manejar el salto del personaje
     if (cursors.up.isDown && this.personaje.body.touching.down) {
  this.personaje.setVelocityY(-330); // Aplicar velocidad hacia arriba para simular el salto
    
  }
    // Manejar colisión entre el personaje y el reloj
    this.physics.overlap(this.personaje, this.relojes, this.colisionReloj, null, this);
      this.relojes.getChildren().forEach(reloj => {
        if (reloj.x < -reloj.width) {
            reloj.destroy();
        }
    });
  }


  crearBalas(){
    const x = 800;
    const y = Phaser.Math.Between(300, 500);
    const bala = this.physics.add.sprite(x, y, "balas");
    bala.setScale(0.2); // 
    // Configuración del cuerpo de colisión
    bala.body.setSize(bala.width * 0.5, bala.height * 0.5); // Ajustar el tamaño del cuerpo de colisión
    bala.body.setOffset(bala.width * 0.25, bala.height * 0.25); // Ajustar el desplazamiento del cuerpo de colisión
    // Ajustes adicionales
    bala.setVelocityX(-500); 
    bala.setImmovable(true);
    bala.body.allowGravity = false;
    // Colisión con el personaje
    this.physics.add.overlap(this.personaje, bala, this.colisionBala, null, this);
  }

  
  colisionBala(personaje, bala) {
      // Incrementar contador de balas
      this.contadorBalas++;
      // Si es la primera bala que impacta y no es letal
      if (this.contadorBalas === 1) {
      // Ejemplo de acción en la primera colisión (cambiar el color del jugador)
        this.personaje.setTint(0xff0000); // Cambiar el color del jugador a rojo
        this.time.delayedCall(1000, () => {
          this.personaje.clearTint(); // Restaurar el color original después de 1 segundo
        });
      } else if (this.contadorBalas >= this.maximoBalas) {
      // Si es la segunda bala o más, el jugador muere
        this.scene.start('end', { tiempoJugado: this.tiempoJugado, puntos: this.puntos });
      }
      // Destruir la bala después de la colisión
      bala.destroy();
  }
 
  
  colisionEnemigo(personaje, enemigo) {
    // Ejemplo: Reiniciar juego al colisionar con el enemigo
    this.scene.start('end', { tiempoJugado: this.tiempoJugado, puntos: this.puntos });
  }

  crearObstaculo() {
    const x = 980; // Posición inicial a la derecha fuera de la pantalla
    const y = 490; // Posición aleatoria en el eje Y
    const obstaculoKey = Phaser.Math.RND.pick(["obstaculo1", "obstaculo2", "obstaculo3", "obstaculo4"]); // Elegir aleatoriamente entre tipos de obstáculos
    const obstaculo = this.obstaculos.create(x, y, obstaculoKey);
    // Configurar el obstáculo
    obstaculo.setVelocityX(-300); // Establecer velocidad hacia la izquierda
    obstaculo.setScale(0.2); // Ajustar escala si es necesario
    // Hacer el obstáculo inamovible
    obstaculo.setImmovable(true);
    // Colisión entre el obstáculo y la plataforma estática
    this.physics.add.collider(obstaculo, this.plataforma);
    // Colisión entre el personaje y los obstáculos
    this.physics.add.collider(this.personaje, obstaculo, this.colisionObstaculo, null, this);
  }


  colisionObstaculo(personaje, obstaculo) {  
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
  const x = 800; // Cambia la posición inicial en el eje X si es necesario
  const y = 400; // Posición fija en el eje Y
  const reloj = this.relojes.create(x, y, 'reloj'); 
  reloj.setImmovable(true); 
  reloj.setScale(0.14); 
  reloj.body.allowGravity = false; // Desactivar la gravedad del reloj
  reloj.setVelocityX(-300); // Aplicar velocidad hacia la izquierda 
}


colisionReloj(personaje, reloj) {
  // Destruir el reloj al tocarlo
  reloj.destroy();
  // Sumar 5 segundos al tiempo restante
  this.tiempoRestante += 5;
  // Actualizar texto de tiempo restante
  this.tiempoTexto.setText('Tiempo: ' + this.tiempoRestante);
  // Mostrar texto de "+5 segundos" en la pantalla 
  this.textoTiempoExtra.setText('+5 segundos');
  this.time.delayedCall(1000, () => {
    this.textoTiempoExtra.setText('');
  });
}
}