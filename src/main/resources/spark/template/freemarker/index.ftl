<!doctype html>

<html>

	<head>
	  <title>Ayy lmao <3</title>

	  <!-- Fonts -->
	  <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900,300' rel='stylesheet' type='text/css'>
	  <link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css'>

	  <!-- Stylesheets -->
	 <!-- <link href='css/index.css' rel='stylesheet' type='text/css'> -->
	 <style>
	 /* #00bad6 - darkturquoise 
		#ef563d - tomato
		#F5C70C - gold
		#ffaf00 - orange
		#222128 - darkslategrey
	 */
	 	html, body {
	 		padding: 0;
		   	margin: 0;
		   	background-color: #222128;
			width: 100%;
			position: relative;
			overflow-x: hidden;
	 	}

		.head {
	        background-color: #121212;
	        position: relative;
	        margin: 0;
	        top: 0;
	        left: 0;
	        width: 100%;
	        height: 2%;
	        padding: 3%;
	        padding-left: 10.5%;
	        padding-right: 10.5%;
	        display: flex;
	        flex-direction: row;
	        align-items: center;
	        justify-content: space-between;
	        box-sizing: border-box;
	        color: white;
        }

        .nav {
            position: relative;
            height: 100%;
            width: 20%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .head h1 {
            display: block;
            width: auto;
            height: auto;
            opacity: 0.4;
            transition: opacity 0.2s;
        }

        .head h1:hover {
            cursor: pointer;
            opacity: 1;
        }

        .head h1.active {
            opacity: 1;
        }

		.container {
			position: relative;
			margin: 0 auto;
			width: 100%;
			height: auto;
			padding: 3%;
			padding-left: 10%;
			padding-right: 10%;
			box-sizing: border-box;
			font-family: 'Merriweather', serif;
			overflow: hidden;
		}

		.container:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
		}

		.block {
			min-height: 0;
			position: relative;
			width: 23%;
			padding-bottom: 20%;
			float: left;
			margin: 1%;
			overflow: hidden;
			background-color: #00bad6;
			opacity: 1;
			transition: opacity 0.1s;
		}

		.block-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 10%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			font-family: 'Lato', sans-serif;
			font-size: 1.5em;
		}

		.block:focus, .block-overlay:focus {
			outline: none;
		}

		.block:hover, .block-overlay:hover {
			cursor: pointer;
		}

		.block:hover {
			opacity: 0.8;
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

		h1 {
	        font-size: 1.8em;
	        font-weight: 400;
	        font-family: 'Lato', sans-serif;
        }

		.head h1.bold {
            font-weight: 800;
            font-size: 2.1em;
            opacity: 1;
            font-family: 'Merriweather', serif;
        }

        .head h1.bold:hover {
            opacity: 1;
        }

        a {
            color: white;
            text-decoration: none;
        }
	 </style>

	  <!--[if lt IE 9]>
	  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	  <![endif]-->
	</head>
	
	<body>
		<div class="head">
            <div class="nav">
                <h1 class="active"><a href="/">Play</a></h1>
                <h1><a href="/maker">Make</a></h1>
            </div>
        </div>
		<div class="container">
			<!--<form id="file-form">
              <input type="file" id="file-select" name="file-select" onchange="handleFiles(this)" multiple/>
              <button type="submit" id="upload-button">Upload</button>
            </form>-->

		    <#list expFileNames as expFileName>
			    <a href="/${expFileName}">
			  		<div class="block" style="background-color:#${expColors[expFileName_index]}">
			  			<div class="block-overlay">
			  				${expNames[expFileName_index]}
		  				</div>
			  		</div>
			  	</a>
			</#list>
		</div>
	</body>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
</html>