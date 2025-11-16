import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");
        this.load.image("star", "star.png");
        this.load.image("rock", "rock.png");

        // Dragon
        this.load.image("dragon-baby", "dragon/baby.png");
        this.load.image("dragon-claw", "dragon/claw.png");
        this.load.image("dragon-head", "dragon/head.png");
        this.load.image("dragon-segment", "dragon/segment.png");
        this.load.image("dragon-wing", "dragon/wing.png");

        // Menu
        this.load.image("menu-bg", "Dragonsploit-_menue.png");
        this.load.audio("menu-music", "music/game_jam_mainmenu.mp3");

        //Game
        this.load.image("empty-room", "empty-room.png");
        this.load.image("throweridle", "idlethrower.png");
        this.load.image("throwerholding", "holdingthrower.png");
        this.load.image("main-bg", "dragon-background.png");
        this.load.image("throwerthrowing", "throwingthrower.png");
        this.load.image("throwerroom", "throwerroom.png");
        this.load.audio("game-music", "music/game_jam.mp3");
        this.load.audio("swoosh", "sound/swoosh.mp3");
        this.load.image("startButton", "assets/start_Buton_dragonsploit.png");
        //GameoverScreen
        this.load.audio(
            "gameover-music",
            "music/game_jam_creepy_deathscenemusic.mp3"
        );
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("MainMenu");
    }
}
