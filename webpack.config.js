module.exports={
	entry: {
		app: ['./src/entry.js']
	},

	output: {
		path: './data/',
		filename: 'entry.js'
	},
	module: {
		loaders: [
			{test: /\.styl$/, loaders: ['style', 'css', 'stylus']}
		]
	}
}
