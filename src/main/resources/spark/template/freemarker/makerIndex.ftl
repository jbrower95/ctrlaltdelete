<!doctype html>

<html>

	<head>
	  <title>Ayy lmao <3</title>

	  <!-- Fonts -->
	  <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900,300' rel='stylesheet' type='text/css'>
	  <link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css'>

	  <!-- Stylesheets -->
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
                background-color: #222128;
                position: relative;
                margin: 0;
                top: 0;
                left: 0;
                width: 100%;
                height: 5%;
                padding: 3%;
                padding-left: 10.5%;
                padding-right: 8%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                color: white;
                }

                .head h1 {
                display: block;
                width: auto;
                height: auto;
                }

                .new_experience {
                position: relative;
                right: 4%;
                top: 3%;
                padding: 1%;
                padding-left: 2%;
                padding-right: 2%;
                border: 3px solid white;
                width: auto;
                height: auto;
                background-color: rgba(255,255,255,0);
                color: white;
                font-family: 'Lato', sans-serif;
                font-size: 1.3em;
                font-weight: 700;
                transition: background-color 0.2s, color 0.2s;
                }

                .new_experience:hover {
                cursor: pointer;
                background-color: rgba(255,255,255,1);
                color: #222128;
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

                h1 {
                font-size: 3em;
                font-family: 'Lato', sans-serif;
                }

                a {
                text-decoration: none;
                }
     </style>

      <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
    </head>

    <body>
        <div class="head">
            <h1>Stories</h1>

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
        </div>
    </body>
 </html>