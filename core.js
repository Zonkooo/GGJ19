//import * as planck from "./planck";

var Vec2 = planck.Vec2;

var preloadCount = 0;
var preloadTotal = 6;

var bedImg = new Image();
var couchImg = new Image();
var chairImg = new Image();
var armchairImg = new Image();
var tableImg = new Image();
var deskImg = new Image();

var stage;
var world;

var toUpdate = [];

var bed;
var couch1;
var couch2;
var walls;
var friction;
var mouseJoint;
var mouseGround;

var scale = 50;

function startGame()
{
	stage = new createjs.Stage("gameCanvas");
	var text = new createjs.Text("Loading...");
	text.x = stage.canvas.width/2; text.y = stage.canvas.height/2;
	text.textAlign = "center"; text.textBaseline = "middle";
	stage.addChild(text);
	stage.update();

	preloadAssets();
}

function preloadAssets()
{
	bedImg.onload = preloadUpdate;
	bedImg.src = "bed.png";

	couchImg.onload = preloadUpdate;
	couchImg.src = "couch.png";

	chairImg.onload = preloadUpdate;
	chairImg.src = "chair.png";

	armchairImg.onload = preloadUpdate;
	armchairImg.src = "armchair.png";

	deskImg.onload = preloadUpdate;
	deskImg.src = "desk.png";

	tableImg.onload = preloadUpdate;
	tableImg.src = "table.png";

	//createjs.Sound.addEventListener("fileload", preloadUpdate);
	//createjs.Sound.registerSound("media/receive.wav", "jump", 4);
}

function preloadUpdate()
{
	preloadCount++;
	if(preloadCount === preloadTotal)
		launchGame();
}

function launchGame()
{
	stage.removeChildAt(0); //loading text

	world = planck.World();

	walls = world.createBody({
		type: 'static',
		position: Vec2(.1, .1),
	});

	var wallFD = {
		density: 1.0,
		restitution: 0,
	};
	walls.createFixture(planck.Edge(Vec2(0, 0), Vec2(10, 0)), wallFD);
	walls.createFixture(planck.Edge(Vec2(0, 0), Vec2(0, 10)), wallFD);
	walls.createFixture(planck.Edge(Vec2(0, 10), Vec2(10, 10)), wallFD);
	walls.createFixture(planck.Edge(Vec2(10, 0), Vec2(10, 10)), wallFD);

	var wsh = new createjs.Shape();
	//wsh.graphics.setStrokeStyle(3);
	wsh.graphics.beginStroke("green");
	wsh.graphics.moveTo(.1*scale, .1*scale);
	wsh.graphics.lineTo(.1*scale,10.1*scale);
	wsh.graphics.lineTo(10.1*scale,10.1*scale);
	wsh.graphics.lineTo(10.1*scale,.1*scale);
	wsh.graphics.lineTo(.1*scale,.1*scale);
	wsh.graphics.endStroke();
	stage.addChild(wsh);

	mouseGround = world.createBody();

	toUpdate.push(new Furniture(new createjs.Bitmap(bedImg), 150, 100));
	toUpdate.push(new Furniture(new createjs.Bitmap(couchImg), 300, 100));
	toUpdate.push(new Furniture(new createjs.Bitmap(couchImg), 250, 200));
	toUpdate.push(new Furniture(new createjs.Bitmap(chairImg), 60, 60));
	toUpdate.push(new Furniture(new createjs.Bitmap(chairImg), 60, 120));
	toUpdate.push(new Furniture(new createjs.Bitmap(tableImg), 80, 300));
	toUpdate.push(new Furniture(new createjs.Bitmap(deskImg), 200, 400));
	toUpdate.push(new Furniture(new createjs.Bitmap(armchairImg), 60, 400));

	stage.on("stagemousemove", function(evt) {
		if(mouseJoint)
			mouseJoint.setTarget({x: evt.stageX / scale, y: evt.stageY / scale});
	});

	createjs.Ticker.framerate = 30;
	createjs.Ticker.addEventListener("tick", update);
}

function update(event)
{
	world.step(1 / 30);

	for(var f of toUpdate)
	{
		f.update();
	}

	stage.update();
}
