var loader = PIXI.loader;
loader.add("satellite.fnt");
loader.add("templar.fnt");
loader.add("source/flag_pixi.json");
/*
loader.on('progress',function(loader, loadedResource){
    console.log(loader);
    console.log(loadedResource);
})
*/

loader.load();


function bannerCreater() {

    var _self = this;

    _self.mode = 0

    var mode = 0, //0: banner 1:thumb
        editAreaRenderer,
        viewAreaRenderer,
        editAreaStage = new PIXI.Container(),
        viewAreaStage = new PIXI.Container(),
        bannerGroup = new PIXI.Container(),
        editAreaWidth = 320,
        editAreaHeight = 320,
        viewAreaWidth = 0,
        viewAreaHeight = 0,
        focusArea = {
            x: 0,
            y: 0
        },
        animeRequest,
        actor = new PIXI.Sprite(),
        actor2 = new PIXI.Sprite(),
        unFocusArea = new PIXI.Graphics(),
        gradient = new PIXI.Sprite(),
        gradientColor = ['#999999', 'transparent'],
        subTitle,
        title,
        logo = new PIXI.Sprite(),
        subTitleStyle = {
            font: "9px Arial",
            fill: "white"
        },
        dropShadowFilter = new PIXI.filters.DropShadowFilter();
   

    dropShadowFilter.color = 0x333333;
    dropShadowFilter.alpha = 1;
    dropShadowFilter.blur = 15;
    dropShadowFilter.distance = 3;


    _self.init = function(_editArea, _viewArea) {

        editAreaRenderer = new PIXI.autoDetectRenderer(editAreaWidth, editAreaHeight);
        _editArea.appendChild(editAreaRenderer.view);

        viewAreaRenderer = new PIXI.autoDetectRenderer(viewAreaWidth, viewAreaHeight);
        _viewArea.appendChild(viewAreaRenderer.view);

        _self.selectMode( _self.mode);

        editAreaStage.addChild(actor);
        editAreaStage.addChild(unFocusArea);

        subTitle = new PIXI.Text('Alexia Ciannor & the Risen', subTitleStyle);
        subTitle.x = 5;
        subTitle.y = viewAreaHeight - subTitle.height - 3;


       /* title = new PIXI.extras.BitmapText('Alexia', {
            font: "30px Templar",
            tint: 0xFFFFFF
        })*/

        title = new PIXI.Text('Alexia', {
              font: "30px Arial",
            fill: "white"
        });

        title.x = 5;
        title.y = 10;

        title.filters = [dropShadowFilter];

        gradient.texture = createGradient();

        gradient.rotation = -0.2;
        gradient.x = -12;

        logo.texture = new PIXI.Texture.fromFrame('convergence.png');
        //logo.texture = PIXI.loader.resources.logo.texture;
        logo.alpha = 0.4;
        logo.y = viewAreaHeight / 2 - logo.height / 2;
        logo.x = -20;


        bannerGroup.addChild(gradient);
        bannerGroup.addChild(logo);
        bannerGroup.addChild(subTitle);
        bannerGroup.addChild(title);

        viewAreaStage.addChild(actor2);
        viewAreaStage.addChild(bannerGroup);

        renew();
    }

    _self.loadedActor = function() {
        actor.texture = PIXI.loader.resources.actor.texture;
        actor2.texture = PIXI.loader.resources.actor.texture;

        actor2.x = -focusArea.x;
        actor2.y = -focusArea.y;

        renew();
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

    _self.exportImg = function() {
        viewAreaRenderer.render(viewAreaStage);
        return viewAreaRenderer.view.toDataURL("image/png");
    }

    _self.changeFaction = function(_factionImg, _factionColor) {
        logo.texture = new PIXI.Texture.fromFrame(_factionImg);
        gradientColor[0] = _factionColor;
        gradient.texture = createGradient();
        viewAreaRenderer.render(viewAreaStage);
    }

    _self.selectMode = function(_mode) {
         _self.mode = _mode;

        if (_mode == 0) {
            viewAreaWidth = 260;
            viewAreaHeight = 60;
            bannerGroup.visible = true;
        } else {
            viewAreaWidth = 120;
            viewAreaHeight = 120;
            bannerGroup.visible = false;
        }

        viewAreaRenderer.resize(viewAreaWidth, viewAreaHeight);

        focusArea.x = editAreaWidth / 2 - viewAreaWidth / 2;
        focusArea.y = editAreaHeight / 2 - viewAreaHeight / 2;


        unFocusArea.clear();
        unFocusArea.beginFill(0x333333);
        unFocusArea.drawRect(0, 0, editAreaWidth, focusArea.y); //top
        unFocusArea.drawRect(0, focusArea.y + viewAreaHeight, editAreaWidth, focusArea.y); //bottom
        unFocusArea.drawRect(0, focusArea.y, focusArea.x, viewAreaHeight)

        unFocusArea.drawRect(editAreaWidth - focusArea.x, focusArea.y, focusArea.x, viewAreaHeight);
        unFocusArea.endFill();

        unFocusArea.alpha = 0.7;

        actor2.x =  -focusArea.x + actor.x;
        actor2.y =  -focusArea.y + actor.y 

        renew();

    }






    //--------------------//  

    function renew() {
        editAreaRenderer.render(editAreaStage);
        viewAreaRenderer.render(viewAreaStage);
    }

    function createGradient() {

        return PIXI.Texture.Draw(function(canvas) {

            var ctx = canvas.getContext('2d'); //get  canvas 2D context
            var _gradient = ctx.createLinearGradient(0, 0, 200, 0);

            _gradient.addColorStop(0, gradientColor[0]);
            _gradient.addColorStop(0.5, gradientColor[0]);
            _gradient.addColorStop(1, gradientColor[1]);
            ctx.fillStyle = _gradient;
            ctx.fillRect(0, 0, viewAreaWidth + 40, viewAreaHeight * 2);
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
