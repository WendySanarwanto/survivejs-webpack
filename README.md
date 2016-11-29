# survivejs-webpack
A sample from learning webpack hosted by [SurvivalJS] (http://survivejs.com/webpack)

###Getting Started###

There are two methods for getting started with this repo.

####Familiar with Git?#####
Checkout this repo, install dependencies, then start the gulp process with the following:

```
	> git clone git@github.com:WendySanarwanto/survivejs-webpack.git
	> cd survivejs-webpack
	> npm install
	> npm start
```

####Not Familiar with Git?#####
Click [here](https://github.com/WendySanarwanto/survivejs-webpack) then download the .zip file.  Extract the contents of the zip file, then open your terminal, change to the project directory, and:

```
	> npm install
	> npm start
```

####Generating build's statistic in a .JSON file
Run these command, if you wish to generate build's statistics and contain the result in a json file:

```
	> npm run build:stats
	OR, if you wish to build production code:
	> npm run buildProd:stats
```

The build statistic can be found in `build-stats.json` and `build-stats-prod.json`. Then, you can visualise the information inside these `.json` files by uploading them on these following sites:

```
	> http://webpack.github.io/analyse/
	> https://alexkuz.github.io/webpack-chart/
	> https://chrisbateman.github.io/webpack-visualizer/
```
