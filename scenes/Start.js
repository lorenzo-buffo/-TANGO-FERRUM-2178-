export default class Start extends Phaser.Scene {
    constructor() {
        super("start");
    }


preload (){
this.load.image("Play", "./public/assets/play.png")
this.load.image("Ayuda", "./public/assets/ayuda.png")
}

create(){
    this.add.text(400, 300, 'TANGO FERRUM 2178', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

    const playButton = this.add.image(100, 500, 'Play').setOrigin(0.5);
    playButton.setInteractive({ cursor: 'pointer' });
    playButton.setScale(0.4); 
     // Escalar el botón cuando el cursor esté sobre él
     playButton.on('pointerover', () => {
        playButton.setScale(0.35); 
    });
    // Restaurar la escala original cuando el cursor salga del botón
    playButton.on('pointerout', () => {
        playButton.setScale(0.4); 
    });

    playButton.on('pointerdown', () => {
        // Reiniciar el juego, en este caso, regresamos a la escena principal
        this.scene.start('main'); // Reemplaza 'main' con el nombre de tu escena principal
    });  
       // Botón de ayuda
       const helpButton = this.add.image(700, 500, 'Ayuda').setOrigin(0.5);
       helpButton.setInteractive({ cursor: 'pointer' });
       helpButton.setScale(0.4);  
        // Escalar el botón cuando el cursor esté sobre él
        helpButton.on('pointerover', () => {
            helpButton.setScale(0.35); 
        });
        // Restaurar la escala original cuando el cursor salga del botón
        helpButton.on('pointerout', () => {
            helpButton.setScale(0.4); 
        });

       helpButton.on('pointerdown', () => {
           // Ir a la escena de ayuda
           this.scene.start('Help'); // Reemplaza 'Ayuda' con el nombre de tu escena de ayuda
       });
   }   
}
