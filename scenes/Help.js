export default class Help extends Phaser.Scene {
    constructor() {
        super("Help");
    }


preload (){
    this.load.image("menu", "./public/assets/menu.png")
    }

    create(){
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