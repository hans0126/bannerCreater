var loader = PIXI.loader;
loader.add('actor', "72088_BloodweaverNightWitch_WEB.jpg");
loader.add('logo', "circle-orboros.png");
loader.add("satellite", "satellite.fnt");
loader.add("crackhouse", "crackhouse.fnt");
loader.add("templar.fnt");


loader.load();


function bannerCreater() {

    var _self = this;

    var editAreaRenderer,
        viewAreaRenderer,
        editAreaStage = new PIXI.Container(),
        viewAreaStage = new PIXI.Container(),
        editAreaWidth = 320,
        editAreaHeight = 320,
        viewAreaWidth = 260,
        viewAreaHeight = 60,
        focusArea = {
            x: 0,
            y: 0
        },
        animeRequest,
        actor = new PIXI.Sprite(),
        actor2 = new PIXI.Sprite(),
        unFocusArea = new PIXI.Graphics(),
        gradient = new PIXI.Sprite(),
        gradientColor = ['#726232', 'transparent'],
        subTitle,
        title,
        logo = new PIXI.Sprite(),
        subTitleStyle = {
            font: "12px Arial",
            fill: "white"
        };


    /*

      var text = new PIXI.Text("Bloodweaver Night Witch", style);


            var _textObj = new PIXI.extras.BitmapText("AaBb", {
                font: "30px Templar",
                tint: 0xFFFFFF

            });*/


    focusArea.x = editAreaWidth / 2 - viewAreaWidth / 2
    focusArea.y = editAreaHeight / 2 - viewAreaHeight / 2

    unFocusArea.beginFill(0x333333);
    unFocusArea.drawRect(0, 0, editAreaWidth, focusArea.y); //top
    unFocusArea.drawRect(0, focusArea.y + viewAreaHeight, editAreaWidth, focusArea.y); //bottom
    unFocusArea.drawRect(0, focusArea.y, focusArea.x, viewAreaHeight)
    unFocusArea.drawRect(editAreaWidth - focusArea.x, focusArea.y, focusArea.x, viewAreaHeight);
    unFocusArea.endFill();
    unFocusArea.alpha = 0.8;


    _self.init = function(_editArea, _viewArea) {

        editAreaRenderer = new PIXI.autoDetectRenderer(editAreaWidth, editAreaHeight);
        document.getElementById(_editArea).appendChild(editAreaRenderer.view);

        viewAreaRenderer = new PIXI.autoDetectRenderer(viewAreaWidth, viewAreaHeight);
        document.getElementById(_viewArea).appendChild(viewAreaRenderer.view);

        editAreaStage.addChild(actor);
        editAreaStage.addChild(unFocusArea);

        subTitle = new PIXI.Text('Alexia Ciannor & the Risen', subTitleStyle);
        subTitle.x = 5;
        subTitle.y = viewAreaHeight - subTitle.height - 3;


        title = new PIXI.extras.BitmapText('Alexia', {
            font: "30px Templar",
            tint: 0xFFFFFF
        })

        title.x = 5;
        title.y = 10;

        gradient.texture = createGradient();

        logo.texture = PIXI.loader.resources.logo.texture;
        logo.alpha = 0.2;
        logo.y = viewAreaHeight / 2 - logo.height / 2;
        logo.x = -20;

        viewAreaStage.addChild(actor2);
        viewAreaStage.addChild(gradient);
        viewAreaStage.addChild(logo);
        viewAreaStage.addChild(subTitle);
        viewAreaStage.addChild(title);

        _self.renew();
    }

    _self.loadedActor = function() {
        actor.texture = PIXI.loader.resources.actor.texture;
        actor2.texture = PIXI.loader.resources.actor.texture;

        actor2.x = -focusArea.x;
        actor2.y = -focusArea.y;

        _self.renew();
        actor.interactive = true;

        actor.on('mousedown', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
    }



    _self.changeTitle = function(_text) {
        title.text = _text;
        viewAreaRenderer.render(viewAreaStage);
    }

    _self.changeSubTitle = function(_text) {
        subTitle.text = _text;
        viewAreaRenderer.render(viewAreaStage);
    }


    _self.renew = function() {
        editAreaRenderer.render(editAreaStage);
        viewAreaRenderer.render(viewAreaStage);

    }



    //--------------------//


    function createGradient() {

        return PIXI.Texture.Draw(function(canvas) {

            var ctx = canvas.getContext('2d'); //get  canvas 2D context
            var _gradient = ctx.createLinearGradient(0, 0, 200, 0);

            _gradient.addColorStop(0, gradientColor[0]);
            _gradient.addColorStop(0.5, gradientColor[0]);
            _gradient.addColorStop(1, gradientColor[1]);
            ctx.fillStyle = _gradient;
            ctx.fillRect(0, 0, viewAreaWidth, viewAreaHeight * 2);
        })

    }

    function onDragStart(event) {
        animate();
        this.data = event.data;
        this.dragging = true;
        this.sx = this.data.getLocalPosition(this).x * this.scale.x;
        this.sy = this.data.getLocalPosition(this).y * this.scale.y;
    }

    function onDragEnd() {
        this.dragging = false;
        cancelRequestAnimFrame(animeRequest);
        // set the interaction data to null

        actor2.x = -focusArea.x + this.position.x;
        actor2.y = -focusArea.y + this.position.y;
        viewAreaRenderer.render(viewAreaStage);
        this.data = null;
    }

    function onDragMove() {
        if (this.dragging) {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x - this.sx;
            this.position.y = newPosition.y - this.sy;
        }
    }

    function animate() {
        animeRequest = requestAnimationFrame(animate);
        editAreaRenderer.render(editAreaStage);
    }

}


PIXI.Texture.Draw = function(cb) {
    var canvas = document.createElement('canvas');
    if (typeof cb == 'function') cb(canvas);
    return PIXI.Texture.fromCanvas(canvas);
}
