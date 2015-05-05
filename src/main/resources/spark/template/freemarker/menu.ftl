<!doctype html>

<html>

	<head>
	  <title>${title}</title>

	  <!-- Fonts -->
	  <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900,300' rel='stylesheet' type='text/css'>
	  <link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css'>

	  <style>
	  	html, body {
	 		padding: 0;
		   	margin: 0;
		   	background-color: #222128;
			width: 100%;
			height: 100%;
			position: relative;
			overflow-x: hidden;
	 	}

	  	.container {
	  		position: relative;
			margin: 0 auto;
			width: 100%;
			height: 100%;
			padding: 3%;
			padding-left: 10%;
			padding-right: 10%;
			color: white;
			box-sizing: border-box;
	  	}

	  	.turq {
			background-color: #00bad6;
		}

		.tomato {
			background-color: #ef563d;
		}

		.gold {
			background-color: #F5C70C;
		}

		.orange {
			background-color: orange;
		}

		.bottom {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 20%;
			width: 100%;
			background-color: #222128;
			padding: 4%;
			text-align: center;
			box-sizing: border-box;
			color: white;
			font-size: 3em;
			font-family: 'Lato', sans-serif;
			transition: background-color 0.1s, height 0.1s;
		}

		.bottom:hover {
			background-color: black;
			height: 25%;
		}

		.bottom:focus {
			outline: none;
		}

	  	h1 {
	  		font-family: 'Lato', sans-serif;
	  		font-size: 4em;
	  		margin-bottom: 0;
	  	}

	  	 p {
	  	 	margin-top: 30px;
	  	 	font-family: 'Merriweather', serif;
	  	 	font-size: 1.3em;
	  	 	line-height: 1.5em;
	  	 }
	  </style>
	
	  <!--[if lt IE 9]>
	  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	  <![endif]-->
	</head>
	
	<body>
		<div class="container" style="background-color:#${color}">
		  	<h1>${title}</h1>
		  	<p>${description}</p>

		  	<a href="${playLink}">
			  	<div class="bottom">
				  	Play!
		  		</div>
	  		</a>
	  	</div>
	</body>
	
</html>