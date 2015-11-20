function bannerCreater() {

    var _self = this;
    var editAreaRenderer;
    var viewAreaRenderer;
    var editAreaWidth = 320;
    var editAreaHeight = 320;
    var viewAreaWidth = 0;
    var viewAreaHeight = 0;
    var focusArea = {
        x: 0,
        y: 0
    };
    var animeRequest;
    var gradientColor = ['#999999', 'transparent'];
    var subTitle;
    var subTitleStyle = {
        font: "9px Arial",
        fill: "white"
    };

    var editAreaStage = new PIXI.Container();
    var viewAreaStage = new PIXI.Container();
    var bannerGroup = new PIXI.Container();
    var actor = new PIXI.Sprite();
    var actor2 = new PIXI.Sprite();
    var unFocusArea = new PIXI.Graphics();
    var gradient = new PIXI.Sprite();
    var titleGroup = new PIXI.Container();
    var logo = new PIXI.Sprite();
    var dropShadowFilter = new PIXI.filters.DropShadowFilter();

    _self.mode = 0; //0: banner 1:thumb
    _self.titleMode = null;
    _self.titleOption = {
        fontFamily: "Templar",
        bigFontSize: 28,
        smallFontSize: 20,
        color: 0xFFFFFF,
        text: ''
    };

    _self.init = init;
    _self.changeTitle = changeTitle;
    _self.changeTitleMode = changeTitleMode;
    _self.changeSubTitle = changeSubTitle;
    _self.exportImg = exportImg;
    _self.changeFaction = changeFaction;
    _self.selectMode = selectMode;
    _self.close = close;
    _self.loadedActor = loadedActor;

    dropShadowFilter.color = 0x333333;
    dropShadowFilter.alpha = 1;
    dropShadowFilter.blur = 15;
    dropShadowFilter.distance = 3;

    function init(_editArea, _viewArea) {

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

        checkHasBitmapFont();

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

    function loadedActor() {
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
            .on('mousemove', onDragMove);
    }

    function changeTitle(_text) {
        _self.titleOption.text = _text;
        titleProcess();
        viewAreaRenderer.render(viewAreaStage);
    }

    function changeTitleMode(_num) {
        titleProcess(_num);
        viewAreaRenderer.render(viewAreaStage);
    }

    function changeSubTitle(_text) {
        subTitle.text = _text;
        viewAreaRenderer.render(viewAreaStage);
    }

    function exportImg() {
        viewAreaRenderer.render(viewAreaStage);
        return viewAreaRenderer.view.toDataURL("image/png");
    }

    function changeFaction(_factionImg, _factionColor) {
        logo.texture = new PIXI.Texture.fromFrame(_factionImg);
        gradientColor[0] = _factionColor;
        gradient.texture = createGradient();
        viewAreaRenderer.render(viewAreaStage);
    }

    function selectMode(_mode) {
        _self.mode = _mode;

        if (_mode === 0) {
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
        actor2.y = -focusArea.y + actor.y;

        renew();
    }

    function close() {
        editAreaRenderer.destroy();
        viewAreaRenderer.destroy();
    }

    function checkHasBitmapFont() {
        var match = null;
        for (var key in PIXI.extras.BitmapText.fonts) {
            if (_self.titleOption.fontFamily == key) {
                match = true;
                break;
            }
        }

        if (!match) {
            console.log('%cbtimap font error!! %cnot have font:"%c' + _self.titleOption.fontFamily + '"', 'color:red', 'color:black', 'color:green');
        }
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

        if (_mode === undefined) { //auto
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
                    for (var j = 0; j < _t.length; j++) {
                        if (_t[j].length >= 7) {
                            limit = true;
                            break;
                        }
                    }

                    if (limit) {
                        for (var k = 0; k < _t.length; k++) {
                            _txt[k] += _t[k];
                        }
                    } else {
                        for (var l = 0; l < _t.length; l++) {
                            _txt[0] += _t[l] + " ";
                        }
                    }
                } else {
                    for (var m = 0; m < _t.length; m++) {
                        _txt[0] += _t[m] + " ";
                    }
                }

            }

            if (_txt[1] === '') {
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
                    for (var n = 0; n < _t.length; n++) {
                        if (n < 2) {
                            _txt[n] += _t[n] + " ";
                        }
                    }
                    titleDisplayMode(1, _txt);
                    break;

                case 1:
                    for (var o = 0; o < _t.length; o++) {
                        if (o < 2) {
                            _txt[0] += _t[o] + " ";
                        } else {
                            _txt[1] += _t[o] + " ";
                        }
                    }
                    titleDisplayMode(1, _txt);
                    break;

                case 2:
                    for (var p = 0; p < _t.length; p++) {
                        _txt[0] += _t[p] + " ";
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
                for (var j = 0; j < 2; j++) {
                    titleGroup.getChildAt(j).font = _self.titleOption.bigFontSize + "px " + _self.titleOption.fontFamily;
                }
                titleGroup.getChildAt(0).y = 9;
                break;


            case 1:
                for (var k = 0; k < 2; k++) {
                    titleGroup.getChildAt(k).font = _self.titleOption.smallFontSize + "px " + _self.titleOption.fontFamily;
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
        });

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
};
