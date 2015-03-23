<!doctype html>

<html>

	<head>
	  <title>Ayy lmao <3</title>
	
	  <!--[if lt IE 9]>
	  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	  <![endif]-->
	</head>
	
	<body>
	  <#list experiences as exp>
  		${exp_index + 1}. <a href="/${exp}">${exp}</a>
  		<br/>
		</#list>  
	</body>
	
</html>