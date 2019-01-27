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

var walls;
var friction;
var mouseJoint;
var mouseGround;

var scale = 50;
var offset = 20;

var active = true;

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
		position: Vec2(.5, .5),
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
	walls.createFixture(planck.Edge(Vec2(4, 4.9), Vec2(0, 4.9)), wallFD);

	walls.createFixture(planck.Edge(Vec2(9, 6.7), Vec2(6, 6.7)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6, 6.7), Vec2(6, 7.7)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6, 7.7), Vec2(6.2, 7.7)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6.2, 7.7), Vec2(6.2, 6.9)), wallFD);
	walls.createFixture(planck.Edge(Vec2(6.2, 6.9), Vec2(9, 6.9)), wallFD);

	var wsh = new createjs.Shape();
	wsh.graphics.setStrokeStyle(2);
	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(.5*scale, .5*scale);
	wsh.graphics.lineTo(.5*scale,9.5*scale);
	wsh.graphics.lineTo(9.5*scale,9.5*scale);
	wsh.graphics.lineTo(9.5*scale,.5*scale);
	wsh.graphics.lineTo(.5*scale,.5*scale);
	wsh.graphics.endStroke();

	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(0*scale, 5.2*scale);
	wsh.graphics.lineTo(4.5*scale,5.2*scale);
	wsh.graphics.lineTo(4.5*scale,5.4*scale);
	wsh.graphics.lineTo(0*scale,5.4*scale);
	wsh.graphics.endStroke();

	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(10*scale, 7.2*scale);
	wsh.graphics.lineTo(6.5*scale,7.2*scale);
	wsh.graphics.lineTo(6.5*scale,8.2*scale);
	wsh.graphics.lineTo(6.7*scale,8.2*scale);
	wsh.graphics.lineTo(6.7*scale,7.4*scale);
	wsh.graphics.lineTo(10*scale,7.4*scale);
	wsh.graphics.endStroke();

	//draw 3D walls
	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(0*scale, 0*scale);
	wsh.graphics.lineTo(.5*scale,.5*scale);
	wsh.graphics.endStroke();
	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(0*scale, 10*scale);
	wsh.graphics.lineTo(.5*scale,9.5*scale);
	wsh.graphics.endStroke();
	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(10*scale, 10*scale);
	wsh.graphics.lineTo(9.5*scale,9.5*scale);
	wsh.graphics.endStroke();
	wsh.graphics.beginStroke("black");
	wsh.graphics.moveTo(10*scale, 0*scale);
	wsh.graphics.lineTo(9.5*scale,.5*scale);
	wsh.graphics.endStroke();

	stage.addChild(wsh);

	var fix = new createjs.Shape();
	fix.graphics.beginStroke("white");
	fix.graphics.setStrokeStyle(4);
	fix.graphics.moveTo(25, 261);
	fix.graphics.lineTo(25,269);
	fix.graphics.endStroke();
	fix.graphics.beginStroke("white");
	fix.graphics.setStrokeStyle(4);
	fix.graphics.moveTo(475, 361);
	fix.graphics.lineTo(475,369);
	fix.graphics.endStroke();
	stage.addChild(fix);

	mouseGround = world.createBody();

	var bed = new Furniture(new createjs.Bitmap(bedImg), 95, 120, -90);
	var constraint1 = new DirConstraint("north", bed, "bednorth", "bnstatus");
	toUpdate.push(bed);
	toUpdate.push(constraint1);
	let couch1 = new Furniture(new createjs.Bitmap(couchImg), 300, 50);
	toUpdate.push(couch1);
	let couch2 = new Furniture(new createjs.Bitmap(couchImg), 400, 170, 90);
	toUpdate.push(couch2);
	toUpdate.push(new Furniture(new createjs.Bitmap(chairImg), 360, 300, 180));
	toUpdate.push(new Furniture(new createjs.Bitmap(chairImg), 410, 300, 180));
	toUpdate.push(new Furniture(new createjs.Bitmap(tableImg), 310, 160, 90));
	let desk = new Furniture(new createjs.Bitmap(deskImg), 150, 400);
	toUpdate.push(desk);
	toUpdate.push(new Furniture(new createjs.Bitmap(armchairImg), 140, 310));
	toUpdate.push(new Furniture(new createjs.Bitmap(standImg), 25, 25, -90));
	toUpdate.push(new Furniture(new createjs.Bitmap(standImg), 25, 215, -90));
	let lamp1 = new Furniture(new createjs.Bitmap(lampImg), 410, 50, 60, true);
	toUpdate.push(lamp1);
	let lamp2 = new Furniture(new createjs.Bitmap(lampImg), 40, 410, 120, true);
	toUpdate.push(lamp2);
	let lamp3 = new Furniture(new createjs.Bitmap(lampImg), 345, 380, 20, true);
	toUpdate.push(lamp3);
	var constraint2 = new ProxiConstraint(bed, 2, 2.6, [lamp1, lamp2, lamp3], "lamprox", "lpstatus");
	toUpdate.push(constraint2);
	var constraint3 = new ProxiConstraint(desk, 1, 2.1, [couch1, couch2], "couprox", "cpstatus");
	toUpdate.push(constraint3);
	stage.on("stagemousemove", function(evt) {
		if(mouseJoint)
			mouseJoint.setTarget({x: evt.stageX / scale, y: evt.stageY / scale});
	});

	createjs.Ticker.framerate = 30;
	createjs.Ticker.addEventListener("tick", update);
}

function update(event)
{
	if(!active)
		return;

	if(document.getElementById("objectives").innerHTML.split("✔").length === 4) { //lol
		active = false;
		var wintxt = new createjs.Text("YAY!\r\nWIN!", "230px Arial", "#ff0180");
		stage.addChild(wintxt);
		stage.update()
	}

	world.step(1 / 30);

	for(var f of toUpdate)
	{
		f.update();
	}

	stage.update();
}
