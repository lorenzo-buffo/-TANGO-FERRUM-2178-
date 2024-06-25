export default class End extends Phaser.Scene {
    constructor() {
      super("end");
     }
     preload() {
   
        this.load.image("Restart", "../public/assets/restart.png");
        this.load.image("menu", "../public/assets/menu.png");
    }

    create(data) {
         // Agregar un texto que indique que perdiste
         this.add.text(400, 300, '¡TE ATRAPARON!', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        // Obtener los datos pasados desde la escena principal
        const tiempoJugado = data.tiempoJugado;
        const puntos = data.puntos;
        // Mostrar los datos en la pantalla
        this.add.text(400,450, 'Puntos: ' + puntos, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 400, 'Tiempo jugado: ' + data.tiempoJugado.toFixed(2) + ' segundos', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        const tiempoRedondeado = Math.round(data.tiempoJugado);

         // Agregar el botón de reinicio
        const restartButton = this.add.image(700, 500, 'Restart').setOrigin(0.5);
        // Hacer el botón interactivo y cambiar el cursor
        restartButton.setInteractive({ cursor: 'pointer' });
        restartButton.setScale(0.4); 
        // Escalar el botón cuando el cursor esté sobre él
        restartButton.on('pointerover', () => {
            restartButton.setScale(0.35); 
        });
        // Restaurar la escala original cuando el cursor salga del botón
        restartButton.on('pointerout', () => {
            restartButton.setScale(0.4); 
        });

        restartButton.on('pointerdown', () => {
        // Reiniciar el juego, en este caso, regresamos a la escena principal
        this.scene.start('main'); // Reemplaza 'main' con el nombre de tu escena principal
    });     

        // agregar boton de menu
        const menuButton = this.add.image(100, 500, 'menu').setOrigin(0.5);
         // Hacer el botón interactivo y cambiar el cursor
         menuButton.setInteractive({ cursor: 'pointer' });
         menuButton.setScale(0.4); 
         // Escalar el botón cuando el cursor esté sobre él
        menuButton.on('pointerover', () => {
            menuButton.setScale(0.35); 
        });
        // Restaurar la escala original cuando el cursor salga del botón
        menuButton.on('pointerout', () => {
            menuButton.setScale(0.4); 
        });
 
         menuButton.on('pointerdown', () => {
         // Reiniciar el juego, en este caso, regresamos a la escena principal
         this.scene.start('start'); // Reemplaza 'main' con el nombre de tu escena principal
     });     
 }
}