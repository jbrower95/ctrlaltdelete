<!doctype html>

<html>
	<head>
	  <title>Ayy lmao <3</title>

	  <!-- Fonts -->
	  <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900,300' rel='stylesheet' type='text/css'>
	  <link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css'>

	  <!-- Stylesheets -->
	 <link href='lib/css/makerIndex.css' rel='stylesheet' type='text/css'>

      <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
    </head>

    <body>
        <div class="head">
            <div class="nav">
                <h1><a href="/">Play</a></h1>
                <h1 class="active"><a href="/maker">Make</a></h1>
            </div>

            <a href="/make" class="new_experience">New Experience</a>
        </div>
        <div class="container">
            <#list expFileNames as expFileName>
                <a href="/${expFileName}/editor">
                    <div class="block" style="background-color:#${expColors[expFileName_index]}">
                        <div class="block-overlay">
                            ${expNames[expFileName_index]}
                        </div>
                    </div>
                </a>
            </#list>
            <a href="/make">
                <div class="block new">
                    <div class="block-overlay new-overlay">
                        <img src="/lib/images/plus.svg">
                    </div>
                </div>
            </a>
        </div>
    </body>
 </html>