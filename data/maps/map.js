const fs = require("fs");
/*
class Map {	
	constructor(mapFolderName) {		
		this.filePath = "./data/maps/" + mapFolderName + "/";
		
		if (!fs.existsSync(this.filePath + "info.json")) 
		{
			var err = "Invalid File Path - Cannot Load Map";
			throw err;
		}
		
		//load tile files
	}
	
	
	
	
	// read only
	get name() {
		return this._infoFile().name;
	}
	
	get size() {
		return this._infoFile().size;
	}
	
	//private
	
	_infoFile() {
		return JSON.parse(fs.readFileSync(this.filePath + "info.json"));
	}
}
*/

function Map(mapFolderName) {
	//read only stuff
	this.getName = function() {
		return readInfoFile().name;
	}
	
	this.getSize = function() {
		return readInfoFile().size;
	}
	
	//private stuff
	var that = this;
	function readInfoFile() {
		return JSON.parse(fs.readFileSync(that.filePath + "info.json"));
	}
		
	//constructor
	this.filePath = "./data/maps/" + mapFolderName + "/";
	if (!fs.existsSync(this.filePath + "info.json")) 
	{
		var err = "Invalid File Path '" + this.filePath + "'\nCannot Load Map";
		throw err;
	}
	
	//tiles
	this.tiles = [];
	this.tiles.length = this.getSize().x;
	for (var x = 0; x < this.tiles.length; x++)
	{
		this.tiles[x] = [];
		this.tiles[x].length = this.getSize().y;
	}
	
	for (var x = 0; x < this.getSize().x; x++)
	{
		for (var y = 0; y < this.getSize().y; y++)
		{
			this.tiles[x][y] = new Tile(this.filePath, {x: x, y: y});
		}
	}
}

function Tile(mapPath, pos) {
	//private stuff
	var that = this;
	function readFile() {
		return JSON.parse(fs.readFileSync(that.filePath));
	}
	var tileType = readFile().tileType;
		
	//constructor
	this.filePath = mapPath + pos.x + "," + pos.y + ".json";
	if (!fs.existsSync(this.filePath))
	{
		var err = "Invalid File Path '" + this.filePath + "'\nCannot Load Tile";
		throw err;
	}
	
	
}


exports.Map = Map;






	//var filePath
	//var tiles = [map tiles objects, loaded from files]
	//var name
	//var size