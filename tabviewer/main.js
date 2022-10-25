const port = 8080,
express = require("express"),
Pool = require('pg').Pool,
pool = new Pool(),
geoip = require('geoip-lite')

app = express();
app.set("view engine", "ejs")

app.use(express.static(__dirname+"/"))
app.use(express.static(__dirname + '/../lib/'))

app.get("/dbview", (req, res) => {
	var geo = geoip.lookup(req.ip);
	console.log({
		"resource": "dbview",
		'datetime': Date(),
		"ip": req.ip,
		"browser": req.headers["user-agent"],
		"Country": (geo ? geo.country: "Unknown"),
		"Region": (geo ? geo.region: "Unknown")
	});
	res.render("index");
});

app.post("/getData", express.json(), (req,res) => {

	const { query } = req.body

	var geo = geoip.lookup(req.ip);

	pool.query(query,(error,results) => {
		if (error){
			console.log({
							"resource": "data",
							"query": query,
							"status": "fail",
							"err": error,
							'datetime': Date(),
							"ip": req.ip,
							"browser": req.headers["user-agent"],
							"Country": (geo ? geo.country: "Unknown"),
							"Region": (geo ? geo.region: "Unknown")
						});
			res.status(500).json({'data':[]})
		}
		else
		{
			console.log({
							"resource": "data",
							"query": query,
							"status": "success",
							"err": "null",
							'datetime': Date(),
							"ip": req.ip,
							"browser": req.headers["user-agent"],
							"Country": (geo ? geo.country: "Unknown"),
							"Region": (geo ? geo.region: "Unknown")
						});
			res.status(200).json({'data':results.rows})
		}
	})

});

app.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});