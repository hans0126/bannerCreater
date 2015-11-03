var loader = PIXI.loader;
loader.add("source/satellite.fnt");
loader.add("source/templar.fnt");
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

    _self.mode = 0; //0: banner 1:thumb

    _self.titleMode;


    _self.titleOption = {
        fontFamily: "Templar",
        bigFontSize: 28,
        smallFontSize: 20,
        color: 0xFFFFFF,
        text: 'Blessing'
    }

    var editAreaRenderer,
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
        titleGroup = new PIXI.Container(),
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
        viewAreaRenderer.roundPixels = true;
        _self.selectMode(_self.mode);

        editAreaStage.addChild(actor);
        editAreaStage.addChild(unFocusArea);

        subTitle = new PIXI.Text('Alexia Ciannor & the Risen', subTitleStyle);
        subTitle.filters = [dropShadowFilter];
        subTitle.x = 5;
        subTitle.y = viewAreaHeight - subTitle.height - 3;

        /* title = new PIXI.extras.BitmapText('Alexia', {
             font: "30px Templar",
             tint: 0xFFFFFF
         })*/

        //max 2 line

        for (i = 0; i < 2; i++) {
            var _titleChild = new PIXI.extras.BitmapText('', {
                font: "10px " + _self.titleOption.fontFamily,
                tint: _self.titleOption.color
            });

            _titleChild.filters = [dropShadowFilter];
            titleGroup.addChild(_titleChild);

        }

        titleGroup.y = 3;
        titleGroup.x = 5;

        titleProcess();

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
        bannerGroup.addChild(titleGroup);

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
        _self.titleOption.text = _text;
        titleProcess();
        viewAreaRenderer.render(viewAreaStage);
    }

    _self.changeTitleMode = function(_num) {
        titleProcess(_num);
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
        unFocusArea.drawRect(0, focusArea.y, focusArea.x, viewAreaHeight); // left
        unFocusArea.drawRect(editAreaWidth - focusArea.x, focusArea.y, focusArea.x, viewAreaHeight); //right
        unFocusArea.endFill();

        unFocusArea.alpha = 0.7;

        actor2.x = -focusArea.x + actor.x;
        actor2.y = -focusArea.y + actor.y

        renew();

    }

    //--------------------//  

    /**
     * @param _mode  null:auto  0:2row1work 1:2row2word 2:1row2word
     *
     */

    function titleProcess(_mode) {

        var _t = _self.titleOption.text,
            _txt = ['', ''];

        _t = _t.split(' ');

        if (_mode == undefined) { //auto
            if (_t.length > 2) {
                for (var i = 0; i < _t.length; i++) {
                    if (i < 2) {
                        _txt[0] += _t[i] + " ";
                    } else {
                        _txt[1] += _t[i] + " ";
                    }
                }
            } else {
                if (_t.length == 2) {
                    var limit = false;
                    for (var i = 0; i < _t.length; i++) {
                        if (_t[i].length >= 7) {
                            limit = true;
                            break;
                        }
                    }

                    if (limit) {
                        for (var i = 0; i < _t.length; i++) {
                            _txt[i] += _t[i];
                        }
                    } else {
                        for (var i = 0; i < _t.length; i++) {
                            _txt[0] += _t[i] + " ";
                        }
                    }
                } else {
                    for (var i = 0; i < _t.length; i++) {
                        _txt[0] += _t[i] + " ";
                    }
                }

            }

            if (_txt[1] == '') {
                titleDisplayMode(0, _txt);
                _self.titleMode = 0;
            } else {
                titleDisplayMode(1, _txt);
                _self.titleMode = 1;
            }

        } else {
            _self.titleMode = _mode;
            switch (_mode) {
                case 0:
                    for (var i = 0; i < _t.length; i++) {
                        if (i < 2) {
                            _txt[i] += _t[i] + " ";
                        }
                    }
                    titleDisplayMode(1, _txt);
                    break;

                case 1:
                    for (var i = 0; i < _t.length; i++) {
                        if (i < 2) {
                            _txt[0] += _t[i] + " ";
                        } else {
                            _txt[1] += _t[i] + " ";
                        }
                    }
                    titleDisplayMode(1, _txt);
                    break;

                case 2:
                    for (var i = 0; i < _t.length; i++) {
                        _txt[0] += _t[i] + " ";
                    }
                    titleDisplayMode(0, _txt);
                    break;
            }
        }
    }

    // 0: 1row 1: 2row

    function titleDisplayMode(_mode, _txt) {

        for (var i = 0; i < 2; i++) {
            titleGroup.getChildAt(i).text = _txt[i];
        }

        switch (_mode) {
            case 0:
                for (var i = 0; i < 2; i++) {
                    titleGroup.getChildAt(i).font = _self.titleOption.bigFontSize + "px " + _self.titleOption.fontFamily
                }
                titleGroup.getChildAt(0).y = 9;
                break;


            case 1:
                for (var i = 0; i < 2; i++) {
                    titleGroup.getChildAt(i).font = _self.titleOption.smallFontSize + "px " + _self.titleOption.fontFamily
                }
                titleGroup.getChildAt(1).y = titleGroup.getChildAt(0).height + 2;
                titleGroup.getChildAt(1).x = titleGroup.getChildAt(0).width / 2;
                titleGroup.getChildAt(0).y = 0;
                break;
        }

    }


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
