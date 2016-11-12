const PythonShell = require('python-shell');

const convertImage = (file) => {
	var options = {
	  scriptPath: './menu_reading/',
	  args: [file]
	};

	// TODO update "my_script.py" with actual stript
	return PythonShell.run('my_script.py', options, function (err, results) {
	  console.log('finished');
	  if (err) throw err;

	  return results;
	});
}

const mockConvert = (file) => {
	// console.log(file);
	return {
		pie: {
			cost: 9
		}
	}
}

// TODO switch mock_convert to convertImage
module.exports = {
	convert : mockConvert
}
