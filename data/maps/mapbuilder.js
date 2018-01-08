const fs = require("fs");

if (process.argv[2] === undefined || process.argv[2] === null || process.argv[2] === "") process.exit();

var mapName = process.argv[2];

if (!fs.existsSync("./" + mapName)) process.exit();

var file = fs.readFileSync("./" + mapName, "ascii");

console.log(file);

//find map size
var split = file.split("\n");
var ySize = split.length;
var xSize = 0;

for (var i = 0; i < split.length; i++)
{
	split[i] = split[i].trim();
	if (split[i].length > xSize)
	{
		xSize = split[i].length;
	}
}

//create files
var dir = "./data/maps/" + mapName + "/";
var infoFilePath = dir + "info.json";
if (fs.existsSync(infoFilePath))
{
	console.log("info.json already exists for map");
	process.exit();
}
fs.closeSync(fs.openSync(infoFilePath, "w"));
fs.writeFileSync(infoFilePath, JSON.stringify({
	name: "",
	size: {
		x: xSize,
		y: ySize
	}
}));

split = split.reverse();
for (var y = 0; y < ySize; y++)
{
	for (var x = 0; x < xSize; x++)
	{
		var fileName = x + "," + y + ".json"
		var filePath = dir + fileName;
		
		if (fs.existsSync(filePath))
		{
			console.log(fileName + " already exists for map");
			process.exit();
		}
		
		var tileType = "";
		
		switch(split[y].charAt(x))
		{
			case 'W':
				tileType = "brickwall";
				break;
			case 'G':
				tileType = "grass";
				break;
			case ' ':
				tileType = "empty";
				break;
			default:
				tileType = "?";
				break;
		}
		
		fs.closeSync(fs.openSync(filePath, "wx"));
		fs.writeFileSync(filePath, JSON.stringify({
			tileType: tileType
		}));
	}
}

console.log("done");
