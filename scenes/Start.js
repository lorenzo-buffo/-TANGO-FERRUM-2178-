export default class Start extends Phaser.Scene {
    constructor() {
        super("start");
    }


preload (){
this.load.image("Play", "../public/assets/play.png")
}

create(){
    this.add.text(400, 300, 'TANGO FERRUM 2178', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    
    const playButton = this.add.image(400, 450, 'Play').setOrigin(0.5);
    playButton.setInteractive({ cursor: 'pointer' });
    playButton.setScale(0.2); 

    playButton.on('pointerdown', () => {
        // Reiniciar el juego, en este caso, regresamos a la escena principal
        this.scene.start('main'); // Reemplaza 'main' con el nombre de tu escena principal
    });     
}

}