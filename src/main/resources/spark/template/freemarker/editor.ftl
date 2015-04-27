<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>

    <!-- Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900,300' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Merriweather:400,700,900,300' rel='stylesheet' type='text/css'>

    <style>
        html {
            position: relative;
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        top: 0;
        overflow-x: hidden;
        }
        body {
            background-color: #222128;
        height: 100%;
        position: relative;
        padding: 0;
        margin: 0;
        top: 0;
        }

        hr {
            border: 0;
            height: 1px;
            background-color: rgba(255,255,255,0.4);
            margin-bottom: 2%;
            margin-top: 2%;
        }

        .container {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
        }

        .container:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
        }

        .sidebar {
            position: relative;
            width: 22.5%;
            height: 100%;
            margin: 0;
            float: left;
            padding: 2.5%;
            box-sizing: border-box;
        }

        .sidebar-title {
        color: white;
        font-family: 'Lato', sans-serif;
        font-size: 1.5em;
        }

        .main {
            position: relative;
            width: 75.5%;
            height: 100%;
            float: right;
            padding: 2.5%;
            box-sizing: border-box;
        }

        input[type=text] {
            background-color: transparent;
            border: 0;
            border-bottom: 1px solid white;
            color: white;
            width: 100%;
            padding-bottom: 10px;
            transition: border 0.2s;
        }

        input[type=text]:focus {
            outline: none;
            border-bottom: 3px solid white;
        }

        textarea {
            background-color: transparent;
            border: 0;
            color: white;
            font-family: 'Merriweather', serif;
            position: relative;
            width: 85%;
            height: 15%;
            resize: none;
            padding: 5px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        textarea:focus {
        outline: none;
        opacity: 1;
        }


        .title {
            font-family: 'Lato', sans-serif;
            font-size: 2.3em;
            display: block;
            margin-bottom: 2%;
        }

        .side-title {
            font-family: 'Lato', sans-serif;
            font-size: 1.3em;
            display: block;
            margin-bottom: 2%;
            color: white;
        }

        .description {
            font-family: 'Merriweather', serif;
        }

        .settings {
            position: relative;
            width: 85%;
            height: auto;
            font-family: 'Merriweather', serif;
            color: white;
            margin-top: 5%;
        }

        .settings-title {
            color: white;
            font-family: 'Lato', sans-serif;
            font-size: 1.8em;
            font-weight: 700;
        }

        .settings-bar {
            position: relative;
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 4%;
        }

        .bar-block {
            position: relative;
            width: 50%;
            height: auto;
        }

        .label {
            font-size: 1.3em;
        }

        .answers {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        input[type=radio] {
            position: absolute;
            left: -2040px;
        }

        input[type=radio] + label {
            opacity: .6;
            transition: opacity 0.2s;
            font-size: 1em;
            text-align: center;
        }

        input[type=radio] + label:hover {
            cursor: pointer;
            opacity: .9;
        }

        input[type=radio]:checked + label {
            opacity: 1;
        }

        .button {
        padding: 2%;
        padding-left: 4%;
        padding-right: 4%;
        width: 40%;
        }

        .color-block {
            position: relative;
            height: 25px;
            width: 100px;
        }

        .c00bad6 {
        background-color: #00bad6;
        }

        .cef563d {
        background-color: #ef563d;
        }

        .cF5C70C {
        background-color: #F5C70C;
        }

        .cffaf00 {
        background-color: #ffaf00;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar c${color}">
            <span class="side-title">${title}</span>
        </div>

        <div class="main">
            <input type="text" class="title" name="experience-title" value="${title}" />

            <textarea class="description" name="experience-title">${description}</textarea>

            <div class="settings">
                <span class="settings-title">Settings</span>

                <div class="settings-bar">
                    <div class="bar-block label">Order Scores</div>
                    <div class="bar-block answers">
                        <!-- Low to High Score Ranking -->
                        <input type="radio" name="score-ranking" id="low-to-high" value="low-to-high" checked>
                        <label for="low-to-high" class="button c${color}">Low to High</label>
                        <!-- High to Low Score Ranking -->
                        <input type="radio" name="score-ranking" id="high-to-low" value="high-to-low">
                        <label for="high-to-low" class="button c${color}">High to Low</label>
                    </div>
                </div>

                <div class="settings-bar">
                    <div class="bar-block label">Theme Color</div>
                    <div class="bar-block answers">
                        <input type="radio" name="theme-color" id="00bad6" value="00bad6" checked>
                        <label for="00bad6"><div class="color-block c00bad6"></div></label>

                        <input type="radio" name="theme-color" id="ef563d" value="ef563d">
                        <label for="ef563d"><div class="color-block cef563d"></div></label>

                        <input type="radio" name="theme-color" id="ffaf00" value="ffaf00">
                        <label for="ffaf00"><div class="color-block cffaf00"></div></label>

                        <input type="radio" name="theme-color" id="F5C70C" value="F5C70C">
                        <label for="F5C70C"><div class="color-block cF5C70C"></div></label>

                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>