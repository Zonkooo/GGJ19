//import * as planck from "./planck";

var Vec2 = planck.Vec2;

var preloadCount = 0;
var preloadTotal = 8;

var bedImg = new Image();
var couchImg = new Image();
var chairImg = new Image();
var armchairImg = new Image();
var tableImg = new Image();
var deskImg = new Image();
var lampImg = new Image();
var standImg = new Image();

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

	lampImg.onload = preloadUpdate;
	lampImg.src = "lamp.png";

	standImg.onload = preloadUpdate;
	standImg.src = "stand.png";

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
	walls.createFixture(planck.Edge(Vec2(0, 0), Vec2(9, 0)), wallFD);
	walls.createFixture(planck.Edge(Vec2(0, 0), Vec2(0, 9)), wallFD);
	walls.createFixture(planck.Edge(Vec2(0, 9), Vec2(9, 9)), wallFD);
	walls.createFixture(planck.Edge(Vec2(9, 0), Vec2(9, 9)), wallFD);

	walls.createFixture(planck.Edge(Vec2(0, 4.7), Vec2(4, 4.7)), wallFD);
	walls.createFixture(planck.Edge(Vec2(4, 4.7), Vec2(4, 4.9)), wallFD);
	walls.createFixture(planck.Edge(Vec2(4, 4.7), Vec2(0, 4.9)), wallFD);

	walls.createFixture(planck.Edge(Vec2(9, 6.7), Vec2(6, 6.7)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6, 6.7), Vec2(6, 7.9)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6, 7.9), Vec2(6.2, 7.9)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6.2, 7.9), Vec2(6.2, 6.9)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6.2, 6.9), Vec2(9, 6.9)), wallFD);

	var wsh = new createjs.Shape();
	wsh.graphics.setStrokeStyle(2);
	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(.1*scale, .1*scale);
	wsh.graphics.lineTo(.1*scale,9.1*scale);
	wsh.graphics.lineTo(9.1*scale,9.1*scale);
	wsh.graphics.lineTo(9.1*scale,.1*scale);
	wsh.graphics.lineTo(.1*scale,.1*scale);
	wsh.graphics.endStroke();

	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(.1*scale, 4.8*scale);
	wsh.graphics.lineTo(4.1*scale,4.8*scale);
	wsh.graphics.lineTo(4.1*scale,5*scale);
	wsh.graphics.lineTo(0.1*scale,5*scale);
	wsh.graphics.endStroke();

	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(9.1*scale, 6.8*scale);
	wsh.graphics.lineTo(6.1*scale,6.8*scale);
	wsh.graphics.lineTo(6.1*scale,8*scale);
	wsh.graphics.lineTo(6.3*scale,8*scale);
	wsh.graphics.lineTo(6.3*scale,7*scale);
	wsh.graphics.lineTo(9.1*scale,7*scale);
	wsh.graphics.endStroke();
	stage.addChild(wsh);

	mouseGround = world.createBody();

	toUpdate.push(new Furniture(new createjs.Bitmap(bedImg), 95, 120, -90));
	toUpdate.push(new Furniture(new createjs.Bitmap(couchImg), 300, 50));
	toUpdate.push(new Furniture(new createjs.Bitmap(couchImg), 400, 170, 90));
	toUpdate.push(new Furniture(new createjs.Bitmap(chairImg), 360, 300, 180));
	toUpdate.push(new Furniture(new createjs.Bitmap(chairImg), 410, 300, 180));
	toUpdate.push(new Furniture(new createjs.Bitmap(tableImg), 310, 160, 90));
	toUpdate.push(new Furniture(new createjs.Bitmap(deskImg), 150, 400));
	toUpdate.push(new Furniture(new createjs.Bitmap(armchairImg), 140, 310));
	toUpdate.push(new Furniture(new createjs.Bitmap(standImg), 25, 25, -90));
	toUpdate.push(new Furniture(new createjs.Bitmap(standImg), 25, 215, -90));
	toUpdate.push(new Furniture(new createjs.Bitmap(lampImg), 410, 50));
	toUpdate.push(new Furniture(new createjs.Bitmap(lampImg), 40, 410, 10));
	toUpdate.push(new Furniture(new createjs.Bitmap(lampImg), 345, 380));

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
