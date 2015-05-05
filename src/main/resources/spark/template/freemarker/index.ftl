<!doctype html>

<html>

	<head>
	  <title>Ayy lmao <3</title>

	  <!-- Fonts -->
	  <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900,300' rel='stylesheet' type='text/css'>
	  <link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css'>

	  <!-- Stylesheets -->
	  <link href='lib/css/index.css' rel='stylesheet' type='text/css'>

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